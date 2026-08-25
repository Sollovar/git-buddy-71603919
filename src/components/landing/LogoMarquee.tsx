import { cn } from "@/lib/utils";

interface LogoMarqueeProps {
  children: React.ReactNode;
  duration?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  className?: string;
}

export function LogoMarquee({
  children,
  duration = 32,
  pauseOnHover = true,
  direction = "left",
  className,
}: LogoMarqueeProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent_0%,black_3%,black_97%,transparent_100%)]",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max items-center gap-0",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `marquee-scroll ${duration}s linear infinite ${
            direction === "right" ? "reverse" : "normal"
          }`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
