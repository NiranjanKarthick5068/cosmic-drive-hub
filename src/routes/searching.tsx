import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { SearchPulse } from "@/components/dl/SearchPulse";
import { RippleButton } from "@/components/dl/RippleButton";

export const Route = createFileRoute("/searching")({ component: Searching });

function Searching() {
  const nav = useNavigate();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("Scanning area…");

  useEffect(() => {
    const a = setTimeout(() => {
      setCount(2);
      setPhase("Found 2 nearby drivers");
    }, 1200);
    const b = setTimeout(() => {
      setCount(5);
      setPhase("Matching with best driver…");
    }, 2400);
    const c = setTimeout(() => nav({ to: "/driver-found" }), 3800);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
    };
  }, [nav]);

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* faux map bg */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="oklch(0.22 0.04 282)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center">
          <SearchPulse />

          {/* driver dots */}
          <AnimatePresence>
            {Array.from({ length: count }).map((_, i) => {
              const angle = (i / 5) * Math.PI * 2;
              const r = 110 + (i % 2) * 30;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute w-3 h-3 rounded-full bg-lime ring-4 ring-lime/30"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * r}px)`,
                    top: `calc(50% + ${Math.sin(angle) * r}px)`,
                  }}
                />
              );
            })}
          </AnimatePresence>

          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <p className="font-display font-bold text-lg">{phase}</p>
            <div className="flex justify-center gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="w-1.5 h-1.5 rounded-full bg-violet-light"
                />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative p-5">
          <RippleButton variant="outline" size="lg" block onClick={() => nav({ to: "/book" })}>
            Cancel search
          </RippleButton>
        </div>
      </div>
    </PhoneFrame>
  );
}
