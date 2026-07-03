import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { Car, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to DriverLink Pro — DriverLink Pro" },
      { name: "description", content: "Discover on-demand drivers, live tracking, and AI trust scores." },
      { property: "og:title", content: "Welcome to DriverLink Pro — DriverLink Pro" },
      { property: "og:description", content: "Discover on-demand drivers, live tracking, and AI trust scores." },
      { property: "og:url", content: "https://cosmic-drive-hub.lovable.app/onboarding" },
    ],
    links: [{ rel: "canonical", href: "https://cosmic-drive-hub.lovable.app/onboarding" }],
  }),
  component: Onboarding,
});

const slides = [
  {
    icon: Car,
    title: "Drivers, on demand",
    body: "Hire a verified driver for your own car in under 5 minutes.",
    accent: "violet" as const,
  },
  {
    icon: ShieldCheck,
    title: "Trust, scored by AI",
    body: "Every driver gets a live trust score from driving behavior.",
    accent: "lime" as const,
  },
  {
    icon: Sparkles,
    title: "Fares predicted, never surprised",
    body: "AI tells you the fare before you book. No surge shocks.",
    accent: "violet" as const,
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const next = () => (i < slides.length - 1 ? setI(i + 1) : nav({ to: "/login" }));

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex-1 flex flex-col px-6">
        <button
          onClick={() => nav({ to: "/login" })}
          className="self-end text-text-secondary text-sm py-2"
        >
          Skip
        </button>

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, filter: "blur(6px)" }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center text-center"
            >
              {(() => {
                const S = slides[i];
                const Icon = S.icon;
                const ring =
                  S.accent === "violet"
                    ? "bg-violet/10 ring-violet/40 text-violet-light shadow-[var(--shadow-glow-violet)]"
                    : "bg-lime/10 ring-lime/40 text-lime shadow-[var(--shadow-glow-lime)]";
                return (
                  <>
                    <div
                      className={`w-44 h-44 rounded-[2.5rem] ring-1 ${ring} flex items-center justify-center mb-10`}
                    >
                      <Icon className="w-20 h-20" strokeWidth={1.5} />
                    </div>
                    <h2 className="font-display font-bold text-3xl leading-tight mb-3 max-w-[280px]">
                      {S.title}
                    </h2>
                    <p className="text-text-secondary max-w-[280px]">{S.body}</p>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, idx) => (
            <motion.span
              key={idx}
              animate={{
                width: idx === i ? 28 : 8,
                backgroundColor:
                  idx === i ? "oklch(0.65 0.25 295)" : "oklch(0.22 0.04 282)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        <RippleButton size="lg" block onClick={next} className="mb-8">
          {i < slides.length - 1 ? "Next" : "Get started"}
        </RippleButton>
      </div>
    </PhoneFrame>
  );
}
