import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { EmptyState } from "@/components/dl/EmptyState";
import { ArrowLeft, Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

function Notifications() {
  const nav = useNavigate();
  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex-1 flex flex-col px-5 pt-2 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => nav({ to: "/profile" })}
            className="w-10 h-10 rounded-full bg-surface ring-1 ring-border flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-display font-bold text-xl">Notifications</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={Bell}
            title="You're all caught up"
            body="Ride updates and trip alerts will show up here."
          />
        </div>
      </div>
    </PhoneFrame>
  );
}
