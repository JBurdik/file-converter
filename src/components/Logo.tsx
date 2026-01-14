interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = false }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 56, text: "text-2xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Background gradient */}
          <linearGradient
            id="logoGradient"
            x1="0"
            y1="0"
            x2="64"
            y2="64"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4a9dff" />
            <stop offset="1" stopColor="#2d88ff" />
          </linearGradient>

          {/* Cloud gradient */}
          <linearGradient
            id="logoCloudGradient"
            x1="32"
            y1="16"
            x2="32"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E8F4FF" />
          </linearGradient>

          {/* Arrow gradient */}
          <linearGradient
            id="logoArrowGradient"
            x1="32"
            y1="28"
            x2="32"
            y2="52"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2d88ff" />
            <stop offset="1" stopColor="#1a6fd4" />
          </linearGradient>

          {/* Shadow filter */}
          <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor="#2d88ff"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        {/* Rounded square background */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="14"
          fill="url(#logoGradient)"
        />

        {/* Inner subtle border */}
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="12"
          fill="none"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="1"
        />

        {/* Cloud shape */}
        <g filter="url(#logoShadow)">
          {/* Main cloud body */}
          <ellipse cx="32" cy="28" rx="16" ry="8" fill="url(#logoCloudGradient)" />
          {/* Left puff */}
          <circle cx="20" cy="26" r="8" fill="url(#logoCloudGradient)" />
          {/* Right puff */}
          <circle cx="44" cy="26" r="8" fill="url(#logoCloudGradient)" />
          {/* Top puff */}
          <circle cx="32" cy="20" r="9" fill="url(#logoCloudGradient)" />
          {/* Fill center */}
          <ellipse cx="32" cy="25" rx="12" ry="8" fill="url(#logoCloudGradient)" />
        </g>

        {/* Conversion arrows - circular arrows representing file conversion */}
        <g>
          {/* Down arrow from cloud */}
          <path
            d="M32 34 L32 48"
            stroke="url(#logoArrowGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M27 44 L32 50 L37 44"
            stroke="url(#logoArrowGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Left curved arrow */}
          <path
            d="M22 42 Q16 42 16 48 Q16 54 24 54"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M22 52 L24 55 L27 53"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />

          {/* Right curved arrow */}
          <path
            d="M42 42 Q48 42 48 48 Q48 54 40 54"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M42 52 L40 55 L37 53"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
        </g>

        {/* Sparkle accents */}
        <circle cx="14" cy="18" r="1.5" fill="white" opacity="0.6" />
        <circle cx="50" cy="14" r="1" fill="white" opacity="0.5" />
        <circle cx="52" cy="22" r="1.5" fill="white" opacity="0.4" />
      </svg>

      {showText && (
        <span className={`font-semibold ${text} text-gray-800`}>
          CloudConvert
        </span>
      )}
    </div>
  );
}

// Standalone icon version for favicon
export function LogoIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="faviconGradient"
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4a9dff" />
          <stop offset="1" stopColor="#2d88ff" />
        </linearGradient>
        <linearGradient
          id="faviconCloudGradient"
          x1="32"
          y1="16"
          x2="32"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E8F4FF" />
        </linearGradient>
        <linearGradient
          id="faviconArrowGradient"
          x1="32"
          y1="28"
          x2="32"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2d88ff" />
          <stop offset="1" stopColor="#1a6fd4" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="64" height="64" rx="14" fill="url(#faviconGradient)" />

      {/* Cloud */}
      <ellipse cx="32" cy="28" rx="16" ry="8" fill="url(#faviconCloudGradient)" />
      <circle cx="20" cy="26" r="8" fill="url(#faviconCloudGradient)" />
      <circle cx="44" cy="26" r="8" fill="url(#faviconCloudGradient)" />
      <circle cx="32" cy="20" r="9" fill="url(#faviconCloudGradient)" />
      <ellipse cx="32" cy="25" rx="12" ry="8" fill="url(#faviconCloudGradient)" />

      {/* Arrow */}
      <path
        d="M32 34 L32 48"
        stroke="url(#faviconArrowGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M27 44 L32 50 L37 44"
        stroke="url(#faviconArrowGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Side arrows */}
      <path
        d="M22 42 Q16 42 16 48 Q16 54 24 54"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M22 52 L24 55 L27 53"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M42 42 Q48 42 48 48 Q48 54 40 54"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M42 52 L40 55 L37 53"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}
