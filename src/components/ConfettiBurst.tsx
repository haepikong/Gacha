import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ConfettiBurstProps {
  triggerKey: number;
}

const PARTICLES = [
  { angle: -145, dist: 120, color: '#F25C3B', shape: 'circle', size: 10 },
  { angle: -120, dist: 145, color: '#FFB703', shape: 'rect', size: 11 },
  { angle: -95, dist: 155, color: '#2A9D8F', shape: 'circle', size: 9 },
  { angle: -70, dist: 140, color: '#3A86FF', shape: 'rect', size: 10 },
  { angle: -45, dist: 125, color: '#FF758F', shape: 'circle', size: 11 },
  { angle: -25, dist: 110, color: '#FFB703', shape: 'rect', size: 9 },
  { angle: -160, dist: 105, color: '#9B5DE5', shape: 'rect', size: 10 },
  { angle: -105, dist: 125, color: '#FF758F', shape: 'circle', size: 8 },
  { angle: -55, dist: 130, color: '#38B000', shape: 'rect', size: 9 },
  { angle: -82, dist: 165, color: '#F25C3B', shape: 'rect', size: 11 },
  { angle: -135, dist: 132, color: '#00BBF9', shape: 'circle', size: 9 },
  { angle: -35, dist: 135, color: '#9B5DE5', shape: 'circle', size: 10 },
];

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ triggerKey }) => {
  const prefersReduced = useReducedMotion();
  if (prefersReduced || triggerKey === 0) return null;

  return (
    <div
      key={triggerKey}
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {PARTICLES.map((p, idx) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.dist;
        const ty = Math.sin(rad) * p.dist;
        return (
          <motion.span
            key={idx}
            initial={{ opacity: 1, x: 0, y: 12, scale: 0.4, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: tx,
              y: [12, ty, ty + 38],
              scale: [0.5, 1.15, 0.8],
              rotate: (idx % 2 === 0 ? 1 : -1) * (180 + idx * 35),
            }}
            transition={{
              duration: 1.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.shape === 'rect' ? p.size * 0.6 : p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '9999px' : '2px',
            }}
          />
        );
      })}
    </div>
  );
};
