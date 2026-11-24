import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Check,
  Minus,
  Plus,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import { buildTeams, type TeamItem } from './data/mascots';
import { GachaStage, type DrawPhase } from './components/GachaStage';
import { SpotlightStage } from './components/SpotlightStage';
import { CuteMascot } from './components/CuteMascot';
import { sound } from './utils/sound';
import { pickSpacedTeam, generateSpacedOrder } from './utils/drawLogic';

type StageMode = 'gacha' | 'spotlight';

export default function App() {
  const [teamCount, setTeamCount] = useState<number>(6);
  const [teamCountInput, setTeamCountInput] = useState<string>('6');
  const [customNames, setCustomNames] = useState<Record<number, string>>({});
  const [stageMode, setStageMode] = useState<StageMode>('gacha');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [presentedOrder, setPresentedOrder] = useState<number[]>([]);
  const [drawPhase, setDrawPhase] = useState<DrawPhase>('IDLE');
  const [isHopping, setIsHopping] = useState<boolean>(false);
  const [highlightedTeamId, setHighlightedTeamId] = useState<number | null>(null);
  const [currentWinner, setCurrentWinner] = useState<TeamItem | null>(null);
  const [confettiKey, setConfettiKey] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const timersRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  const teams = useMemo(
    () => buildTeams(teamCount, customNames),
    [teamCount, customNames]
  );

  // Strictly exclude already-presented teams so duplicates can never happen
  const eligibleTeams = useMemo(
    () => teams.filter((t) => !presentedOrder.includes(t.id)),
    [teams, presentedOrder]
  );

  const isAnimating = drawPhase === 'MIXING' || drawPhase === 'DROPPING' || isHopping;
  const canDraw = eligibleTeams.length > 0 && !isAnimating;

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const applyTeamCount = useCallback(
    (nextCount: number) => {
      const clamped = Math.max(2, Math.min(20, nextCount));
      clearAllTimers();
      setTeamCount(clamped);
      setTeamCountInput(String(clamped));
      setPresentedOrder((prev) => prev.filter((id) => id <= clamped));
      setDrawPhase('IDLE');
      setIsHopping(false);
      setHighlightedTeamId(null);
      setCurrentWinner((prev) => (prev && prev.id <= clamped ? prev : null));
    },
    [clearAllTimers]
  );

  const handleTeamCountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTeamCountInput(val);
    const parsed = parseInt(val, 10);
    if (!Number.isNaN(parsed) && parsed >= 2 && parsed <= 20) {
      applyTeamCount(parsed);
    }
  };

  const handleTeamCountBlur = () => {
    const parsed = parseInt(teamCountInput, 10);
    if (Number.isNaN(parsed)) {
      setTeamCountInput(String(teamCount));
    } else {
      applyTeamCount(parsed);
    }
  };

  const recordPresented = useCallback((teamId: number) => {
    setPresentedOrder((prev) => (prev.includes(teamId) ? prev : [...prev, teamId]));
  }, []);

  const handleReset = useCallback(() => {
    sound.unlock();
    clearAllTimers();
    setPresentedOrder([]);
    setDrawPhase('IDLE');
    setIsHopping(false);
    setHighlightedTeamId(null);
    setCurrentWinner(null);
    sound.playReset();
  }, [clearAllTimers]);

  const handleDrawSingle = useCallback(() => {
    if (!canDraw) return;
    sound.unlock();
    clearAllTimers();

    const pool = eligibleTeams;
    const lastId =
      presentedOrder.length > 0
        ? presentedOrder[presentedOrder.length - 1]
        : null;
    const chosen = pickSpacedTeam(pool, lastId);
    const pickedIndex = Math.max(
      0,
      pool.findIndex((t) => t.id === chosen.id)
    );
    const isFinalTeam = pool.length === 1;

    if (stageMode === 'gacha') {
      setDrawPhase('MIXING');
      setCurrentWinner(chosen);
      sound.playCrank();

      // Cute bubbly tumbling ticks while capsules swirl inside dome
      [180, 340, 500, 660, 820, 980].forEach((ms, i) => {
        scheduleTimeout(() => sound.playTumble(i), ms);
      });

      // Capsule drops out with a cartoon bounce
      scheduleTimeout(() => {
        setDrawPhase('DROPPING');
        sound.playBounce();
      }, 1150);

      // Capsule pops open & reveals mascot!
      scheduleTimeout(() => {
        setDrawPhase('REVEALED');
        setConfettiKey((k) => k + 1);
        recordPresented(chosen.id);
        sound.playPop();
        scheduleTimeout(() => sound.playFanfare(isFinalTeam), 110);
      }, 1850);
    } else {
      // Spotlight hop mode
      setIsHopping(true);
      setCurrentWinner(null);
      setDrawPhase('IDLE');

      const totalSteps = Math.max(10, Math.min(18, pool.length * 3));
      let elapsed = 0;

      for (let step = 0; step < totalSteps; step++) {
        // Gradually slow down the hops for dramatic suspense
        const progress = step / totalSteps;
        const interval = Math.round(75 + Math.pow(progress, 2.1) * 240);
        elapsed += interval;

        const isLast = step === totalSteps - 1;
        const targetTeam = isLast
          ? chosen
          : pool[(pickedIndex + step + 1) % pool.length];

        scheduleTimeout(() => {
          setHighlightedTeamId(targetTeam.id);
          sound.playTick(step);

          if (isLast) {
            setIsHopping(false);
            setCurrentWinner(chosen);
            setDrawPhase('REVEALED');
            setConfettiKey((k) => k + 1);
            recordPresented(chosen.id);
            sound.playPop();
            scheduleTimeout(() => sound.playFanfare(isFinalTeam), 100);
          }
        }, elapsed);
      }
    }
  }, [canDraw, clearAllTimers, eligibleTeams, presentedOrder, recordPresented, scheduleTimeout, stageMode]);

  const handleDrawAllRemaining = useCallback(() => {
    if (!canDraw) return;
    sound.unlock();
    clearAllTimers();

    const lastId =
      presentedOrder.length > 0
        ? presentedOrder[presentedOrder.length - 1]
        : null;
    const shuffled = generateSpacedOrder(eligibleTeams, lastId);

    setDrawPhase('MIXING');
    setIsHopping(true);
    sound.playCrank();

    shuffled.forEach((team, idx) => {
      scheduleTimeout(() => {
        setHighlightedTeamId(team.id);
        sound.playTumble(idx);
        recordPresented(team.id);

        if (idx === shuffled.length - 1) {
          setIsHopping(false);
          setCurrentWinner(shuffled[0]);
          setDrawPhase('REVEALED');
          setConfettiKey((k) => k + 1);
          sound.playPop();
          scheduleTimeout(() => sound.playFanfare(true), 100);
        }
      }, 450 + idx * 140);
    });
  }, [canDraw, clearAllTimers, eligibleTeams, presentedOrder, recordPresented, scheduleTimeout]);

  const handleCopyOrder = useCallback(async () => {
    if (presentedOrder.length === 0) return;
    const lines = presentedOrder.map((id, index) => {
      const found = teams.find((t) => t.id === id);
      return `${index + 1}. ${found ? found.name : `${id}팀`}`;
    });
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      scheduleTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback ignored if blocked in sandbox
    }
  }, [presentedOrder, scheduleTimeout, teams]);

  const handleTeamNameChange = (id: number, value: string) => {
    setCustomNames((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8EF] text-[#2B2118]">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FDF8EF]/95 backdrop-blur-sm border-b-2 border-[#E6D9C6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <a
            href="#stage"
            className="font-display text-2xl tracking-tight text-[#2B2118] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F25C3B] rounded-md"
          >
            두근두근 발표 추첨기
          </a>

          {/* Zone 2: Clean Single-line Text Navigation Links */}
          <nav
            aria-label="주요 메뉴"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6E5C4F]"
          >
            <a
              href="#stage"
              className="hover:text-[#2B2118] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              추첨 무대
            </a>
            <a
              href="#team-settings"
              className="hover:text-[#2B2118] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              팀 수 설정
            </a>
            <a
              href="#order-history"
              className="hover:text-[#2B2118] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              발표 순서
            </a>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-sm font-semibold text-[#2B2118] bg-[#FFFDF9] hover:bg-[#F4ECE1] border-2 border-[#2B2118] rounded-xl shadow-[0_2px_0_0_#2B2118] active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F25C3B]"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>순서 초기화</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Focal Anchor: Cute Animation Stage */}
          <section id="stage" className="lg:col-span-8 flex flex-col gap-4">
            {/* Stage Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Interactive Stage Mode Tabs */}
              <div
                role="tablist"
                aria-label="애니메이션 방식 선택"
                className="inline-flex items-center gap-1 p-1 bg-[#F0E6D6] border-2 border-[#E0D2BE] rounded-xl"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={stageMode === 'gacha'}
                  onClick={() => {
                    sound.unlock();
                    sound.playButton(0);
                    setStageMode('gacha');
                  }}
                  disabled={isAnimating}
                  className={`px-4 py-2 min-h-[40px] text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed ${
                    stageMode === 'gacha'
                      ? 'bg-[#FFFDF9] text-[#2B2118] shadow-sm'
                      : 'text-[#6E5C4F] hover:text-[#2B2118]'
                  }`}
                >
                  캡슐 뽑기
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={stageMode === 'spotlight'}
                  onClick={() => {
                    sound.unlock();
                    sound.playButton(1);
                    setStageMode('spotlight');
                  }}
                  disabled={isAnimating}
                  className={`px-4 py-2 min-h-[40px] text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed ${
                    stageMode === 'spotlight'
                      ? 'bg-[#FFFDF9] text-[#2B2118] shadow-sm'
                      : 'text-[#6E5C4F] hover:text-[#2B2118]'
                  }`}
                >
                  스포트라이트 점프
                </button>
              </div>

              {/* Clean Unboxed Status Metadata & Sound Toggle */}
              <div className="flex items-center gap-4">
                <div className="text-sm text-[#6E5C4F] tabular-nums whitespace-nowrap">
                  <span>전체 {teamCount}팀</span>
                  <span aria-hidden="true" className="mx-2">·</span>
                  <span>남은 팀 {eligibleTeams.length}</span>
                  <span aria-hidden="true" className="mx-2">·</span>
                  <span>완료 {presentedOrder.length}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !soundEnabled;
                    sound.enabled = next;
                    setSoundEnabled(next);
                    if (next) {
                      sound.unlock();
                      sound.playPop();
                    }
                  }}
                  aria-label={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] text-xs font-semibold text-[#6E5C4F] hover:text-[#2B2118] bg-[#FFFDF9] border border-[#E0D2BE] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F25C3B]"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[#F25C3B]" aria-hidden="true" />
                  ) : (
                    <VolumeX className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{soundEnabled ? '효과음 켜짐' : '음소거'}</span>
                </button>
              </div>
            </div>

            {/* Main Animated Stage Surface */}
            <div className="stage-backdrop rounded-3xl border-[3px] border-[#2B2118] shadow-[0_8px_0_0_#E6D9C6] overflow-hidden">
              {stageMode === 'gacha' ? (
                <GachaStage
                  eligibleTeams={eligibleTeams}
                  allTeamsCount={teamCount}
                  phase={drawPhase}
                  winner={currentWinner}
                  confettiKey={confettiKey}
                  onTriggerDraw={handleDrawSingle}
                  canDraw={canDraw}
                />
              ) : (
                <SpotlightStage
                  teams={teams}
                  presentedIds={presentedOrder}
                  isHopping={isHopping}
                  highlightedTeamId={highlightedTeamId}
                  winner={currentWinner}
                  confettiKey={confettiKey}
                />
              )}
            </div>

            {/* Primary Draw Action Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                type="button"
                onClick={
                  eligibleTeams.length === 0 && !isAnimating
                    ? handleReset
                    : handleDrawSingle
                }
                disabled={isAnimating}
                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[54px] bg-[#F25C3B] hover:bg-[#DF4C2C] disabled:bg-[#D9CBB8] text-white disabled:text-[#7D6A5B] font-display text-xl rounded-2xl border-[3px] border-[#2B2118] shadow-[0_4px_0_0_#2B2118] active:translate-y-0.5 active:shadow-none disabled:shadow-none disabled:cursor-not-allowed transition-all whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B2118]"
              >
                {eligibleTeams.length === 0 && !isAnimating ? (
                  <RotateCcw className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                )}
                <span>
                  {isAnimating
                    ? '두근두근 추첨 중...'
                    : eligibleTeams.length === 0
                      ? '모든 팀 선정 완료 · 새로 시작하기'
                      : presentedOrder.length > 0
                        ? '다음 발표 팀 뽑기!'
                        : '발표 팀 뽑기!'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDrawAllRemaining}
                disabled={!canDraw || eligibleTeams.length <= 1}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[54px] bg-[#FFFDF9] hover:bg-[#F4ECE1] disabled:opacity-50 text-[#2B2118] font-semibold text-sm rounded-2xl border-[2.5px] border-[#2B2118] shadow-[0_4px_0_0_#E6D9C6] active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F25C3B]"
              >
                <Shuffle className="w-4 h-4" aria-hidden="true" />
                <span>남은 팀 전체 순서 정하기</span>
              </button>
            </div>
          </section>

          {/* Right Sidebar: Team Count Input, Roster & Order History */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Team Setup Card */}
            <section
              id="team-settings"
              className="bg-[#FFFDF9] border-2 border-[#E0D2BE] rounded-2xl p-5"
            >
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-display text-xl text-[#2B2118]">
                  참여 팀 수 입력
                </h2>
                <span className="text-xs text-[#7D6A5B] tabular-nums">
                  2 ~ 20팀
                </span>
              </div>

              {/* Numeric Stepper + Direct Input */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    sound.unlock();
                    sound.playButton(-1);
                    applyTeamCount(teamCount - 1);
                  }}
                  disabled={teamCount <= 2 || isAnimating}
                  aria-label="팀 수 줄이기"
                  className="w-11 h-11 rounded-xl bg-[#F4ECE1] hover:bg-[#EAE0D0] disabled:opacity-40 border border-[#D8C8B2] flex items-center justify-center text-[#2B2118] transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F25C3B]"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="relative flex-1">
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={teamCountInput}
                    onChange={handleTeamCountInputChange}
                    onBlur={handleTeamCountBlur}
                    disabled={isAnimating}
                    aria-label="참여 팀 수"
                    className="w-full h-11 px-3 pr-9 text-center font-mono font-bold text-xl tabular-nums bg-white border-2 border-[#2B2118] rounded-xl text-[#2B2118] focus:outline-none focus:ring-2 focus:ring-[#F25C3B]"
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#6E5C4F]">
                    팀
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.unlock();
                    sound.playButton(1);
                    applyTeamCount(teamCount + 1);
                  }}
                  disabled={teamCount >= 20 || isAnimating}
                  aria-label="팀 수 늘리기"
                  className="w-11 h-11 rounded-xl bg-[#F4ECE1] hover:bg-[#EAE0D0] disabled:opacity-40 border border-[#D8C8B2] flex items-center justify-center text-[#2B2118] transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F25C3B]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Team Count Presets */}
              <div className="grid grid-cols-5 gap-1.5 mt-3">
                {[4, 6, 8, 10, 12].map((preset, idx) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      sound.unlock();
                      sound.playButton(idx * 0.4);
                      applyTeamCount(preset);
                    }}
                    disabled={isAnimating}
                    className={`py-2 min-h-[40px] rounded-lg text-xs font-semibold tabular-nums border transition-colors cursor-pointer disabled:cursor-not-allowed ${
                      teamCount === preset
                        ? 'bg-[#2B2118] text-white border-[#2B2118]'
                        : 'bg-[#F8F2E8] hover:bg-[#EFE4D4] text-[#5C4C3F] border-[#E2D4C0]'
                    }`}
                  >
                    {preset}팀
                  </button>
                ))}
              </div>

              {/* Guaranteed Non-Duplicate & Spaced Rule Notice */}
              <div className="mt-5 pt-4 border-t border-[#EFE4D4]">
                <p className="text-sm font-semibold text-[#2B2118]">
                  중복 · 연속 팀 방지 적용 중
                </p>
                <p className="text-xs text-[#7D6A5B] mt-0.5">
                  뽑힌 팀은 제외되며, 직전 팀과 연속된 번호는 간격을 두고 선택해요.
                </p>
              </div>

              {/* Inline Editable Team Roster */}
              <div className="mt-5 pt-4 border-t border-[#EFE4D4]">
                <div className="flex items-baseline justify-between mb-2.5">
                  <h3 className="text-sm font-semibold text-[#2B2118]">
                    팀 이름 편집
                  </h3>
                  <span className="text-xs text-[#8C7768]">
                    클릭해서 수정
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5">
                  {teams.map((team) => {
                    const orderIdx = presentedOrder.indexOf(team.id);
                    const isDone = orderIdx !== -1;

                    return (
                      <div
                        key={team.id}
                        className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl hover:bg-[#F8F2E8] transition-colors"
                      >
                        <CuteMascot
                          theme={team.mascot}
                          mood={isDone ? 'resting' : 'idle'}
                          size={30}
                          className="shrink-0"
                        />
                        <input
                          type="text"
                          value={customNames[team.id] ?? ''}
                          placeholder={`${team.id}팀`}
                          maxLength={16}
                          onChange={(e) =>
                            handleTeamNameChange(team.id, e.target.value)
                          }
                          aria-label={`${team.id}팀 이름`}
                          className="flex-1 min-w-0 bg-transparent text-sm font-medium text-[#2B2118] placeholder:text-[#7D6A5B] border-b border-transparent focus:border-[#2B2118] focus:outline-none py-0.5"
                        />
                        <span className="text-xs text-[#7D6A5B] tabular-nums whitespace-nowrap shrink-0">
                          {isDone ? `${orderIdx + 1}번째 완료` : '대기'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Presentation Order History Card */}
            <section
              id="order-history"
              className="bg-[#FFFDF9] border-2 border-[#E0D2BE] rounded-2xl p-5"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="font-display text-xl text-[#2B2118]">
                  발표 순서 기록
                </h2>

                {presentedOrder.length > 0 && (
                  <button
                    type="button"
                    onClick={handleCopyOrder}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-semibold text-[#5C4C3F] hover:text-[#2B2118] bg-[#F4ECE1] hover:bg-[#EAE0D0] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#2A9D8F]" aria-hidden="true" />
                        <span>복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>순서 복사</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {presentedOrder.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-[#7D6A5B]">
                    아직 선정된 발표 팀이 없어요.
                  </p>
                  <p className="text-xs text-[#9C8878] mt-1">
                    뽑기 버튼을 누르면 순서대로 기록됩니다.
                  </p>
                </div>
              ) : (
                <ol className="divide-y divide-[#EFE4D4]">
                  {presentedOrder.map((teamId, idx) => {
                    const team = teams.find((t) => t.id === teamId);
                    if (!team) return null;
                    const isLatest = idx === presentedOrder.length - 1;

                    return (
                      <li
                        key={`${teamId}-${idx}`}
                        className="flex items-center justify-between gap-3 py-2.5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs font-bold text-[#7D6A5B] tabular-nums w-6 shrink-0">
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <CuteMascot
                            theme={team.mascot}
                            mood={isLatest ? 'excited' : 'idle'}
                            size={30}
                            className="shrink-0"
                          />
                          <span className="font-semibold text-sm text-[#2B2118] truncate">
                            {team.name}
                          </span>
                        </div>

                        <span className="text-xs text-[#7D6A5B] whitespace-nowrap shrink-0">
                          {team.mascot.animalName}
                          {isLatest ? ' · 최근' : ''}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
