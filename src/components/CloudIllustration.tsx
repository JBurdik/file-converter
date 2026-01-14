import { useEffect, useState } from "react";

type IconType = "file" | "video" | "photo" | "audio" | "nodes";

export default function CloudIllustration() {
  const [currentIcon, setCurrentIcon] = useState<IconType>("file");
  const [isAnimating, setIsAnimating] = useState(false);

  const icons: IconType[] = ["file", "video", "photo", "audio", "nodes"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIcon((prev) => {
          const currentIndex = icons.indexOf(prev);
          return icons[(currentIndex + 1) % icons.length];
        });
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderIcon = () => {
    switch (currentIcon) {
      case "file":
        return (
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
        );
      case "video":
        return (
          <g filter="url(#fileShadow)">
            {/* Video camera body */}
            <rect
              x="62"
              y="80"
              width="28"
              height="22"
              rx="4"
              fill="url(#fileGradient)"
              stroke="#C8DFF5"
              strokeWidth="1.5"
            />
            {/* Camera lens */}
            <circle cx="76" cy="91" r="6" fill="#E8F4FF" stroke="#B8D4F0" strokeWidth="1.5" />
            <circle cx="76" cy="91" r="3" fill="#7CB9FF" />
            {/* Recording light */}
            <circle cx="85" cy="84" r="2" fill="#FF6B6B" />
            {/* Viewfinder/side part */}
            <path
              d="M90 85 L100 80 L100 102 L90 97 Z"
              fill="url(#fileGradient)"
              stroke="#C8DFF5"
              strokeWidth="1.5"
            />
          </g>
        );
      case "photo":
        return (
          <g filter="url(#fileShadow)">
            {/* Camera body */}
            <rect
              x="60"
              y="82"
              width="40"
              height="26"
              rx="4"
              fill="url(#fileGradient)"
              stroke="#C8DFF5"
              strokeWidth="1.5"
            />
            {/* Camera top bump */}
            <rect
              x="70"
              y="78"
              width="12"
              height="6"
              rx="2"
              fill="url(#fileGradient)"
              stroke="#C8DFF5"
              strokeWidth="1"
            />
            {/* Lens outer */}
            <circle cx="80" cy="95" r="9" fill="#E8F4FF" stroke="#B8D4F0" strokeWidth="1.5" />
            {/* Lens inner */}
            <circle cx="80" cy="95" r="5" fill="#7CB9FF" />
            {/* Lens reflection */}
            <circle cx="78" cy="93" r="1.5" fill="white" opacity="0.8" />
            {/* Flash */}
            <rect x="88" y="85" width="6" height="4" rx="1" fill="#FFE066" stroke="#E8D45C" strokeWidth="0.5" />
          </g>
        );
      case "audio":
        // Headphones ON the cloud's head
        return (
          <g>
            {/* Headphone band - goes over top of cloud */}
            <path
              d="M28 45 Q28 5 80 5 Q132 5 132 45"
              fill="none"
              stroke="#7CB9FF"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M28 45 Q28 5 80 5 Q132 5 132 45"
              fill="none"
              stroke="#A8D4FF"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Left ear cup - on cloud's left side */}
            <rect
              x="16"
              y="38"
              width="16"
              height="22"
              rx="5"
              fill="url(#fileGradient)"
              stroke="#7CB9FF"
              strokeWidth="2"
            />
            {/* Left ear cushion */}
            <rect
              x="19"
              y="42"
              width="10"
              height="14"
              rx="3"
              fill="#E8F4FF"
              stroke="#B8D4F0"
              strokeWidth="1"
            />
            {/* Right ear cup - on cloud's right side */}
            <rect
              x="128"
              y="38"
              width="16"
              height="22"
              rx="5"
              fill="url(#fileGradient)"
              stroke="#7CB9FF"
              strokeWidth="2"
            />
            {/* Right ear cushion */}
            <rect
              x="131"
              y="42"
              width="10"
              height="14"
              rx="3"
              fill="#E8F4FF"
              stroke="#B8D4F0"
              strokeWidth="1"
            />
            {/* Music notes floating */}
            <text x="70" y="95" fontSize="12" fill="#7CB9FF">♪</text>
            <text x="88" y="100" fontSize="10" fill="#A8D4FF">♫</text>
            <text x="78" y="105" fontSize="8" fill="#C8DFF5">♪</text>
          </g>
        );
      case "nodes":
        // Connected nodes representing audio/data processing
        return (
          <g filter="url(#fileShadow)">
            {/* Connection lines */}
            <line x1="60" y1="85" x2="80" y2="95" stroke="#B8D4F0" strokeWidth="2" />
            <line x1="80" y1="95" x2="100" y2="85" stroke="#B8D4F0" strokeWidth="2" />
            <line x1="80" y1="95" x2="80" y2="110" stroke="#B8D4F0" strokeWidth="2" />
            <line x1="60" y1="85" x2="50" y2="100" stroke="#B8D4F0" strokeWidth="2" />
            <line x1="100" y1="85" x2="110" y2="100" stroke="#B8D4F0" strokeWidth="2" />
            <line x1="50" y1="100" x2="65" y2="110" stroke="#B8D4F0" strokeWidth="2" />
            <line x1="110" y1="100" x2="95" y2="110" stroke="#B8D4F0" strokeWidth="2" />

            {/* Main center node */}
            <circle cx="80" cy="95" r="8" fill="url(#fileGradient)" stroke="#7CB9FF" strokeWidth="2" />
            <circle cx="80" cy="95" r="4" fill="#7CB9FF" />

            {/* Top left node */}
            <circle cx="60" cy="85" r="6" fill="url(#fileGradient)" stroke="#A8D4FF" strokeWidth="1.5" />
            <circle cx="60" cy="85" r="3" fill="#A8D4FF" />

            {/* Top right node */}
            <circle cx="100" cy="85" r="6" fill="url(#fileGradient)" stroke="#A8D4FF" strokeWidth="1.5" />
            <circle cx="100" cy="85" r="3" fill="#A8D4FF" />

            {/* Bottom center node */}
            <circle cx="80" cy="110" r="5" fill="url(#fileGradient)" stroke="#C8DFF5" strokeWidth="1.5" />
            <circle cx="80" cy="110" r="2.5" fill="#7CB9FF" />

            {/* Far left node */}
            <circle cx="50" cy="100" r="5" fill="url(#fileGradient)" stroke="#C8DFF5" strokeWidth="1.5" />
            <circle cx="50" cy="100" r="2.5" fill="#A8D4FF" />

            {/* Far right node */}
            <circle cx="110" cy="100" r="5" fill="url(#fileGradient)" stroke="#C8DFF5" strokeWidth="1.5" />
            <circle cx="110" cy="100" r="2.5" fill="#A8D4FF" />

            {/* Bottom outer nodes */}
            <circle cx="65" cy="110" r="4" fill="url(#fileGradient)" stroke="#D8EBFF" strokeWidth="1" />
            <circle cx="95" cy="110" r="4" fill="url(#fileGradient)" stroke="#D8EBFF" strokeWidth="1" />
          </g>
        );
    }
  };

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

        {/* Little arms/puffs holding items (hidden for headphones) */}
        {currentIcon !== "audio" && (
          <>
            <ellipse cx="58" cy="72" rx="10" ry="8" fill="url(#cloudGradient)" stroke="#B8D4F0" strokeWidth="1" />
            <ellipse cx="102" cy="72" rx="10" ry="8" fill="url(#cloudGradient)" stroke="#B8D4F0" strokeWidth="1" />
          </>
        )}

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

        {/* Icon with fade animation */}
        <g className={isAnimating ? "animate-fade-out" : "animate-fade-in"}>
          {renderIcon()}
        </g>

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
