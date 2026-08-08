import React from "react";

interface MarktivoLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "horizontal" | "vertical";
  showSubtitle?: boolean;
}

export const MarktivoLogo: React.FC<MarktivoLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  variant = "horizontal",
  showSubtitle = false,
}) => {
  // Height / scale configuration
  const dimensions = {
    sm: { iconHeight: 28, textHeight: 20 },
    md: { iconHeight: 38, textHeight: 26 },
    lg: { iconHeight: 58, textHeight: 40 },
    xl: { iconHeight: 90, textHeight: 60 },
  }[size];

  // EXACT LOW-POLY 'M' CHEVRON SYMBOL (Matching attached transparent logo)
  const LogoIcon = (
    <div
      className="flex-shrink-0 flex items-center justify-center filter drop-shadow-[0_0_14px_rgba(217,70,239,0.3)]"
      style={{ height: `${dimensions.iconHeight}px`, width: `${dimensions.iconHeight * 1.22}px` }}
    >
      <svg
        viewBox="0 0 120 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* === TOP LOW-POLY M-CHEVRON BAND === */}
        {/* Left Wing (Magenta / Fuchsia / Pink / Ruby) */}
        <polygon points="0,30 15,15 12,38" fill="#be185d" />
        <polygon points="15,15 30,0 25,28" fill="#e11d48" />
        <polygon points="15,15 25,28 12,38" fill="#ec4899" />
        <polygon points="0,30 12,38 0,50" fill="#9d174d" />
        <polygon points="12,38 25,28 22,58" fill="#d946ef" />
        <polygon points="0,50 12,38 22,58" fill="#a855f7" />
        <polygon points="30,0 45,18 25,28" fill="#f43f5e" />
        <polygon points="25,28 45,18 38,48" fill="#d946ef" />
        <polygon points="22,58 25,28 38,48" fill="#c026d3" />
        <polygon points="45,18 60,35 38,48" fill="#8b5cf6" />
        <polygon points="38,48 60,35 48,62" fill="#06b6d4" />
        <polygon points="22,58 38,48 48,62" fill="#7c3aed" />

        {/* Center V Notch (Electric Cyan / Sky Blue / Royal Blue) */}
        <polygon points="60,35 75,18 72,62" fill="#0284c7" />
        <polygon points="60,35 72,62 60,72" fill="#06b6d4" />
        <polygon points="60,35 60,72 48,62" fill="#00f2fe" />
        <polygon points="45,18 60,35 75,18" fill="#3b82f6" />

        {/* Right Wing (Lime Green / Bright Yellow / Amber / Orange) */}
        <polygon points="60,35 75,18 82,48" fill="#10b981" />
        <polygon points="75,18 90,0 95,28" fill="#84cc16" />
        <polygon points="75,18 95,28 82,48" fill="#a3e635" />
        <polygon points="90,0 105,15 95,28" fill="#facc15" />
        <polygon points="105,15 120,30 108,38" fill="#eab308" />
        <polygon points="95,28 105,15 108,38" fill="#f59e0b" />
        <polygon points="108,38 120,30 120,50" fill="#d97706" />
        <polygon points="95,28 108,38 98,58" fill="#eab308" />
        <polygon points="120,50 108,38 98,58" fill="#b45309" />
        <polygon points="82,48 95,28 98,58" fill="#84cc16" />
        <polygon points="82,48 98,58 72,62" fill="#10b981" />
        <polygon points="72,62 98,58 60,72" fill="#059669" />

        {/* === LOWER SEPARATE CORNER TRIANGLE BLOCKS === */}
        {/* Bottom Left Corner Triangle (Cyan / Sky Blue) */}
        <polygon points="0,58 38,92 16,75" fill="#00f2fe" />
        <polygon points="0,58 16,75 0,92" fill="#06b6d4" />
        <polygon points="16,75 38,92 0,92" fill="#0284c7" />

        {/* Bottom Right Corner Triangle (Magenta / Violet / Purple) */}
        <polygon points="120,58 82,92 104,75" fill="#d946ef" />
        <polygon points="120,58 104,75 120,92" fill="#c026d3" />
        <polygon points="104,75 82,92 120,92" fill="#7e22ce" />
      </svg>
    </div>
  );

  // EXACT WHITE 'MARKTIVO' VECTOR WORDMARK (Matching logo1.png & logo2.png)
  const LogoText = (
    <div
      className="flex flex-col items-center justify-center"
      style={{ height: `${dimensions.textHeight}px` }}
    >
      <svg
        viewBox="0 0 280 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Pure White Crisp Geometric Typography */}
        {/* M */}
        <path
          d="M 0,36 L 0,0 L 16,18 L 32,0 L 32,36 L 25,36 L 25,11 L 16,21 L 7,11 L 7,36 Z"
          fill="#FFFFFF"
        />
        {/* A (No crossbar - chevron /\ matching logo1.png & logo2.png) */}
        <path
          d="M 39,36 L 55,0 L 63,0 L 79,36 L 70.5,36 L 59,8 L 47.5,36 Z"
          fill="#FFFFFF"
        />
        {/* R */}
        <path
          d="M 84,0 L 102,0 C 110,0 115,4 115,11 C 115,17 110,21 103,22 L 115,36 L 106,36 L 95,23 L 91,23 L 91,36 L 84,36 Z M 91,6 L 91,17 L 101,17 C 105,17 108,15 108,11 C 108,7 105,6 101,6 Z"
          fill="#FFFFFF"
        />
        {/* K */}
        <path
          d="M 120,0 L 127,0 L 127,15 L 141,0 L 150,0 L 134,16 L 151,36 L 142,36 L 127,18 L 127,36 L 120,36 Z"
          fill="#FFFFFF"
        />
        {/* T */}
        <path
          d="M 155,0 L 183,0 L 183,6 L 172.5,6 L 172.5,36 L 165.5,36 L 165.5,6 L 155,6 Z"
          fill="#FFFFFF"
        />
        {/* I */}
        <path
          d="M 189,0 L 196,0 L 196,36 L 189,36 Z"
          fill="#FFFFFF"
        />
        {/* V */}
        <path
          d="M 202,0 L 209,0 L 216.5,28 L 224,0 L 231,0 L 220,36 L 213,36 Z"
          fill="#FFFFFF"
        />
        {/* O */}
        <path
          d="M 257,0 C 267.5,0 276,8 276,18 C 276,28 267.5,36 257,36 C 246.5,36 238,28 238,18 C 238,8 246.5,0 257,0 Z M 257,6 C 250,6 245,11 245,18 C 245,25 250,30 257,30 C 264,30 269,25 269,18 C 269,11 264,6 257,6 Z"
          fill="#FFFFFF"
        />
      </svg>
      {showSubtitle && (
        <span className="text-[10px] tracking-[0.25em] font-extrabold text-slate-200 uppercase mt-1">
          AGÊNCIA DE MARKETING DIGITAL
        </span>
      )}
    </div>
  );

  if (variant === "vertical") {
    return (
      <div className={`inline-flex flex-col items-center space-y-3 text-center select-none ${className}`}>
        {LogoIcon}
        {showText && LogoText}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-3 select-none ${className}`}>
      {LogoIcon}
      {showText && LogoText}
    </div>
  );
};
