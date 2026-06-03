import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";

export function CountUp({
  to,
  prefix = "",
  duration = 1,
}: {
  to: number;
  prefix?: string;
  duration?: number;
}) {
  const mv = useMotionValue(0);
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(mv, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (val) => setV(Math.round(val)),
    });
    return c.stop;
  }, [to, duration, mv]);
  return (
    <span className="tabular-nums">
      {prefix}
      {v.toLocaleString("en-IN")}
    </span>
  );
}
