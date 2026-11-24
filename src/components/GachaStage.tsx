import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { TeamItem } from '../data/mascots';
import { CuteMascot } from './CuteMascot';
import { ConfettiBurst } from './ConfettiBurst';

export type DrawPhase = 'IDLE' | 'MIXING' | 'DROPPING' | 'REVEALED';

interface GachaStageProps {
  eligibleTeams: TeamItem[];
  allTeamsCount: number;
  phase: DrawPhase;
  winner: TeamItem | null;
  confettiKey: number;
  onTriggerDraw: () => void;
  canDraw: boolean;
}

// Deterministic cozy resting positions inside the dome for up to 20 capsules
const DOME_SLOTS = [
  { x: -64, y: 38, r: -14 },
  { x: -22, y: 42, r: 8 },
  { x: 22, y: 40, r: -8 },
  { x: 64, y: 36, r: 16 },
  { x: -45, y: 12, r: 12 },
  { x: 0, y: 15, r: -6 },
  { x: 46, y: 11, r: -15 },
  { x: -72, y: 14, r: -22 },
  { x: 72, y: 15, r: 20 },
  { x: -25, y: -14, r: 10 },
  { x: 24, y: -13, r: -12 },
  { x: -56, y: -12, r: -18 },
  { x: 56, y: -10, r: 15 },
  { x: 0, y: -38, r: 5 },
  { x: -36, y: -36, r: -16 },
  { x: 36, y: -35, r: 14 },
  { x: -16, y: 26, r: 18 },
  { x: 18, y: 27, r: -18 },
  { x: -52, y: 26, r: 6 },
  { x: 52, y: 25, r: -9 },
];

