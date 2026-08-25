import { cn } from "@/lib/utils";

interface RetroGridProps {
  className?: string;
  /** Rotation angle of the grid in degrees */
  angle?: number;
  /** Size of each grid cell in pixels */
  cellSize?: number;
  /** Opacity of the grid lines (0 to 1) */
  opacity?: number;
  /** Color of the grid lines */
  lineColor?: string;
}

export function RetroGrid({
  className,
  angle = 65,
  cellSize = 60,
  opacity = 0.35,
  lineColor = "currentColor",
}: RetroGridProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]",
        className,
      )}
      style={
        {
          "--retro-grid-cell": cellSize,
          opacity,
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0"
        style={{ transform: `rotateX(${angle}deg)` }}
      >
        <div
          className="absolute inset-x-[-200%] top-[-100%] h-[300%] animate-[retro-grid-scroll_18s_linear_infinite] [transform-origin:100%_0_0]"
          style={{
            backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 0), linear-gradient(to bottom, ${lineColor} 1px, transparent 0)`,
            backgroundSize: `${cellSize}px ${cellSize}px`,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-transparent" />
    </div>
  );
}
