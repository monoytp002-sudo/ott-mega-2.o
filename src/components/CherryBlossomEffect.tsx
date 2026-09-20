import React, { useMemo } from 'react';

interface Petal {
  id: number;
  left: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  swayDuration: number;
  opacity: number;
  rotation: number;
}

export const CherryBlossomEffect: React.FC = () => {
  // Generate a fixed set of realistic petals
  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.floor(Math.random() * 14) + 12, // 12px to 26px
      duration: Math.random() * 8 + 8, // 8s to 16s fall duration
      delay: Math.random() * 10,
      swayDuration: Math.random() * 3 + 2.5,
      opacity: Math.random() * 0.4 + 0.45, // 0.45 to 0.85
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-20" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute -top-10"
          style={{
            left: `${petal.left}%`,
            animation: `fall ${petal.duration}s linear infinite, sway ${petal.swayDuration}s ease-in-out infinite alternate`,
            animationDelay: `${petal.delay}s, ${petal.delay * 0.4}s`,
            opacity: petal.opacity,
            willChange: 'transform',
          }}
        >
          {/* Detailed Cherry Blossom Petal SVG */}
          <svg
            width={petal.size}
            height={petal.size * 1.3}
            viewBox="0 0 24 32"
            fill="none"
            style={{
              transform: `rotate(${petal.rotation}deg)`,
              filter: 'drop-shadow(0px 1px 3px rgba(236, 72, 153, 0.4))',
            }}
          >
            <defs>
              <linearGradient id={`sakuraGrad-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd1dc" />
                <stop offset="45%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
            {/* Organic curved petal shape with notch */}
            <path
              d="M12 0 C16 4 23 10 23 20 C23 27 18 31 12 31 C6 31 1 27 1 20 C1 10 8 4 12 0 Z"
              fill={`url(#sakuraGrad-${petal.id})`}
            />
            {/* Delicate inner petal vein line */}
            <path
              d="M12 5 C12 14 12 24 12 28"
              stroke="#fbcfe8"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
