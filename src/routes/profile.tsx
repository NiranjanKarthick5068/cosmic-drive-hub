import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { RippleButton } from "@/components/dl/RippleButton";
import { useProfile } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import {
  Bell,
  Crown,
  Headphones,
  LogOut,
  ShieldCheck,
  Star,
  ChevronRight,
  Settings,
} from "lucide-react";

export const Route = createFileRoute("/profile")({ component: Profile });

const rows = [
  { Icon: Crown, label: "Subscription", to: "/subscription", color: "text-warning" },
  { Icon: Bell, label: "Notifications", to: "/notifications", color: "text-violet-light" },
  { Icon: ShieldCheck, label: "Safety & emergency", to: "/profile", color: "text-lime" },
  { Icon: Headphones, label: "Help & support", to: "/profile", color: "text-violet-light" },
  { Icon: Settings, label: "Settings", to: "/profile", color: "text-text-secondary" },
] as const;

function Profile() {
  const nav = useNavigate();
  const { profile, user } = useProfile();
  const name = profile?.name ?? user?.email?.split("@")[0] ?? "—";
  const initial = (name[0] || "?").toUpperCase();

  const signOut = async () => {
    await supabase.auth.signOut();
    nav({ to: "/login" });
  };

  return (
    <AppShell>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-5 pt-2 pb-8 space-y-5"
      >
        <motion.h1 variants={fadeUp} className="font-display font-bold text-2xl">
          Profile
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-gradient-to-br from-surface to-base ring-1 ring-border flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet to-violet-light flex items-center justify-center font-display font-bold text-2xl ring-2 ring-violet/40">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-lg truncate">{name}</p>
            <p className="text-xs text-text-secondary font-mono truncate">
              {profile?.phone ?? user?.email ?? "—"}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-warning fill-warning" />
              <span className="text-xs font-mono">
                {(profile?.rating ?? 5).toFixed(1)}
              </span>
              <span className="text-xs text-text-secondary">
                · {profile?.total_trips ?? 0} trips
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-surface ring-1 ring-border overflow-hidden"
        >
          {rows.map((r, i) => (
            <button
              key={r.label}
              onClick={() => nav({ to: r.to })}
              className={`w-full px-4 py-3.5 flex items-center gap-3 active:bg-surface-high transition ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <r.Icon className={`w-5 h-5 ${r.color}`} />
              <span className="flex-1 text-left text-sm font-medium">{r.label}</span>
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </button>
          ))}
        </motion.div>

        <motion.div variants={fadeUp}>
          <RippleButton variant="ghost" size="lg" block onClick={signOut}>
            <LogOut className="w-4 h-4" /> Sign out
          </RippleButton>
        </motion.div>

        <motion.p variants={fadeUp} className="text-center text-xs text-text-secondary">
          DriverLink Pro · v1.0.0
        </motion.p>
      </motion.div>
    </AppShell>
  );
}
