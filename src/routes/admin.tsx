import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { CountUp } from "@/components/dl/CountUp";
import { EmptyState } from "@/components/dl/EmptyState";
import { adminStats } from "@/lib/rides.functions";
import { Users, Power, Car, IndianRupee, ShieldOff } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin console — DriverLink Pro" },
      { name: "description", content: "Live operations and platform stats for DriverLink Pro administrators." },
      { property: "og:title", content: "Admin console — DriverLink Pro" },
      { property: "og:description", content: "Live operations and platform stats for DriverLink Pro administrators." },
      { property: "og:url", content: "https://cosmic-drive-hub.lovable.app/admin" },
    ],
    links: [{ rel: "canonical", href: "https://cosmic-drive-hub.lovable.app/admin" }],
  }),
  component: Admin,
});

function Admin() {
  const nav = useNavigate();
  const stats = useServerFn(adminStats);
  const q = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => stats(),
    refetchInterval: 10_000,
    retry: false,
  });

  if (q.error) {
    return (
      <AppShell hideNav>
        <div className="flex-1 flex items-center justify-center px-5">
          <EmptyState
            icon={ShieldOff}
            title="Admin only"
            body="You don't have access to this dashboard."
            action={
              <button onClick={() => nav({ to: "/home" })} className="text-violet-light text-sm">
                Back to home
              </button>
            }
          />
        </div>
      </AppShell>
    );
  }

  const data = q.data;
  return (
    <AppShell hideNav>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-5 pt-2 pb-8 space-y-5"
      >
        <motion.h1 variants={fadeUp} className="font-display font-bold text-2xl">
          Admin
        </motion.h1>

        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
          <Card Icon={Users} label="Drivers" value={data?.drivers ?? 0} color="text-violet-light" />
          <Card Icon={Power} label="Online now" value={data?.online ?? 0} color="text-lime" />
          <Card Icon={Car} label="Active rides" value={data?.active ?? 0} color="text-warning" />
          <Card
            Icon={IndianRupee}
            label="Revenue today ₹"
            value={data?.revenueToday ?? 0}
            color="text-lime"
          />
        </motion.div>

        <motion.p variants={fadeUp} className="text-xs text-text-secondary text-center">
          Updates every 10 seconds · live from database
        </motion.p>
      </motion.div>
    </AppShell>
  );
}

function Card({
  Icon,
  label,
  value,
  color,
}: {
  Icon: typeof Users;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-surface ring-1 ring-border">
      <Icon className={`w-4 h-4 mb-2 ${color}`} />
      <p className="font-display font-bold text-2xl tabular-nums">
        <CountUp to={value} />
      </p>
      <p className="text-[11px] text-text-secondary">{label}</p>
    </div>
  );
}
