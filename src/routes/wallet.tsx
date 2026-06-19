import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/dl/AppShell";
import { fadeUp, stagger } from "@/components/dl/PageTransition";
import { EmptyState } from "@/components/dl/EmptyState";
import { Wallet as WalletIcon } from "lucide-react";

export const Route = createFileRoute("/wallet")({ component: Wallet });

function Wallet() {
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

        <EmptyState
          icon={WalletIcon}
          title="Wallet coming soon"
          body="Top-ups, ride payments, and payouts will appear here once payments are enabled."
        />
      </motion.div>
    </AppShell>
  );
}
