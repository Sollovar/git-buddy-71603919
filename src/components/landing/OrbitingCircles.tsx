import type { ReactNode } from "react";

type OrbitingCirclesProps = {
  children: ReactNode;
  /** orbit radius in px */
  radius?: number;
  /** seconds for a full revolution */
  duration?: number;
  /** negative delay offsets the starting angle */
  delay?: number;
  reverse?: boolean;
  iconSize?: number;
  className?: string;
};

export function OrbitingCircles({
  children,
  radius = 120,
  duration = 20,
  delay = 0,
  reverse = false,
  iconSize = 44,
  className = "",
}: OrbitingCirclesProps) {
  return (
    <div
      className={`orbit-spin pointer-events-none absolute left-1/2 top-1/2 h-0 w-0 ${className}`}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      <div
        className="absolute"
        style={{
          transform: `translateX(${radius}px) translate(-50%, -50%)`,
          width: iconSize,
          height: iconSize,
        }}
      >
        <div
          className="orbit-spin flex h-full w-full items-center justify-center"
          style={{
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            animationDirection: reverse ? "normal" : "reverse",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function OrbitPath({ radius }: { radius: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-dashed border-foreground/15"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
      }}
    />
  );
}
