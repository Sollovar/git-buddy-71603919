function LogoWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-16 w-44 shrink-0 items-center justify-center px-5 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}

export function PancakeSwapLogo() {
  return (
    <LogoWrapper>
      <svg viewBox="0 0 164 40" className="h-8 w-auto">
        <circle cx="20" cy="20" r="18" fill="#1FC7D4" />
        <path
          d="M20 6c-1 0-1.8.4-2.5 1.1C16.3 5.5 14.5 4.5 12.5 4.5c-2.2 0-4.1 1.2-5.2 3.1-.5-.4-1.1-.7-1.8-.7-1.5 0-2.7 1.2-2.7 2.7 0 .5.1.9.4 1.3-1.5 1.2-2.5 3-2.5 5.1 0 3.6 2.9 6.5 6.5 6.5.6 0 1.1-.1 1.6-.2.4 1.2 1.5 2.1 2.9 2.1.8 0 1.5-.3 2-.8.5 2.1 2.4 3.7 4.7 3.7 2.4 0 4.3-1.6 4.8-3.8.5.6 1.3 1 2.1 1 1.4 0 2.5-.9 2.9-2.1.5.1 1.1.2 1.6.2 3.6 0 6.5-2.9 6.5-6.5 0-2.1-1-3.9-2.5-5.1.2-.4.4-.8.4-1.3 0-1.5-1.2-2.7-2.7-2.7-.7 0-1.3.3-1.8.7-1.1-1.9-3-3.1-5.2-3.1-2 0-3.8 1-4.9 2.6C21.8 6.4 21 6 20 6z"
          fill="#633001"
        />
        <text x="44" y="25" fontSize="16" fontWeight="600" fill="#633001" fontFamily="Sora, sans-serif">
          PancakeSwap
        </text>
      </svg>
    </LogoWrapper>
  );
}

export function UniswapLogo() {
  return (
    <LogoWrapper>
      <svg viewBox="0 0 132 40" className="h-8 w-auto">
        <circle cx="20" cy="20" r="18" fill="#FF007A" />
        <path
          d="M20 8c-1.5 0-2.8 1.1-3 2.6-.3-.2-.6-.3-1-.3-1.6 0-2.6 1.8-1.7 3.1-2.6 1.5-4.3 4.3-4.3 7.5 0 4.8 3.9 8.7 8.7 8.7s8.7-3.9 8.7-8.7c0-3.2-1.7-6-4.3-7.5.9-1.3 0-3.1-1.7-3.1-.4 0-.7.1-1 .3-.2-1.5-1.5-2.6-3-2.6zm-2 10.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm4 0c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm-2 5.5c1.4 0 2.6 1 2.9 2.3-1.7 1.5-4 2.2-6.3 1.8.4-1.4 1.6-2.4 3.1-2.4h.3z"
          fill="white"
        />
        <text x="44" y="25" fontSize="16" fontWeight="600" fill="#FF007A" fontFamily="Sora, sans-serif">
          Uniswap
        </text>
      </svg>
    </LogoWrapper>
  );
}

export function AerodromeLogo() {
  return (
    <LogoWrapper>
      <svg viewBox="0 0 152 40" className="h-8 w-auto">
        <circle cx="20" cy="20" r="18" fill="#5C8AE6" />
        <path
          d="M20 7l-4 8h8l-4-8zm0 26l-4-8h8l-4 8zM7 20l8-4v8l-8-4zm26 0l-8-4v8l8-4z"
          fill="white"
        />
        <circle cx="20" cy="20" r="4" fill="white" />
        <text x="44" y="25" fontSize="16" fontWeight="600" fill="#5C8AE6" fontFamily="Sora, sans-serif">
          Aerodrome
        </text>
      </svg>
    </LogoWrapper>
  );
}

export function PumpSwapLogo() {
  return (
    <LogoWrapper>
      <svg viewBox="0 0 152 40" className="h-8 w-auto">
        <circle cx="20" cy="20" r="18" fill="#D9FF5D" />
        <path
          d="M20 10c-1.1 0-2 .9-2 2v3.5c-2.5.5-4.5 2.5-5 5H12c-1.1 0-2 .9-2 2s.9 2 2 2h1c.5 2.5 2.5 4.5 5 5V30c0 1.1.9 2 2 2s2-.9 2-2v-1.5c.7-.2 1.3-.4 1.9-.8l1.1 1.1c.8.8 2 .8 2.8 0 .8-.8.8-2 0-2.8l-1.1-1.1c.4-.6.6-1.2.8-1.9H28c1.1 0 2-.9 2-2s-.9-2-2-2h-1v-1c0-3.3-2.7-6-6-6zm0 8c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z"
          fill="#0A0A0A"
        />
        <text x="44" y="25" fontSize="16" fontWeight="600" fill="#0A0A0A" fontFamily="Sora, sans-serif">
          PumpSwap
        </text>
      </svg>
    </LogoWrapper>
  );
}

export function RaydiumLogo() {
  return (
    <LogoWrapper>
      <svg viewBox="0 0 132 40" className="h-8 w-auto">
        <circle cx="20" cy="20" r="18" fill="#212E5D" />
        <path
          d="M20 6l4 14h6l-10 6-4-14H10l10-6z"
          fill="#5D6CFF"
        />
        <text x="44" y="25" fontSize="16" fontWeight="600" fill="#212E5D" fontFamily="Sora, sans-serif">
          Raydium
        </text>
      </svg>
    </LogoWrapper>
  );
}

export function MeteoraLogo() {
  return (
    <LogoWrapper>
      <svg viewBox="0 0 132 40" className="h-8 w-auto">
        <circle cx="20" cy="20" r="18" fill="#0A1F44" />
        <circle cx="20" cy="20" r="6" fill="#A6D8FF" />
        <path
          d="M20 6c0 0-8 8-8 14s3.6 10 8 10 8-4 8-10-8-14-8-14zm0 4c2 3 5 6.5 5 10 0 3-2.2 5-5 5s-5-2-5-5c0-3.5 3-7 5-10z"
          fill="#A6D8FF"
        />
        <text x="44" y="25" fontSize="16" fontWeight="600" fill="#0A1F44" fontFamily="Sora, sans-serif">
          Meteora
        </text>
      </svg>
    </LogoWrapper>
  );
}

export function OrcaLogo() {
  return (
    <LogoWrapper>
      <svg viewBox="0 0 112 40" className="h-8 w-auto">
        <circle cx="20" cy="20" r="18" fill="#F2C94C" />
        <path
          d="M20 7c-3.3 0-6 2.7-6 6 0 2.2 1.2 4.1 3 5.2v1.6c-2.8 1-5 3.7-5 6.9 0 .4.4.8.8.8h14.4c.4 0 .8-.4.8-.8 0-3.2-2.2-5.9-5-6.9v-1.6c1.8-1.1 3-3 3-5.2 0-3.3-2.7-6-6-6z"
          fill="white"
        />
        <path
          d="M17 19c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
          fill="#0A1F44"
        />
        <text x="44" y="25" fontSize="16" fontWeight="600" fill="#0A1F44" fontFamily="Sora, sans-serif">
          Orca
        </text>
      </svg>
    </LogoWrapper>
  );
}
