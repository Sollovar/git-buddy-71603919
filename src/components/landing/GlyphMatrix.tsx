import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type GlyphMatrixProps = {
  glyphs?: string;
  cellSize?: number;
  mutationRate?: number;
  interval?: number;
  fadeBottom?: number;
  /** Any CSS color string, e.g. "oklch(0.5 0.02 65)" or a var() value. */
  color?: string;
  boost?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Canvas-based animated glyph matrix, intended as a decorative section background.
 * Renders nothing meaningful for a11y — always aria-hidden.
 */
export function GlyphMatrix({
  glyphs = "01·•+*/\\<>=",
  cellSize = 14,
  mutationRate = 0.04,
  interval = 90,
  fadeBottom = 0.6,
  color = "#6B7280",
  boost = 1.2,
  className,
  style,
}: GlyphMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = [...glyphs];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cols = 0;
    let rows = 0;
    let cells: string[] = [];
    let raf = 0;
    let timer: number | undefined;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${cellSize}px ui-monospace, monospace`;
      ctx.textBaseline = "top";

      for (let y = 0; y < rows; y++) {
        // vertical fade toward the bottom
        const t = rows <= 1 ? 0 : y / (rows - 1);
        const alpha = Math.max(0, Math.min(1, (1 - t * fadeBottom) * boost));
        ctx.globalAlpha = alpha;
        for (let x = 0; x < cols; x++) {
          const ch = cells[y * cols + x];
          if (!ch) continue;
          ctx.fillStyle = color;
          ctx.fillText(ch, x * cellSize, y * cellSize);
        }
      }
      ctx.globalAlpha = 1;
    };

    const seed = () => {
      cells = new Array(cols * rows);
      for (let i = 0; i < cells.length; i++) {
        cells[i] = Math.random() < 0.55 ? chars[(Math.random() * chars.length) | 0]! : " ";
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      cols = Math.ceil(rect.width / cellSize) + 1;
      rows = Math.ceil(rect.height / cellSize) + 1;
      seed();
      draw();
    };

    const tick = () => {
      const mutations = Math.max(1, Math.round(cells.length * mutationRate));
      for (let i = 0; i < mutations; i++) {
        const idx = (Math.random() * cells.length) | 0;
        cells[idx] = Math.random() < 0.2 ? " " : chars[(Math.random() * chars.length) | 0]!;
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (!reduced) timer = window.setInterval(tick, interval);

    return () => {
      ro.disconnect();
      if (timer) window.clearInterval(timer);
      cancelAnimationFrame(raf);
    };
  }, [glyphs, cellSize, mutationRate, interval, fadeBottom, color, boost]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={style}
    />
  );
}
