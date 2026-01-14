export default function CloudIllustration() {
  return (
    <div className="animate-float">
      <svg
        width="160"
        height="120"
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cloud gradient */}
          <linearGradient
            id="cloudGradient"
            x1="80"
            y1="10"
            x2="80"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E3F0FF" />
          </linearGradient>

          {/* File gradient */}
          <linearGradient
            id="fileGradient"
            x1="80"
            y1="70"
            x2="80"
            y2="115"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F0F7FF" />
          </linearGradient>

          {/* Stronger shadow for contrast */}
          <filter id="cloudShadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="12"
              floodColor="#6BA3D6"
              floodOpacity="0.5"
            />
          </filter>

          {/* File shadow */}
          <filter id="fileShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="4"
              floodColor="#8BB8E8"
              floodOpacity="0.3"
            />
          </filter>

          {/* Eye shine gradient */}
          <radialGradient id="eyeShine" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#4A4A4A" />
            <stop offset="100%" stopColor="#1A1A1A" />
          </radialGradient>
        </defs>

        {/* Main fluffy cloud body */}
        <g filter="url(#cloudShadow)">
          {/* Bottom puff */}
          <ellipse cx="80" cy="60" rx="50" ry="20" fill="url(#cloudGradient)" stroke="#B8D4F0" strokeWidth="1" />
          {/* Left puff */}
          <circle cx="42" cy="50" r="22" fill="url(#cloudGradient)" stroke="#B8D4F0" strokeWidth="1" />
          {/* Right puff */}
          <circle cx="118" cy="50" r="22" fill="url(#cloudGradient)" stroke="#B8D4F0" strokeWidth="1" />
          {/* Top left puff */}
          <circle cx="55" cy="35" r="25" fill="url(#cloudGradient)" stroke="#B8D4F0" strokeWidth="1" />
          {/* Top right puff */}
          <circle cx="105" cy="35" r="25" fill="url(#cloudGradient)" stroke="#B8D4F0" strokeWidth="1" />
          {/* Center top puff */}
          <circle cx="80" cy="28" r="22" fill="url(#cloudGradient)" stroke="#B8D4F0" strokeWidth="1" />
          {/* Fill center */}
          <ellipse cx="80" cy="45" rx="40" ry="25" fill="url(#cloudGradient)" />
        </g>

        {/* Little arms/puffs holding the file */}
        <ellipse cx="58" cy="72" rx="10" ry="8" fill="url(#cloudGradient)" stroke="#B8D4F0" strokeWidth="1" />
        <ellipse cx="102" cy="72" rx="10" ry="8" fill="url(#cloudGradient)" stroke="#B8D4F0" strokeWidth="1" />

        {/* File being held */}
        <g filter="url(#fileShadow)">
          {/* File body */}
          <path
            d="M65 78 L65 108 L95 108 L95 86 L87 78 Z"
            fill="url(#fileGradient)"
            stroke="#C8DFF5"
            strokeWidth="1.5"
          />
          {/* Folded corner */}
          <path
            d="M87 78 L87 86 L95 86"
            fill="#E8F4FF"
            stroke="#C8DFF5"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* File lines */}
          <line x1="70" y1="90" x2="90" y2="90" stroke="#C8DFF5" strokeWidth="2" strokeLinecap="round" />
          <line x1="70" y1="96" x2="85" y2="96" stroke="#D8EBFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="70" y1="102" x2="88" y2="102" stroke="#D8EBFF" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Cute sparkly eyes - moved up slightly */}
        {/* Left eye */}
        <ellipse cx="65" cy="42" rx="6" ry="7" fill="url(#eyeShine)" />
        <circle cx="63" cy="39" r="2.5" fill="white" />
        <circle cx="67" cy="44" r="1.2" fill="white" />

        {/* Right eye */}
        <ellipse cx="95" cy="42" rx="6" ry="7" fill="url(#eyeShine)" />
        <circle cx="93" cy="39" r="2.5" fill="white" />
        <circle cx="97" cy="44" r="1.2" fill="white" />

        {/* Happy closed-eye smile expression */}
        <path
          d="M74 54 Q80 60 86 54"
          stroke="#FF9999"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy cheeks */}
        <ellipse cx="52" cy="50" rx="6" ry="4" fill="#FFCECE" opacity="0.7" />
        <ellipse cx="108" cy="50" rx="6" ry="4" fill="#FFCECE" opacity="0.7" />

        {/* Sparkles around the cloud */}
        {/* Top sparkle */}
        <g transform="translate(80, 5)">
          <path d="M0 -4 L1 0 L0 4 L-1 0 Z" fill="#7CB9FF" />
          <path d="M-4 0 L0 1 L4 0 L0 -1 Z" fill="#7CB9FF" />
        </g>

        {/* Left sparkle */}
        <g transform="translate(18, 35)">
          <path d="M0 -3 L0.8 0 L0 3 L-0.8 0 Z" fill="#A8D4FF" />
          <path d="M-3 0 L0 0.8 L3 0 L0 -0.8 Z" fill="#A8D4FF" />
        </g>

        {/* Right sparkle */}
        <g transform="translate(142, 40)">
          <path d="M0 -3 L0.8 0 L0 3 L-0.8 0 Z" fill="#A8D4FF" />
          <path d="M-3 0 L0 0.8 L3 0 L0 -0.8 Z" fill="#A8D4FF" />
        </g>

        {/* Tiny dots for extra cuteness */}
        <circle cx="28" cy="65" r="1.5" fill="#C8E0FF" />
        <circle cx="132" cy="68" r="1.5" fill="#C8E0FF" />
        <circle cx="35" cy="22" r="1" fill="#D4EBFF" />
        <circle cx="125" cy="18" r="1" fill="#D4EBFF" />
      </svg>
    </div>
  );
}
