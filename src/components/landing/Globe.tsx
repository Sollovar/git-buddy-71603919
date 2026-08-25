import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { motion } from "motion/react";

const MARKERS: { location: [number, number]; size: number }[] = [
  { location: [40.7128, -74.006], size: 0.09 }, // New York
  { location: [51.5072, -0.1276], size: 0.08 }, // London
  { location: [1.3521, 103.8198], size: 0.08 }, // Singapore
  { location: [35.6762, 139.6503], size: 0.07 }, // Tokyo
  { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
  { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
  { location: [37.7749, -122.4194], size: 0.06 }, // San Francisco
  { location: [50.1109, 8.6821], size: 0.05 }, // Frankfurt
];

export function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<number | null>(null);
  const phi = useRef(0);
  const drag = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = 0;
    const onResize = () => {
      width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 5.4,
      baseColor: [0.95, 0.92, 0.86],
      markerColor: [0.35, 0.62, 0.44],
      glowColor: [0.98, 0.96, 0.92],
      markers: MARKERS,
    });

    let raf = 0;
    const loop = () => {
      if (pointer.current === null) phi.current += 0.0035;
      globe.update({
        phi: phi.current + drag.current,
        width: width * 2,
        height: width * 2,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };

  }, []);

  const startDrag = (clientX: number) => {
    pointer.current = clientX - drag.current * 200;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  };
  const moveDrag = (clientX: number) => {
    if (pointer.current === null) return;
    drag.current = (clientX - pointer.current) / 200;
  };
  const endDrag = () => {
    pointer.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      className={`relative mx-auto aspect-square w-full max-w-[36rem] ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-6 rounded-full bg-cream/70 blur-3xl"
      />
      <canvas
        ref={canvasRef}
        aria-label="Interactive globe showing Vellum's connected trading venues"
        role="img"
        className="relative h-full w-full cursor-grab opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]"
        onPointerDown={(e) => startDrag(e.clientX)}
        onPointerUp={endDrag}
        onPointerOut={endDrag}
        onMouseMove={(e) => moveDrag(e.clientX)}
        onTouchMove={(e) => e.touches[0] && moveDrag(e.touches[0].clientX)}
      />
    </motion.div>
  );
}
