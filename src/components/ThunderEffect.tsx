import React, { useState, useEffect } from 'react';

export const ThunderEffect: React.FC = () => {
  const [flashIntensity, setFlashIntensity] = useState<number>(0);
  const [activeBolt, setActiveBolt] = useState<number | null>(null);

  useEffect(() => {
    let timeoutId: any;

    const triggerLightning = () => {
      // Choose lightning bolt variation (0, 1, or 2)
      const boltType = Math.floor(Math.random() * 3);
      setActiveBolt(boltType);

      // Realistic double or triple strobe lightning flash
      setFlashIntensity(0.85);

      setTimeout(() => {
        setFlashIntensity(0.15);
      }, 70);

      setTimeout(() => {
        setFlashIntensity(0.95);
      }, 130);

      setTimeout(() => {
        setFlashIntensity(0.4);
      }, 200);

      setTimeout(() => {
        setFlashIntensity(0);
        setActiveBolt(null);
      }, 420);

      // Schedule next thunder strike between 4.5s and 9s
      const nextDelay = Math.random() * 4500 + 4500;
      timeoutId = setTimeout(triggerLightning, nextDelay);
    };

    // Initial strike after 2.5s
    timeoutId = setTimeout(triggerLightning, 2500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10" aria-hidden="true">
      {/* Sky Flash Luminance Layer */}
      <div
        className="absolute inset-0 transition-opacity duration-75 pointer-events-none"
        style={{
          opacity: flashIntensity,
          background:
            'radial-gradient(ellipse at 60% 10%, rgba(244, 114, 182, 0.28) 0%, rgba(147, 51, 234, 0.18) 35%, rgba(255, 255, 255, 0.12) 65%, transparent 95%)',
        }}
      />

      {/* Screen Edge Ambient Flash */}
      <div
        className="absolute inset-0 transition-opacity duration-100 pointer-events-none"
        style={{
          opacity: flashIntensity * 0.4,
          backgroundColor: 'rgba(236, 72, 153, 0.15)',
        }}
      />

      {/* SVG Lightning Bolts */}
      {activeBolt !== null && (
        <svg
          className="absolute top-0 right-4 sm:right-24 w-80 sm:w-[480px] h-[360px] sm:h-[480px] pointer-events-none"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0px 0px 18px rgba(255, 255, 255, 0.95)) drop-shadow(0px 0px 32px rgba(236, 72, 153, 0.8))',
            opacity: flashIntensity > 0 ? 1 : 0,
          }}
        >
          {activeBolt === 0 && (
            <g>
              {/* Main jagged lightning bolt */}
              <path
                d="M 280,0 L 260,70 L 290,130 L 250,210 L 275,270 L 220,380 L 235,420 L 190,500"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Outer pink glow layer */}
              <path
                d="M 280,0 L 260,70 L 290,130 L 250,210 L 275,270 L 220,380 L 235,420 L 190,500"
                stroke="#f472b6"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
              {/* Branches */}
              <path
                d="M 260,70 L 220,110 L 205,160"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 250,210 L 310,250 L 340,310"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 275,270 L 240,320 L 255,360"
                stroke="#f472b6"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          )}

          {activeBolt === 1 && (
            <g>
              {/* Variant 2: Left-leaning branching strike */}
              <path
                d="M 380,0 L 340,90 L 365,150 L 310,240 L 330,300 L 270,410 L 290,460 L 250,510"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 380,0 L 340,90 L 365,150 L 310,240 L 330,300 L 270,410 L 290,460 L 250,510"
                stroke="#ec4899"
                strokeWidth="6.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Branches */}
              <path
                d="M 340,90 L 400,135 L 430,190"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 310,240 L 260,290 L 240,350"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 270,410 L 320,440"
                stroke="#f472b6"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          )}

          {activeBolt === 2 && (
            <g>
              {/* Variant 3: Sharp central fork strike */}
              <path
                d="M 220,0 L 240,80 L 210,160 L 250,230 L 220,330 L 260,400 L 230,490"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 220,0 L 240,80 L 210,160 L 250,230 L 220,330 L 260,400 L 230,490"
                stroke="#a855f7"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Fork branch */}
              <path
                d="M 250,230 L 190,290 L 170,370"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M 220,330 L 180,390"
                stroke="#f472b6"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          )}
        </svg>
      )}
    </div>
  );
};