export const GachaStage: React.FC<GachaStageProps> = ({
  eligibleTeams,
  allTeamsCount,
  phase,
  winner,
  confettiKey,
  onTriggerDraw,
  canDraw,
}) => {
  const prefersReduced = useReducedMotion();
  const isMixing = phase === 'MIXING';
  const isDropping = phase === 'DROPPING';
  const isRevealed = phase === 'REVEALED';

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[430px] sm:min-h-[470px] w-full py-5 px-4 select-none">
      <ConfettiBurst triggerKey={confettiKey} />

      {/* Main layout: Gacha Machine + Reveal Pedestal */}
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-2xl my-auto">
        {/* Cute Gacha Dispenser Machine */}
        <div className="relative flex flex-col items-center shrink-0">
          {/* Top Cap */}
          <div className="w-24 h-5 bg-[#F25C3B] border-[3px] border-[#2B2118] rounded-t-xl z-10 -mb-[3px] flex items-center justify-center">
            <div className="w-10 h-1.5 bg-[#FF9E88] rounded-full" />
          </div>

          {/* Glass Dome */}
          <div className="relative w-56 h-52 sm:w-60 sm:h-56 rounded-full bg-white/95 border-[3px] border-[#2B2118] shadow-[0_6px_0_0_#E6D9C6] overflow-hidden flex items-center justify-center">
            {/* Soft inner sky tint */}
            <div
              className="absolute inset-2 rounded-full bg-gradient-to-b from-[#FFFDF9] to-[#F7EFE2] pointer-events-none"
              aria-hidden="true"
            />

            {/* Capsules inside the dome */}
            <div className="relative w-full h-full flex items-center justify-center">
              {eligibleTeams.length === 0 ? (
                <div className="text-center px-6 z-10">
                  <p className="font-display text-lg text-[#6E5C4F]">
                    모든 팀 발표 완료!
                  </p>
                  <p className="text-xs text-[#8C7768] mt-1">
                    초기화하면 다시 뽑을 수 있어요
                  </p>
                </div>
              ) : (
                eligibleTeams.map((team, idx) => {
                  const slot = DOME_SLOTS[idx % DOME_SLOTS.length];
                  const mixOffsetX = ((idx % 5) - 2) * 34;
                  const mixOffsetY = ((idx % 4) - 1.5) * 32;

                  return (
                    <motion.div
                      key={team.id}
                      initial={false}
                      animate={
                        isMixing && !prefersReduced
                          ? {
                              x: [slot.x, mixOffsetX, -mixOffsetX * 0.8, slot.x],
                              y: [slot.y, -48 + (idx % 3) * 18, mixOffsetY, slot.y],
                              rotate: [slot.r, slot.r + 180, slot.r - 140, slot.r],
                            }
                          : {
                              x: slot.x,
                              y: slot.y,
                              rotate: slot.r,
                            }
                      }
                      transition={
                        isMixing && !prefersReduced
                          ? {
                              duration: 0.42 + (idx % 3) * 0.08,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }
                          : {
                              type: 'spring',
                              stiffness: 220,
                              damping: 18,
                            }
                      }
                      className="absolute w-11 h-11 rounded-full border-[2.5px] border-[#2B2118] overflow-hidden shadow-sm flex flex-col"
                      title={team.name}
                    >
                      <div
                        className="h-1/2 w-full flex items-center justify-center text-[11px] font-mono font-bold leading-none"
                        style={{
                          backgroundColor: team.mascot.capsuleTop,
                          color: team.mascot.capsuleText,
                        }}
                      >
                        {team.id}
                      </div>
                      <div className="h-1/2 w-full bg-[#FFFDF9] border-t-[2px] border-[#2B2118]" />
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Glass reflection highlight */}
            <div
              className="pointer-events-none absolute top-5 left-6 w-12 h-5 rounded-full bg-white/80 -rotate-35"
              aria-hidden="true"
            />
          </div>

          {/* Machine Base */}
          <div className="relative w-52 sm:w-56 bg-[#F25C3B] border-[3px] border-[#2B2118] rounded-2xl -mt-5 pt-6 pb-4 px-4 shadow-[0_6px_0_0_#2B2118] flex items-center justify-between gap-3">
            {/* Chute Exit Window */}
            <div className="w-20 h-16 bg-[#2B2118] rounded-xl p-1.5 flex items-end justify-center relative overflow-hidden">
              <div className="w-full h-11 bg-[#463629] rounded-lg border-t-2 border-[#6B5442] flex items-center justify-center">
                {isDropping && winner ? (
                  <motion.div
                    initial={{ y: -28, opacity: 0 }}
                    animate={{ y: 4, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="w-8 h-8 rounded-full border-2 border-[#2B2118] overflow-hidden"
                  >
                    <div
                      className="h-1/2 w-full"
                      style={{ backgroundColor: winner.mascot.capsuleTop }}
                    />
                    <div className="h-1/2 w-full bg-white border-t border-[#2B2118]" />
                  </motion.div>
                ) : (
                  <span className="text-[11px] font-medium text-[#D6C3B3]">출구</span>
                )}
              </div>
            </div>

            {/* Interactive Crank Knob */}
            <button
              type="button"
              onClick={onTriggerDraw}
              disabled={!canDraw}
              aria-label="뽑기 레버 돌리기"
              className="group relative w-16 h-16 rounded-full bg-[#FFFDF8] border-[3px] border-[#2B2118] flex items-center justify-center shadow-[0_3px_0_0_#2B2118] active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B2118] cursor-pointer transition-transform hover:scale-105"
            >
              <motion.div
                animate={
                  isMixing && !prefersReduced
                    ? { rotate: 360 }
                    : { rotate: 0 }
                }
                transition={
                  isMixing && !prefersReduced
                    ? { duration: 0.45, repeat: Infinity, ease: 'linear' }
                    : { duration: 0.25 }
                }
                className="w-11 h-4 bg-[#FFB703] border-[2.5px] border-[#2B2118] rounded-md flex items-center justify-between px-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B2118]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B2118]" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Right Side: Capsule Opening & Winner Pedestal */}
        <div className="flex flex-col items-center justify-center w-64 min-h-[270px] relative">
          <AnimatePresence mode="wait">
            {phase === 'IDLE' && (
              <motion.div
                key="idle-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 rounded-2xl bg-[#F4ECE1] border-2 border-dashed border-[#D3C1AA] flex items-center justify-center mb-4">
                  <div className="w-14 h-14 rounded-full border-[2.5px] border-[#C4B097] overflow-hidden opacity-75">
                    <div className="h-1/2 w-full bg-[#E8DCCB]" />
                    <div className="h-1/2 w-full bg-[#FFFDF8] border-t-2 border-[#C4B097]" />
                  </div>
                </div>
                <p className="font-display text-xl text-[#2B2118]">
                  {eligibleTeams.length > 0
                    ? '어느 팀이 나올까요?'
                    : '발표 추첨이 끝났어요'}
                </p>
                <p className="text-sm text-[#6E5C4F] mt-1">
                  {eligibleTeams.length > 0
                    ? `총 ${allTeamsCount}팀 중 ${eligibleTeams.length}팀 대기 중`
                    : '초기화 버튼으로 새로 시작하세요'}
                </p>
              </motion.div>
            )}

            {isMixing && (
              <motion.div
                key="mixing-card"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  animate={
                    prefersReduced
                      ? undefined
                      : { rotate: [-8, 8, -8], y: [0, -6, 0] }
                  }
                  transition={{ duration: 0.35, repeat: Infinity }}
                  className="w-24 h-24 rounded-2xl bg-[#FFF3D6] border-[3px] border-[#2B2118] flex items-center justify-center mb-4 shadow-[0_4px_0_0_#2B2118]"
                >
                  <span className="font-display text-3xl text-[#2B2118]">?</span>
                </motion.div>
                <p className="font-display text-xl text-[#F25C3B]">
                  데구르르 섞는 중...
                </p>
                <p className="text-sm text-[#6E5C4F] mt-1">
                  두근두근 곧 캡슐이 나와요!
                </p>
              </motion.div>
            )}

            {isDropping && winner && (
              <motion.div
                key="dropping-card"
                initial={{ opacity: 0, y: -36, scale: 0.7 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: [0.85, 1.08, 0.96, 1.03, 1],
                  rotate: prefersReduced ? 0 : [-12, 12, -10, 8, 0],
                }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full border-[3px] border-[#2B2118] overflow-hidden shadow-[0_6px_0_0_#2B2118] mb-4 flex flex-col">
                  <div
                    className="h-1/2 w-full flex items-center justify-center font-display text-xl"
                    style={{
                      backgroundColor: winner.mascot.capsuleTop,
                      color: winner.mascot.capsuleText,
                    }}
                  >
                    !
                  </div>
                  <div className="h-1/2 w-full bg-[#FFFDF9] border-t-[3px] border-[#2B2118]" />
                </div>
                <p className="font-display text-xl text-[#2B2118]">
                  캡슐 도착! 열려라 짠!
                </p>
              </motion.div>
            )}

            {isRevealed && winner && (
              <motion.div
                key={`winner-${winner.id}-${confettiKey}`}
                initial={{ opacity: 0, scale: 0.65, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className="flex flex-col items-center text-center"
              >
                {/* Popped Capsule Halves Flanking */}
                <div className="relative flex items-center justify-center mb-2">
                  <CuteMascot theme={winner.mascot} mood="winner" size={116} />
                </div>

                <div className="bg-[#FFFDF9] border-[3px] border-[#2B2118] rounded-2xl px-6 py-3.5 shadow-[0_5px_0_0_#2B2118] min-w-[210px]">
                  <p className="text-xs font-medium text-[#6E5C4F]">
                    오늘의 발표 선정 팀 · {winner.mascot.animalName}
                  </p>
                  <p className="font-display text-3xl text-[#2B2118] mt-0.5 tabular-nums">
                    {winner.name}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
