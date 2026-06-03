import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { RippleButton } from "@/components/dl/RippleButton";
import { CountUp } from "@/components/dl/CountUp";
import { mockTransactions } from "@/lib/mock";
import { Plus, Car, RotateCcw, Star, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/wallet")({ component: Wallet });

const iconMap = { car: Car, plus: ArrowDownLeft, star: Star, rotate: RotateCcw };

function Wallet() {
  const nav = useNavigate();
  return (
    <AppShell>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-5 pt-2 pb-8 space-y-5"
      >
        <motion.h1 variants={fadeUp} className="font-display font-bold text-2xl">
          Wallet
        </motion.h1>

        {/* balance */}
        <motion.div
          variants={fadeUp}
          className="relative p-6 rounded-3xl bg-gradient-to-br from-violet via-violet-light to-lime overflow-hidden text-white"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
          <p className="text-xs uppercase tracking-wider opacity-90">Balance</p>
          <p className="font-display font-bold text-5xl tabular-nums mt-1">
            ₹<CountUp to={2580} duration={1.2} />
          </p>
          <p className="text-xs opacity-90 mt-2">DriverLink Pro Wallet</p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
          <RippleButton variant="lime" size="lg">
            <Plus className="w-4 h-4" /> Add money
          </RippleButton>
          <RippleButton variant="outline" size="lg">
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </RippleButton>
        </motion.div>

        <motion.div variants={fadeUp}>
          <p className="font-display font-bold mb-3">Recent activity</p>
          <div className="space-y-2">
            {mockTransactions.map((t) => {
              const Icon = iconMap[t.icon as keyof typeof iconMap] || Car;
              const positive = t.amount > 0;
              return (
                <div
                  key={t.id}
                  className="p-3 rounded-2xl bg-surface ring-1 ring-border flex items-center gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      positive ? "bg-lime/15 text-lime" : "bg-violet/15 text-violet-light"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{t.type}</p>
                    <p className="text-xs text-text-secondary">{t.date}</p>
                  </div>
                  <span
                    className={`font-mono font-semibold ${
                      positive ? "text-lime" : "text-text-primary"
                    }`}
                  >
                    {positive ? "+" : ""}₹{Math.abs(t.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <RippleButton
          variant="ghost"
          size="md"
          block
          onClick={() => nav({ to: "/subscription" })}
        >
          Manage subscription
        </RippleButton>
      </motion.div>
    </AppShell>
  );
}
