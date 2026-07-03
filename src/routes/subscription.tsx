import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { EmptyState } from "@/components/dl/EmptyState";
import { ArrowLeft, Crown } from "lucide-react";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "Subscription plans — DriverLink Pro" },
      { name: "description", content: "Upgrade your DriverLink Pro plan for priority drivers and lower fares." },
      { property: "og:title", content: "Subscription plans — DriverLink Pro" },
      { property: "og:description", content: "Upgrade your DriverLink Pro plan for priority drivers and lower fares." },
      { property: "og:url", content: "https://cosmic-drive-hub.lovable.app/subscription" },
    ],
    links: [{ rel: "canonical", href: "https://cosmic-drive-hub.lovable.app/subscription" }],
  }),
  component: Sub,
});

function Sub() {
  const nav = useNavigate();
  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex-1 flex flex-col px-5 pt-2 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => nav({ to: "/profile" })}
            className="w-10 h-10 rounded-full bg-surface ring-1 ring-border flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-display font-bold text-xl">Lock a driver</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={Crown}
            title="Subscriptions coming soon"
            body="Lock the same trusted driver for every ride. We'll enable plans after payments are live."
          />
        </div>
      </div>
    </PhoneFrame>
  );
}
