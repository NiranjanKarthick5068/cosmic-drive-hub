import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { Car, UserRoundCog } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { setRole as setRoleFn } from "@/lib/rides.functions";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/role")({ component: Role });

function Card({
  title, desc, accent, Icon, onClick, delay, disabled,
}: {
  title: string; desc: string; accent: "violet" | "lime";
  Icon: typeof Car; onClick: () => void; delay: number; disabled?: boolean;
}) {
  const isLime = accent === "lime";
  return (
    <motion.button
      initial={{ y: 60, opacity: 0, filter: "blur(8px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative text-left p-6 rounded-3xl overflow-hidden ring-1 disabled:opacity-50 ${
        isLime
          ? "bg-gradient-to-br from-lime/20 via-surface to-surface ring-lime/30 shadow-[var(--shadow-glow-lime)]"
          : "bg-gradient-to-br from-violet/25 via-surface to-surface ring-violet/40 shadow-[var(--shadow-glow-violet)]"
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
        isLime ? "bg-lime text-base" : "bg-violet text-white"
      }`}>
        <Icon className="w-7 h-7" strokeWidth={2.2} />
      </div>
      <h3 className="font-display font-bold text-2xl mb-1">{title}</h3>
      <p className="text-sm text-text-secondary leading-snug">{desc}</p>
    </motion.button>
  );
}

function Role() {
  const nav = useNavigate();
  const setRole = useServerFn(setRoleFn);
  const [pending, setPending] = useState<"owner" | "driver" | null>(null);

  const pick = async (role: "owner" | "driver") => {
    setPending(role);
    try {
      await setRole({ data: { role } });
      nav({ to: role === "owner" ? "/home" : "/driver-home" });
    } catch (e) {
      setPending(null);
      toast.error(e instanceof Error ? e.message : "Could not save role");
    }
  };

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex-1 flex flex-col px-6 pt-8 pb-10">
        <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl leading-tight">
            How are you using <br />
            <span className="text-gradient-violet">DriverLink?</span>
          </h1>
          <p className="text-text-secondary mt-2">Pick one — you can switch later.</p>
        </motion.div>

        <div className="flex flex-col gap-5">
          <Card title="I own a car"
            desc="Hire a verified driver for your own vehicle, on demand or scheduled."
            accent="violet" Icon={Car}
            onClick={() => pick("owner")} delay={0.05}
            disabled={pending !== null} />
          <Card title="I drive cars"
            desc="Earn by driving other people's cars. Set your hours, build your trust score."
            accent="lime" Icon={UserRoundCog}
            onClick={() => pick("driver")} delay={0.18}
            disabled={pending !== null} />
        </div>
      </div>
    </PhoneFrame>
  );
}
