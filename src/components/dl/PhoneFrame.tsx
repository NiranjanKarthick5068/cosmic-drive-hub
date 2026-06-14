import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

export function StatusBar() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    setTime(fmt());
    const i = setInterval(() => setTime(fmt()), 30_000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[12px] font-medium text-text-primary/90 font-mono">
      <span suppressHydrationWarning>{time || "\u00A0"}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <BatteryFull className="w-4 h-4" />
      </div>
    </div>
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-[100dvh] bg-base/95 shadow-[0_0_120px_-20px_oklch(0.55_0.27_295/0.35)] flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
