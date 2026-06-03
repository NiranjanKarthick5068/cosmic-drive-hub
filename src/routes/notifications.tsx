import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame, StatusBar } from "@/components/dl/PhoneFrame";
import { mockNotifications } from "@/lib/mock";
import { ArrowLeft, Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: Notifications });

function Notifications() {
  const nav = useNavigate();
  const [items, setItems] = useState(mockNotifications);
  const grouped = items.reduce(
    (acc, n) => {
      (acc[n.group] = acc[n.group] || []).push(n);
      return acc;
    },
    {} as Record<string, typeof items>,
  );

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

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Bell className="w-12 h-12 text-text-secondary mb-4" />
            <p className="text-text-secondary">You're all caught up</p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([group, list]) => (
              <div key={group}>
                <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">
                  {group}
                </p>
                <div className="space-y-2">
                  <AnimatePresence>
                    {list.map((n) => (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 200, height: 0, marginTop: 0 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(_, info) => {
                          if (Math.abs(info.offset.x) > 100)
                            setItems((s) => s.filter((i) => i.id !== n.id));
                        }}
                        className="p-3 rounded-2xl bg-surface ring-1 ring-border flex items-start gap-3 cursor-grab active:cursor-grabbing"
                      >
                        {n.unread && (
                          <div className="w-2 h-2 rounded-full bg-violet mt-2 shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{n.title}</p>
                            <span className="text-[10px] text-text-secondary font-mono">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5">{n.body}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
            <p className="text-center text-[10px] text-text-secondary">
              Swipe to dismiss
            </p>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
