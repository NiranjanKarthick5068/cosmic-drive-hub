import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { RippleButton } from "@/components/dl/RippleButton";
import { CountUp } from "@/components/dl/CountUp";
import { EmptyState, SkeletonRow } from "@/components/dl/EmptyState";
import { useProfile } from "@/hooks/use-session";
import { listMyRides } from "@/lib/rides.functions";
import {
  Sparkles,
  TrendingUp,
  Wallet,
  Star,
  ArrowRight,
  Zap,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const nav = useNavigate();
  const { profile, user, loading } = useProfile();
  const list = useServerFn(listMyRides);
  const rides = useQuery({
    queryKey: ["my-rides", user?.id],
    queryFn: () => list(),
    enabled: !!user,
    staleTime: 5_000,
  });

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName =
    profile?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    (loading ? "" : "Welcome");
  const initial = (firstName[0] || "?").toUpperCase();

  const all = rides.data?.rides ?? [];
  const completed = all.filter((r) => r.status === "completed");
  const totalSpent = completed.reduce(
    (s, r) => s + (r.fare_final ?? r.fare_estimate ?? 0),
    0,
  );

  return (
    <AppShell>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-5 pt-2 pb-8 space-y-6"
      >
        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div>
            <p className="text-text-secondary text-sm">{greet},</p>
            <h1 className="font-display font-bold text-2xl">{firstName || "—"}</h1>
          </div>
          <button
            onClick={() => nav({ to: "/profile" })}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-violet to-violet-light flex items-center justify-center font-display font-bold ring-2 ring-violet/40"
          >
            {initial}
          </button>
        </motion.div>

        <motion.div variants={fadeUp}>
          <button
            onClick={() => nav({ to: "/book" })}
            className="ripple-host relative w-full p-5 rounded-3xl bg-gradient-to-br from-violet via-violet to-violet-light text-white text-left overflow-hidden shadow-[var(--shadow-glow-violet)] active:scale-[0.99] transition"
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
                <Zap className="w-3.5 h-3.5" /> Quick book
              </div>
              <p className="font-display font-bold text-2xl mt-1 leading-tight">
                Find a driver
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm font-semibold">
                Book now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
          <Stat Icon={TrendingUp} label="Trips" value={completed.length} color="text-violet-light" />
          <Stat Icon={Wallet} label="Spent ₹" value={totalSpent} color="text-lime" />
          <Stat Icon={Star} label="Rating" value={profile?.rating ?? 5} color="text-warning" decimal />
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-lime/10 to-transparent ring-1 ring-lime/30">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-lime" />
              <span className="text-xs uppercase tracking-wider text-lime font-semibold">
                AI assistant
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Tap <span className="text-lime font-semibold">Book now</span> and I'll
              estimate a fair fare and find you a nearby driver in seconds.
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold">Recent rides</h3>
            <button
              onClick={() => nav({ to: "/bookings" })}
              className="text-xs text-violet-light"
            >
              See all
            </button>
          </div>
          {rides.isLoading ? (
            <div className="space-y-2">
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : all.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No rides yet"
              body="Your trip history will show here after your first ride."
            />
          ) : (
            <div className="space-y-2">
              {all.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-2xl bg-surface ring-1 ring-border flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet/15 text-violet-light flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {r.pickup} → {r.drop_loc}
                    </p>
                    <p className="text-xs text-text-secondary capitalize">
                      {new Date(r.created_at).toLocaleDateString()} · {r.status}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold">
                    ₹{r.fare_final ?? r.fare_estimate ?? 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <RippleButton
          variant="ghost"
          block
          size="md"
          onClick={() => nav({ to: "/role" })}
        >
          Switch to driver mode
        </RippleButton>
      </motion.div>
    </AppShell>
  );
}

function Stat({
  Icon,
  label,
  value,
  color,
  decimal,
}: {
  Icon: typeof TrendingUp;
  label: string;
  value: number;
  color: string;
  decimal?: boolean;
}) {
  return (
    <div className="p-3 rounded-2xl bg-surface ring-1 ring-border">
      <Icon className={`w-4 h-4 mb-2 ${color}`} />
      <p className="font-display font-bold text-lg tabular-nums">
        {decimal ? value.toFixed(1) : <CountUp to={value} />}
      </p>
      <p className="text-[11px] text-text-secondary">{label}</p>
    </div>
  );
}
