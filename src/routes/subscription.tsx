import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { RippleButton } from "@/components/dl/RippleButton";
import { subscriptionPlans } from "@/lib/mock";
import { ArrowLeft, Check, Crown } from "lucide-react";

export const Route = createFileRoute("/subscription")({ component: Sub });

function Sub() {
  const nav = useNavigate();
  const [selected, setSelected] = useState("weekly");
  const plan = subscriptionPlans.find((p) => p.id === selected)!;

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex-1 flex flex-col px-5 pt-2 pb-6 overflow-y-auto scrollbar-hide">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => nav({ to: "/profile" })}
            className="w-10 h-10 rounded-full bg-surface ring-1 ring-border flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-display font-bold text-xl">Lock a driver</h1>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-warning/15 to-transparent ring-1 ring-warning/30 mb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <Crown className="w-4 h-4 text-warning" />
            <span className="text-xs uppercase tracking-wider font-bold text-warning">
              Why subscribe?
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Lock the <span className="font-semibold">same trusted driver</span> for
            every ride. Better trust, faster pickups, deeper discounts.
          </p>
        </div>

        <div className="space-y-3 mb-5">
          {subscriptionPlans.map((p) => {
            const on = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`relative w-full text-left p-4 rounded-2xl transition-all ${
                  on
                    ? "bg-gradient-to-br from-violet/20 to-surface ring-2 ring-violet shadow-[var(--shadow-glow-violet)]"
                    : "bg-surface ring-1 ring-border"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-md bg-lime text-base text-[10px] font-bold tracking-wider">
                    POPULAR
                  </span>
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-bold text-lg">{p.name}</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={p.id + p.price}
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      className="font-display font-bold text-xl tabular-nums"
                    >
                      ₹{p.price}
                      <span className="text-xs text-text-secondary font-body font-normal">
                        /{p.period}
                      </span>
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="space-y-1 mt-2">
                  {p.perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-2 text-xs">
                      <Check
                        className={`w-3.5 h-3.5 ${on ? "text-lime" : "text-text-secondary"}`}
                      />
                      <span
                        className={on ? "text-text-primary" : "text-text-secondary"}
                      >
                        {perk}
                      </span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <RippleButton size="lg" block className="mt-auto">
          Subscribe · ₹{plan.price}/{plan.period}
        </RippleButton>
        <p className="text-center text-[10px] text-text-secondary mt-3">
          Cancel anytime · No hidden fees
        </p>
      </div>
    </PhoneFrame>
  );
}
