import React from 'react';

interface OttLogoProps {
  className?: string;
  size?: number; // size in px, default 44
  showTextLabel?: boolean;
}

export const OttLogo: React.FC<OttLogoProps> = ({ 
  className = '', 
  size = 48,
  showTextLabel = true 
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* High-Fidelity SVG Emblem matching the user's custom Cherry Blossom OTT Mega 2.0 circular logo */}
      <div 
        className="relative shrink-0 rounded-full select-none"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(236,72,153,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background watercolor wash gradient */}
            <radialGradient id="pinkSplashGrad" cx="50%" cy="50%" r="48%" fx="52%" fy="48%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#ffe4ef" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#fbcfe8" stopOpacity="0.85" />
              <stop offset="92%" stopColor="#f472b6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
            </radialGradient>

            {/* Sakura petal gradient */}
            <radialGradient id="sakuraPetalGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fbcfe8" />
              <stop offset="85%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </radialGradient>

            {/* Pink Sparkle Flare */}
            <radialGradient id="sparkleCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#ffbce1" />
              <stop offset="75%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </radialGradient>

            {/* Filter for ink brush softness */}
            <filter id="inkGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#ec4899" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 1. Base Circular Canvas Background */}
          <circle cx="200" cy="200" r="192" fill="#ffffff" />
          <circle cx="200" cy="200" r="192" fill="url(#pinkSplashGrad)" />

          {/* Pink Watercolor Splatters & Texture Dots */}
          <circle cx="120" cy="90" r="14" fill="#f472b6" opacity="0.3" />
          <circle cx="290" cy="110" r="18" fill="#f472b6" opacity="0.25" />
          <circle cx="110" cy="290" r="16" fill="#ec4899" opacity="0.25" />
          <circle cx="270" cy="250" r="22" fill="#fbcfe8" opacity="0.5" />
          <circle cx="170" cy="230" r="30" fill="#f472b6" opacity="0.15" />
          <circle cx="280" cy="330" r="9" fill="#db2777" opacity="0.3" />
          <circle cx="320" cy="140" r="7" fill="#f472b6" opacity="0.35" />
          <circle cx="85" cy="180" r="8" fill="#ec4899" opacity="0.28" />

          {/* 2. Outer Pink Accent Rings */}
          <circle cx="200" cy="200" r="188" stroke="#f472b6" strokeWidth="2.5" opacity="0.75" />
          <circle cx="200" cy="200" r="184" stroke="#ec4899" strokeWidth="1.2" opacity="0.6" strokeDasharray="380 8 190 6" />

          {/* 3. Bold Black Enso Brush Ring */}
          <path
            d="M 200 18 
               C 298 18, 382 98, 382 200 
               C 382 295, 305 378, 205 382 
               C 105 386, 22 308, 18 205 
               C 14 110, 95 24, 190 20"
            stroke="#0a0a0c"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Secondary brush texture stroke */}
          <path
            d="M 215 22 
               C 305 25, 376 102, 376 195 
               C 376 288, 300 372, 200 376 
               C 112 380, 28 302, 26 210 
               C 24 125, 96 32, 180 26"
            stroke="#1c1917"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.8"
            fill="none"
          />
          {/* Inner brush accent */}
          <path
            d="M 220 28 C 300 35, 365 105, 368 190 C 370 265, 310 350, 220 365"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.9"
            fill="none"
          />

          {/* 4. Cherry Blossom Sakura Branches & Flowers */}
          {/* Branch Top Left */}
          <g>
            {/* Branch twigs */}
            <path
              d="M 85 140 Q 95 105 115 80 Q 125 70 135 60"
              stroke="#291517"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 105 95 Q 120 90 130 85"
              stroke="#291517"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 60 170 Q 75 145 85 130"
              stroke="#291517"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* Pink buds */}
            <ellipse cx="137" cy="58" rx="4" ry="6" transform="rotate(30 137 58)" fill="#db2777" />
            <ellipse cx="132" cy="83" rx="3.5" ry="5" transform="rotate(-20 132 83)" fill="#ec4899" />
            <ellipse cx="108" cy="132" rx="4" ry="5.5" transform="rotate(45 108 132)" fill="#db2777" />

            {/* Flower 1 (Upper Left Large) */}
            <g transform="translate(68, 105)">
              {/* 5 Petals */}
              <circle cx="0" cy="-12" r="10" fill="url(#sakuraPetalGrad)" />
              <circle cx="11" cy="-4" r="10" fill="url(#sakuraPetalGrad)" />
              <circle cx="7" cy="10" r="10" fill="url(#sakuraPetalGrad)" />
              <circle cx="-7" cy="10" r="10" fill="url(#sakuraPetalGrad)" />
              <circle cx="-11" cy="-4" r="10" fill="url(#sakuraPetalGrad)" />
              {/* Flower Center Stamen */}
              <circle cx="0" cy="0" r="4.5" fill="#be185d" />
              <circle cx="0" cy="0" r="2" fill="#fff1f2" />
            </g>

            {/* Flower 2 (Mid Left Big) */}
            <g transform="translate(50, 170) scale(1.15)">
              <circle cx="0" cy="-13" r="11" fill="url(#sakuraPetalGrad)" />
              <circle cx="12" cy="-4" r="11" fill="url(#sakuraPetalGrad)" />
              <circle cx="8" cy="11" r="11" fill="url(#sakuraPetalGrad)" />
              <circle cx="-8" cy="11" r="11" fill="url(#sakuraPetalGrad)" />
              <circle cx="-12" cy="-4" r="11" fill="url(#sakuraPetalGrad)" />
              <circle cx="0" cy="0" r="5" fill="#9d174d" />
              <circle cx="0" cy="0" r="2.2" fill="#fdf2f8" />
            </g>

            {/* Small Flower Left Bottom */}
            <g transform="translate(60, 240) scale(0.85)">
              <circle cx="0" cy="-11" r="9" fill="url(#sakuraPetalGrad)" />
              <circle cx="10" cy="-3" r="9" fill="url(#sakuraPetalGrad)" />
              <circle cx="6" cy="9" r="9" fill="url(#sakuraPetalGrad)" />
              <circle cx="-6" cy="9" r="9" fill="url(#sakuraPetalGrad)" />
              <circle cx="-10" cy="-3" r="9" fill="url(#sakuraPetalGrad)" />
              <circle cx="0" cy="0" r="4" fill="#be185d" />
            </g>
          </g>

          {/* Branch Bottom Right */}
          <g>
            <path
              d="M 330 260 Q 345 285 355 315 Q 360 335 365 350"
              stroke="#291517"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 345 285 Q 365 295 375 305"
              stroke="#291517"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 335 320 Q 320 335 310 345"
              stroke="#291517"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Buds */}
            <ellipse cx="378" cy="308" rx="4" ry="6" transform="rotate(30 378 308)" fill="#db2777" />
            <ellipse cx="366" cy="353" rx="3.5" ry="5" transform="rotate(-15 366 353)" fill="#ec4899" />
            <ellipse cx="288" cy="340" rx="3.5" ry="5" transform="rotate(50 288 340)" fill="#db2777" />

            {/* Flower Right Mid */}
            <g transform="translate(340, 230) scale(0.8)">
              <circle cx="0" cy="-11" r="9" fill="url(#sakuraPetalGrad)" />
              <circle cx="10" cy="-3" r="9" fill="url(#sakuraPetalGrad)" />
              <circle cx="6" cy="9" r="9" fill="url(#sakuraPetalGrad)" />
              <circle cx="-6" cy="9" r="9" fill="url(#sakuraPetalGrad)" />
              <circle cx="-10" cy="-3" r="9" fill="url(#sakuraPetalGrad)" />
              <circle cx="0" cy="0" r="4" fill="#be185d" />
            </g>

            {/* Flower Right Big */}
            <g transform="translate(325, 290) scale(1.2)">
              <circle cx="0" cy="-13" r="11" fill="url(#sakuraPetalGrad)" />
              <circle cx="12" cy="-4" r="11" fill="url(#sakuraPetalGrad)" />
              <circle cx="8" cy="11" r="11" fill="url(#sakuraPetalGrad)" />
              <circle cx="-8" cy="11" r="11" fill="url(#sakuraPetalGrad)" />
              <circle cx="-12" cy="-4" r="11" fill="url(#sakuraPetalGrad)" />
              <circle cx="0" cy="0" r="5" fill="#9d174d" />
              <circle cx="0" cy="0" r="2.2" fill="#fff1f2" />
            </g>

            {/* Small Flower Right Bottom */}
            <g transform="translate(310, 335) scale(0.75)">
              <circle cx="0" cy="-10" r="8" fill="url(#sakuraPetalGrad)" />
              <circle cx="9" cy="-3" r="8" fill="url(#sakuraPetalGrad)" />
              <circle cx="5" cy="8" r="8" fill="url(#sakuraPetalGrad)" />
              <circle cx="-5" cy="8" r="8" fill="url(#sakuraPetalGrad)" />
              <circle cx="-9" cy="-3" r="8" fill="url(#sakuraPetalGrad)" />
              <circle cx="0" cy="0" r="3.5" fill="#be185d" />
            </g>
          </g>

          {/* 5. Central Calligraphy Brush Lettering: "ott", "Mega", "2.0" */}
          <g filter="url(#inkGlow)">
            
            {/* "ott" - Brush Script on Top */}
            {/* Letter 'o' */}
            <path
              d="M 148 115 C 132 105, 122 120, 125 135 C 128 148, 142 153, 154 144 C 164 135, 162 118, 148 115 Z"
              stroke="#0a0a0c"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* First 't' */}
            <path
              d="M 182 85 Q 180 120 180 140 Q 180 148 188 146"
              stroke="#0a0a0c"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 166 112 Q 185 106 202 108"
              stroke="#0a0a0c"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Second 't' */}
            <path
              d="M 224 82 Q 225 118 223 138 Q 223 148 234 145"
              stroke="#0a0a0c"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 208 110 Q 228 104 250 106"
              stroke="#0a0a0c"
              strokeWidth="8.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* "Mega" - Bold Center Calligraphy */}
            {/* 'M' */}
            <path
              d="M 102 165 C 105 185, 96 225, 92 265"
              stroke="#0a0a0c"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 100 178 C 120 160, 145 195, 156 220 C 168 180, 185 155, 206 175 C 215 185, 218 220, 214 255"
              stroke="#0a0a0c"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* 'e' */}
            <path
              d="M 218 220 Q 248 205 242 225 Q 235 248 216 248 Q 210 248 222 255"
              stroke="#0a0a0c"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            {/* 'g' */}
            <path
              d="M 262 205 Q 246 205 246 220 Q 246 235 264 235 Q 275 235 275 215 Q 275 255 262 272 Q 248 280 236 270"
              stroke="#0a0a0c"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />
            {/* 'a' */}
            <path
              d="M 292 215 Q 282 212 282 228 Q 282 242 298 240 Q 308 240 308 222 Q 308 238 318 244"
              stroke="#0a0a0c"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />
            {/* Dynamic brush underline swoop beneath "Mega" */}
            <path
              d="M 160 252 Q 220 238 300 220"
              stroke="#0a0a0c"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />

            {/* "2.0" - Bottom Brush Script */}
            {/* '2' */}
            <path
              d="M 138 302 Q 152 280 178 280 Q 200 282 195 304 Q 188 322 152 355 L 202 348"
              stroke="#0a0a0c"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* '.' Dot */}
            <circle cx="218" cy="338" r="7" fill="#0a0a0c" />

            {/* '0' */}
            <path
              d="M 248 318 C 242 285, 280 278, 284 315 C 286 348, 252 358, 248 318 Z"
              stroke="#0a0a0c"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* 6. Diamond Starburst Sparkles / Glints on the Calligraphy */}
          {/* Sparkle 1 on 'ott' */}
          <g transform="translate(202, 92) scale(0.9)">
            <ellipse cx="0" cy="0" rx="14" ry="3.5" fill="#ffffff" />
            <ellipse cx="0" cy="0" rx="3.5" ry="14" fill="#ffffff" />
            <circle cx="0" cy="0" r="16" fill="url(#sparkleCore)" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
          </g>

          {/* Sparkle 2 on 'Mega' M peak */}
          <g transform="translate(195, 170) scale(0.85)">
            <ellipse cx="0" cy="0" rx="13" ry="3" fill="#ffffff" />
            <ellipse cx="0" cy="0" rx="3" ry="13" fill="#ffffff" />
            <circle cx="0" cy="0" r="14" fill="url(#sparkleCore)" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>

          {/* Sparkle 3 on 'Mega' underline */}
          <g transform="translate(235, 235) scale(0.95)">
            <ellipse cx="0" cy="0" rx="15" ry="3.5" fill="#ffffff" />
            <ellipse cx="0" cy="0" rx="3.5" ry="15" fill="#ffffff" />
            <circle cx="0" cy="0" r="18" fill="url(#sparkleCore)" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
          </g>

          {/* Sparkle 4 on '2' in '2.0' */}
          <g transform="translate(155, 342) scale(0.75)">
            <ellipse cx="0" cy="0" rx="12" ry="2.8" fill="#ffffff" />
            <ellipse cx="0" cy="0" rx="2.8" ry="12" fill="#ffffff" />
            <circle cx="0" cy="0" r="12" fill="url(#sparkleCore)" />
            <circle cx="0" cy="0" r="2.8" fill="#ffffff" />
          </g>

          {/* Sparkle 5 on '0' in '2.0' */}
          <g transform="translate(262, 335) scale(0.75)">
            <ellipse cx="0" cy="0" rx="11" ry="2.8" fill="#ffffff" />
            <ellipse cx="0" cy="0" rx="2.8" ry="11" fill="#ffffff" />
            <circle cx="0" cy="0" r="12" fill="url(#sparkleCore)" />
            <circle cx="0" cy="0" r="2.8" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {/* Brand Text Name (Optional next to emblem) */}
      {showTextLabel && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit']">
              OTT MEGA
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/40 border border-pink-400/40">
              2.0
            </span>
          </div>
          <span className="text-[10px] text-pink-400/90 tracking-wider uppercase font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            Verified OTT Store
          </span>
        </div>
      )}
    </div>
  );
};
