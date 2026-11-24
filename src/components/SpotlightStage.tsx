import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { TeamItem } from '../data/mascots';
import { CuteMascot, type MascotMood } from './CuteMascot';
import { ConfettiBurst } from './ConfettiBurst';

interface SpotlightStageProps {
  teams: TeamItem[];
  presentedIds: number[];
  isHopping: boolean;
  highlightedTeamId: number | null;
  winner: TeamItem | null;
  confettiKey: number;
}

export const SpotlightStage: React.FC<SpotlightStageProps> = ({
  teams,
  presentedIds,
  isHopping,
  highlightedTeamId,
  winner,
  confettiKey,
}) => {
  const prefersReduced = useReducedMotion();

  // Adaptive grid columns based on team count so 2–20 teams fit comfortably
  const gridColsClass =
    teams.length <= 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : teams.length <= 6
        ? 'grid-cols-2 sm:grid-cols-3'
        : teams.length <= 12
          ? 'grid-cols-3 sm:grid-cols-4'
          : 'grid-cols-4 sm:grid-cols-5';

  return (
    <div className="relative flex flex-col justify-between min-h-[430px] sm:min-h-[470px] w-full py-5 px-4 sm:px-6 select-none">
      <ConfettiBurst triggerKey={confettiKey} />

      {/* Top Spotlight Banner */}
      <div className="flex items-center justify-center min-h-[64px] mb-4">
        {winner && !isHopping ? (
          <motion.div
            key={`banner-${winner.id}-${confettiKey}`}
            initial={{ opacity: 0, y: -8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            className="flex items-center gap-3 bg-[#FFFDF9] border-[2.5px] border-[#2B2118] rounded-xl px-5 py-2.5 shadow-[0_4px_0_0_#2B2118]"
          >
            <CuteMascot theme={winner.mascot} mood="winner" size={44} />
            <div className="text-left">
              <p className="text-xs text-[#6E5C4F]">
                발표 팀 선정 완료 · {winner.mascot.animalName}
              </p>
              <p className="font-display text-2xl text-[#2B2118] leading-tight tabular-nums">
                {winner.name} 발표!
              </p>
            </div>
          </motion.div>
        ) : (
          <p className="font-display text-lg text-[#6E5C4F]">
            {isHopping
              ? '스포트라이트가 통통 튀는 중...'
              : '무대 위 친구들 중 발표 팀을 찾아보세요!'}
          </p>
        )}
      </div>

      {/* Mascot Stage Grid */}
      <div className={`grid ${gridColsClass} gap-3 sm:gap-4 w-full my-auto`}>
        {teams.map((team) => {
          const isPresented = presentedIds.includes(team.id);
          const isActiveSpotlight = highlightedTeamId === team.id;
          const isCurrentWinner = !isHopping && winner?.id === team.id;

          let mood: MascotMood = 'idle';
          if (isCurrentWinner) mood = 'winner';
          else if (isActiveSpotlight) mood = 'excited';
          else if (isPresented) mood = 'resting';

          const mascotSize = teams.length > 12 ? 56 : teams.length > 8 ? 64 : 74;

          return (
            <motion.div
              key={team.id}
              animate={
                isActiveSpotlight && !prefersReduced
                  ? { y: -8, scale: 1.06 }
                  : isCurrentWinner && !prefersReduced
                    ? { y: -6, scale: 1.05 }
                    : { y: 0, scale: 1 }
              }
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col items-center justify-center rounded-2xl p-3 border-2 transition-colors duration-150 ${
                isActiveSpotlight || isCurrentWinner
                  ? 'bg-[#FFF5D6] border-[#2B2118] shadow-[0_4px_0_0_#2B2118]'
                  : isPresented
                    ? 'bg-[#F4ECE1]/70 border-[#E0D3C1] opacity-60'
                    : 'bg-[#FFFDF9] border-[#E6D9C6]'
              }`}
            >
              <CuteMascot theme={team.mascot} mood={mood} size={mascotSize} />

              <span className="mt-1.5 font-display text-base text-[#2B2118] truncate max-w-full tabular-nums">
                {team.name}
              </span>
              <span className="text-[11px] text-[#7D6A5B]">
                {isPresented ? '발표 완료' : team.mascot.animalName}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
