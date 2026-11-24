import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { MascotTheme } from '../data/mascots';

export type MascotMood = 'idle' | 'excited' | 'winner' | 'resting';

interface CuteMascotProps {
  theme: MascotTheme;
  mood?: MascotMood;
  size?: number;
  className?: string;
}

const INK = '#2B2118';

export const CuteMascot: React.FC<CuteMascotProps> = ({
  theme,
  mood = 'idle',
  size = 72,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();
  const { kind, bodyColor, earInner, cheekColor } = theme;

  const renderBackFeatures = () => {
    switch (kind) {
      case 'bunny':
        return (
          <g>
            <ellipse cx="35" cy="23" rx="8" ry="18" transform="rotate(-10 35 23)" fill={bodyColor} stroke={INK} strokeWidth="2.8" />
            <ellipse cx="35" cy="24" rx="4" ry="11" transform="rotate(-10 35 24)" fill={earInner} />
            <ellipse cx="65" cy="23" rx="8" ry="18" transform="rotate(10 65 23)" fill={bodyColor} stroke={INK} strokeWidth="2.8" />
            <ellipse cx="65" cy="24" rx="4" ry="11" transform="rotate(10 65 24)" fill={earInner} />
          </g>
        );
      case 'bear':
      case 'hamster':
      case 'koala':
        return (
          <g>
            <circle cx="26" cy="30" r={kind === 'koala' ? 13 : 10} fill={bodyColor} stroke={INK} strokeWidth="2.8" />
            <circle cx="26" cy="30" r={kind === 'koala' ? 7 : 5} fill={earInner} />
            <circle cx="74" cy="30" r={kind === 'koala' ? 13 : 10} fill={bodyColor} stroke={INK} strokeWidth="2.8" />
            <circle cx="74" cy="30" r={kind === 'koala' ? 7 : 5} fill={earInner} />
          </g>
        );
      case 'panda':
        return (
          <g>
            <circle cx="26" cy="30" r="10.5" fill={earInner} stroke={INK} strokeWidth="2.8" />
            <circle cx="74" cy="30" r="10.5" fill={earInner} stroke={INK} strokeWidth="2.8" />
          </g>
        );
      case 'puppy':
        return (
          <g>
            <ellipse cx="21" cy="52" rx="8" ry="16" transform="rotate(16 21 52)" fill={earInner} stroke={INK} strokeWidth="2.8" />
            <ellipse cx="79" cy="52" rx="8" ry="16" transform="rotate(-16 79 52)" fill={earInner} stroke={INK} strokeWidth="2.8" />
          </g>
        );
      case 'cat':
      case 'fox':
      case 'squirrel':
      case 'raccoon':
      case 'tiger':
        return (
          <g>
            <path d="M23 42 L24 19 L43 32 Z" fill={bodyColor} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
            <path d="M27 37 L27.5 25 L38 33 Z" fill={earInner} />
            <path d="M77 42 L76 19 L57 32 Z" fill={bodyColor} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
            <path d="M73 37 L72.5 25 L62 33 Z" fill={earInner} />
          </g>
        );
      case 'frog':
        return (
          <g>
            <circle cx="33" cy="32" r="11" fill={bodyColor} stroke={INK} strokeWidth="2.8" />
            <circle cx="67" cy="32" r="11" fill={bodyColor} stroke={INK} strokeWidth="2.8" />
          </g>
        );
      case 'chick':
      case 'duck':
        return (
          <g>
            <path d="M46 27 C42 15, 51 14, 50 25 C53 16, 61 18, 54 27" fill={bodyColor} stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      case 'lion':
        return (
          <g>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <circle
                key={deg}
                cx={50 + Math.cos((deg * Math.PI) / 180) * 30}
                cy={55 + Math.sin((deg * Math.PI) / 180) * 28}
                r="10"
                fill={earInner}
                stroke={INK}
                strokeWidth="2.4"
              />
            ))}
          </g>
        );
      case 'sheep':
        return (
          <g>
            {[25, 65, 115, 155, 205, 245, 295, 335].map((deg) => (
              <circle
                key={deg}
                cx={50 + Math.cos((deg * Math.PI) / 180) * 28}
                cy={55 + Math.sin((deg * Math.PI) / 180) * 25}
                r="11"
                fill={bodyColor}
                stroke={INK}
                strokeWidth="2.4"
              />
            ))}
            <ellipse cx="21" cy="48" rx="8" ry="5" transform="rotate(-15 21 48)" fill={earInner} stroke={INK} strokeWidth="2.5" />
            <ellipse cx="79" cy="48" rx="8" ry="5" transform="rotate(15 79 48)" fill={earInner} stroke={INK} strokeWidth="2.5" />
          </g>
        );
      case 'alpaca':
        return (
          <g>
            <ellipse cx="36" cy="24" rx="6" ry="15" transform="rotate(-8 36 24)" fill={bodyColor} stroke={INK} strokeWidth="2.8" />
            <ellipse cx="36" cy="25" rx="3" ry="9" transform="rotate(-8 36 25)" fill={earInner} />
            <ellipse cx="64" cy="24" rx="6" ry="15" transform="rotate(8 64 24)" fill={bodyColor} stroke={INK} strokeWidth="2.8" />
            <ellipse cx="64" cy="25" rx="3" ry="9" transform="rotate(8 64 25)" fill={earInner} />
          </g>
        );
      case 'owl':
        return (
          <g>
            <path d="M25 38 L22 21 L38 30 Z" fill={bodyColor} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
            <path d="M75 38 L78 21 L62 30 Z" fill={bodyColor} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
          </g>
        );
      default:
        return null;
    }
  };

  const renderFaceDetails = () => {
    // Special face patches per species
    const eyeY = kind === 'frog' ? 35 : 53;
    const eyeSpread = kind === 'frog' ? 16 : 13;

    const renderMarkings = () => {
      if (kind === 'panda') {
        return (
          <g>
            <ellipse cx="36" cy="53" rx="8" ry="9.5" transform="rotate(15 36 53)" fill="#363230" />
            <ellipse cx="64" cy="53" rx="8" ry="9.5" transform="rotate(-15 64 53)" fill="#363230" />
          </g>
        );
      }
      if (kind === 'penguin') {
        return (
          <path
            d="M27 56 C27 40, 44 40, 50 48 C56 40, 73 40, 73 56 C73 74, 62 82, 50 82 C38 82, 27 74, 27 56 Z"
            fill="#FFFFFF"
          />
        );
      }
      if (kind === 'raccoon') {
        return (
          <g>
            <ellipse cx="36" cy="53" rx="9" ry="7.5" transform="rotate(10 36 53)" fill="#5C5552" />
            <ellipse cx="64" cy="53" rx="9" ry="7.5" transform="rotate(-10 64 53)" fill="#5C5552" />
          </g>
        );
      }
      if (kind === 'fox' || kind === 'squirrel') {
        return (
          <path
            d="M23 61 C23 76, 36 83, 50 83 C64 83, 77 76, 77 61 C66 64, 57 60, 50 67 C43 60, 34 64, 23 61 Z"
            fill={earInner}
          />
        );
      }
      if (kind === 'owl') {
        return (
          <g>
            <circle cx="37" cy="53" r="11" fill={earInner} />
            <circle cx="63" cy="53" r="11" fill={earInner} />
          </g>
        );
      }
      if (kind === 'tiger') {
        return (
          <g stroke={INK} strokeWidth="2.4" strokeLinecap="round">
            <path d="M46 31 L46 39" />
            <path d="M50 30 L50 41" />
            <path d="M54 31 L54 39" />
            <path d="M24 53 L30 55" />
            <path d="M76 53 L70 55" />
          </g>
        );
      }
      if (kind === 'alpaca' || kind === 'sheep') {
        return (
          <path
            d="M35 32 Q42 26 50 32 Q58 26 65 32"
            fill={bodyColor}
            stroke={INK}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        );
      }
      return null;
    };

    const renderEyes = () => {
      const leftX = 50 - eyeSpread;
      const rightX = 50 + eyeSpread;
      const isDarkEyePatch = kind === 'panda' || kind === 'raccoon';
      const eyeStroke = isDarkEyePatch ? '#FFFFFF' : INK;

      if (mood === 'winner' || mood === 'excited') {
        return (
          <g>
            <path
              d={`M${leftX - 4.5} ${eyeY + 1} Q${leftX} ${eyeY - 5.5} ${leftX + 4.5} ${eyeY + 1}`}
              fill="none"
              stroke={eyeStroke}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d={`M${rightX - 4.5} ${eyeY + 1} Q${rightX} ${eyeY - 5.5} ${rightX + 4.5} ${eyeY + 1}`}
              fill="none"
              stroke={eyeStroke}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </g>
        );
      }

      if (mood === 'resting') {
        return (
          <g>
            <path
              d={`M${leftX - 4} ${eyeY} Q${leftX} ${eyeY + 3.5} ${leftX + 4} ${eyeY}`}
              fill="none"
              stroke={eyeStroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d={`M${rightX - 4} ${eyeY} Q${rightX} ${eyeY + 3.5} ${rightX + 4} ${eyeY}`}
              fill="none"
              stroke={eyeStroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        );
      }

      return (
        <g>
          <circle cx={leftX} cy={eyeY} r="3.6" fill={isDarkEyePatch ? '#FFFFFF' : INK} />
          <circle cx={leftX - 1.1} cy={eyeY - 1.2} r="1.2" fill={isDarkEyePatch ? INK : '#FFFFFF'} />
          <circle cx={rightX} cy={eyeY} r="3.6" fill={isDarkEyePatch ? '#FFFFFF' : INK} />
          <circle cx={rightX - 1.1} cy={eyeY - 1.2} r="1.2" fill={isDarkEyePatch ? INK : '#FFFFFF'} />
        </g>
      );
    };

    const renderNoseAndMouth = () => {
      if (kind === 'chick' || kind === 'duck' || kind === 'penguin' || kind === 'owl') {
        const beakColor = kind === 'penguin' || kind === 'duck' ? '#FF9F1C' : '#F4A261';
        return (
          <g>
            <path
              d="M45 58 L55 58 L50 65 Z"
              fill={beakColor}
              stroke={INK}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </g>
        );
      }

      if (kind === 'koala') {
        return (
          <g>
            <ellipse cx="50" cy="57" rx="4.5" ry="6.2" fill="#4A4E69" stroke={INK} strokeWidth="2.2" />
            <path d="M46 66 Q50 70 54 66" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          </g>
        );
      }

      if (kind === 'frog') {
        return (
          <path
            d={mood === 'winner' || mood === 'excited' ? 'M40 59 Q50 69 60 59' : 'M42 59 Q50 65 58 59'}
            fill="none"
            stroke={INK}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      }

      // Snout patch for bear/puppy/lion/seal
      const hasSnout = kind === 'bear' || kind === 'puppy' || kind === 'lion' || kind === 'seal';
      return (
        <g>
          {hasSnout && <ellipse cx="50" cy="61" rx="10" ry="7.5" fill="#FFF9F0" />}
          <ellipse cx="50" cy="58" rx="3.5" ry="2.5" fill={INK} />
          {mood === 'winner' || mood === 'excited' ? (
            <path
              d="M45 62 Q50 69 55 62 Z"
              fill="#FF6B6B"
              stroke={INK}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M45 62 Q47.5 65 50 61.5 Q52.5 65 55 62"
              fill="none"
              stroke={INK}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )}
        </g>
      );
    };

    return (
      <g>
        {renderMarkings()}
        {/* Rosy cheeks */}
        <ellipse cx="29" cy={kind === 'frog' ? 53 : 61} rx="5" ry="3.2" fill={cheekColor} opacity="0.72" />
        <ellipse cx="71" cy={kind === 'frog' ? 53 : 61} rx="5" ry="3.2" fill={cheekColor} opacity="0.72" />
        {renderEyes()}
        {renderNoseAndMouth()}
        {/* Cute cat/hamster/seal whiskers */}
        {(kind === 'cat' || kind === 'hamster' || kind === 'seal') && (
          <g stroke={INK} strokeWidth="1.8" strokeLinecap="round" opacity="0.65">
            <line x1="18" y1="57" x2="26" y2="59" />
            <line x1="18" y1="63" x2="26" y2="62" />
            <line x1="82" y1="57" x2="74" y2="59" />
            <line x1="82" y1="63" x2="74" y2="62" />
          </g>
        )}
      </g>
    );
  };

  const bounceAnimation =
    prefersReduced || mood === 'resting'
      ? undefined
      : mood === 'winner'
        ? { y: [0, -7, 0], scaleY: [1, 1.04, 0.97, 1] }
        : mood === 'excited'
          ? { y: [0, -5, 0], rotate: [-3, 3, -3] }
          : { y: [0, -2.5, 0] };

  const bounceTransition =
    mood === 'winner'
      ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' as const }
      : mood === 'excited'
        ? { duration: 0.45, repeat: Infinity, ease: 'easeInOut' as const }
        : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <motion.div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      animate={bounceAnimation}
      transition={bounceTransition}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-label={theme.animalName}
        className="overflow-visible"
      >
        {/* Tiny golden paper crown for the winning presenter */}
        {mood === 'winner' && (
          <g transform="translate(32, -4)">
            <path
              d="M4 22 L2 7 L12 14 L18 3 L24 14 L34 7 L32 22 Z"
              fill="#FFD166"
              stroke={INK}
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <circle cx="18" cy="14" r="2.2" fill="#F25C3B" />
          </g>
        )}

        {/* Back ears / mane / tufts */}
        {renderBackFeatures()}

        {/* Main squishy head-body */}
        <ellipse
          cx="50"
          cy="56"
          rx="29"
          ry="26"
          fill={bodyColor}
          stroke={INK}
          strokeWidth="2.8"
        />

        {/* Face details */}
        {renderFaceDetails()}
      </svg>
    </motion.div>
  );
};
