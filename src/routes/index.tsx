import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/dl/PhoneFrame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DriverLink Pro" },
      {
        name: "description",
        content: "On-demand drivers for your own car — book, track and pay in seconds.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav({ to: "/onboarding" }), 2400);
    return () => clearTimeout(t);
  }, [nav]);

  const letters = "DRIVERLINK".split("");

  return (
    <PhoneFrame>
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
        {/* radial pulse */}
        <motion.div
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-40 h-40 rounded-full bg-violet/20"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
          className="absolute w-40 h-40 rounded-full bg-lime/15"
        />

        {/* Logo mark */}
        <motion.svg
          width="92"
          height="92"
          viewBox="0 0 92 92"
          className="relative z-10 mb-8"
        >
          <motion.circle
            cx="46"
            cy="46"
            r="38"
            stroke="oklch(0.65 0.25 295)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="240"
            initial={{ strokeDashoffset: 240 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <motion.path
            d="M30 46 L42 58 L64 34"
            stroke="oklch(0.86 0.21 130)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="60"
            initial={{ strokeDashoffset: 60 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          />
        </motion.svg>

        {/* Wordmark */}
        <div className="relative z-10 flex items-center gap-2">
          <h1 className="font-display font-extrabold text-3xl tracking-tight flex">
            {letters.map((l, i) => (
              <motion.span
                key={i}
                initial={{ y: 20, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.4 + i * 0.04, duration: 0.5 }}
              >
                {l}
              </motion.span>
            ))}
          </h1>
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 400, damping: 14 }}
            className="ml-1 px-2 py-0.5 rounded-md bg-lime text-base text-[10px] font-bold tracking-wider"
          >
            PRO
          </motion.span>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="relative z-10 mt-3 text-text-secondary text-sm"
        >
          Your car. Their hands. Pure trust.
        </motion.p>
      </div>
    </PhoneFrame>
  );
}
