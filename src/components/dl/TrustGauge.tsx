import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

export function TrustGauge({ score, size = 168 }: { score: number; size?: number }) {
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const progress = useMotionValue(0);
  const dash = useTransform(progress, (v) => circumference * (1 - v / 100));
  const [display, setDisplay] = useState(0);

  const color =
    score >= 71
      ? "oklch(0.86 0.21 130)"
      : score >= 41
        ? "oklch(0.78 0.18 65)"
        : "oklch(0.65 0.24 18)";

  useEffect(() => {
    const c = animate(progress, score, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return c.stop;
  }, [score, progress]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="oklch(0.22 0.04 282)"
          strokeWidth={10}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dash, filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display font-bold text-4xl tabular-nums"
          style={{ color, textShadow: `0 0 24px ${color}66` }}
        >
          {display}
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mt-1">
          Trust Score
        </span>
      </div>
    </div>
  );
}
