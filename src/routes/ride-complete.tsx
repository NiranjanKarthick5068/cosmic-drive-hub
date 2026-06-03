import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { CountUp } from "@/components/dl/CountUp";
import { Check, Star } from "lucide-react";

export const Route = createFileRoute("/ride-complete")({ component: RideComplete });

const tags = ["Fast", "Safe", "Friendly", "Professional", "Clean car", "On time"];

function RideComplete() {
  const nav = useNavigate();
  const [rating, setRating] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [tip, setTip] = useState(0);
  const [confetti, setConfetti] = useState<{ x: number; y: number; c: string; r: number }[]>([]);

  useEffect(() => {
    const colors = ["#7C3AED", "#A3E635", "#FF9900", "#9F67FF"];
    setConfetti(
      Array.from({ length: 60 }, () => ({
        x: Math.random() * 100,
        y: -10 - Math.random() * 30,
        c: colors[Math.floor(Math.random() * colors.length)],
        r: Math.random() * 360,
      })),
    );
  }, []);

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="relative flex-1 flex flex-col px-5 pt-2 pb-6 overflow-hidden">
        {confetti.map((c, i) => (
          <motion.div
            key={i}
            initial={{ y: `${c.y}vh`, x: `${c.x}vw`, opacity: 1, rotate: 0 }}
            animate={{ y: "110vh", rotate: c.r + 720 }}
            transition={{ duration: 2.4 + Math.random() * 1.5, ease: "easeIn" }}
            className="absolute w-2 h-3 rounded-sm pointer-events-none"
            style={{ backgroundColor: c.c }}
          />
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
          className="mx-auto mt-6 w-24 h-24 rounded-full bg-lime flex items-center justify-center shadow-[var(--shadow-glow-lime)]"
        >
          <Check className="w-12 h-12 text-base" strokeWidth={3.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-5"
        >
          <h1 className="font-display font-bold text-2xl">Ride complete</h1>
          <p className="font-display font-bold text-5xl mt-2 tabular-nums">
            ₹<CountUp to={445} duration={1.2} />
          </p>
          <p className="text-text-secondary text-sm mt-1">8.2 km · 24 min · Rahul</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <p className="text-center text-sm text-text-secondary mb-3">
            How was your ride?
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button
                key={n}
                whileTap={{ scale: 1.3 }}
                onClick={() => setRating(n)}
                className="p-1"
              >
                <Star
                  className={`w-9 h-9 transition-all ${
                    n <= rating
                      ? "text-warning fill-warning drop-shadow-[0_0_8px_oklch(0.78_0.18_65)]"
                      : "text-border"
                  }`}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {rating > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">
              What went well?
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => {
                const on = selected.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() =>
                      setSelected((s) => (on ? s.filter((x) => x !== t) : [...s, t]))
                    }
                    className={`px-3 h-9 rounded-full text-xs font-semibold transition-all ${
                      on
                        ? "bg-violet text-white"
                        : "bg-surface ring-1 ring-border text-text-secondary"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <p className="text-xs uppercase tracking-wider text-text-secondary mt-5 mb-2">
              Add a tip
            </p>
            <div className="flex gap-2">
              {[0, 20, 50, 100].map((t) => (
                <button
                  key={t}
                  onClick={() => setTip(t)}
                  className={`flex-1 h-11 rounded-2xl text-sm font-semibold transition-all ${
                    t === tip
                      ? "bg-lime text-base"
                      : "bg-surface ring-1 ring-border text-text-secondary"
                  }`}
                >
                  {t === 0 ? "No tip" : `₹${t}`}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <RippleButton
          size="lg"
          block
          className="mt-auto"
          onClick={() => nav({ to: "/home" })}
        >
          Done
        </RippleButton>
      </div>
    </PhoneFrame>
  );
}
