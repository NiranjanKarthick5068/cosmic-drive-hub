import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { mockRides } from "@/lib/mock";
import { MapPin, Star } from "lucide-react";

export const Route = createFileRoute("/bookings")({ component: Bookings });

function Bookings() {
  return (
    <AppShell>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-5 pt-2 pb-8 space-y-4"
      >
        <motion.h1 variants={fadeUp} className="font-display font-bold text-2xl">
          Your trips
        </motion.h1>

        <motion.div variants={fadeUp} className="flex gap-2">
          {["All", "Completed", "Cancelled", "Scheduled"].map((t, i) => (
            <button
              key={t}
              className={`px-4 h-9 rounded-full text-xs font-semibold ${
                i === 0
                  ? "bg-violet text-white"
                  : "bg-surface ring-1 ring-border text-text-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </motion.div>

        <div className="space-y-3">
          {[...mockRides, ...mockRides].map((r, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-4 rounded-2xl bg-surface ring-1 ring-border"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-secondary">{r.date} · 9:42 AM</span>
                <span className="font-mono font-semibold">₹{r.fare}</span>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2 h-2 rounded-full bg-violet" />
                  <div className="w-px h-6 bg-border my-1" />
                  <div className="w-2 h-2 rounded-sm bg-lime" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.from}</p>
                  <div className="h-5" />
                  <p className="text-sm font-medium truncate">{r.to}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <div className="w-7 h-7 rounded-full bg-violet/30 flex items-center justify-center text-[10px] font-bold">
                  {r.driver
                    .split(" ")
                    .map((s) => s[0])
                    .join("")}
                </div>
                <span className="text-xs flex-1">{r.driver}</span>
                <Star className="w-3 h-3 text-warning fill-warning" />
                <span className="text-xs font-mono">4.9</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppShell>
  );
}
