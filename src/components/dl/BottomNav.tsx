import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, ClipboardList, Wallet, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/book", label: "Search", icon: Search },
  { to: "/bookings", label: "Trips", icon: ClipboardList },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { location } = useRouterState();
  const active = tabs.findIndex((t) => location.pathname.startsWith(t.to));

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 glass border-t border-border/70 pb-[env(safe-area-inset-bottom)]">
      <div className="relative grid grid-cols-5 h-[72px] px-2">
        {tabs.map((t, i) => {
          const Icon = t.icon;
          const isActive = i === active;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute top-1.5 w-12 h-12 rounded-2xl bg-violet/20 ring-1 ring-violet/40"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.08 : 1, y: isActive ? -2 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="relative z-10"
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-violet-light" : "text-text-secondary"
                  }`}
                  strokeWidth={isActive ? 2.4 : 2}
                />
              </motion.div>
              <span
                className={`relative z-10 transition-colors ${
                  isActive ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
