import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-14 h-14 rounded-2xl bg-surface ring-1 ring-border flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-text-secondary" />
      </div>
      <p className="font-display font-bold text-base">{title}</p>
      <p className="text-xs text-text-secondary mt-1 max-w-[240px]">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="p-4 rounded-2xl bg-surface ring-1 ring-border animate-pulse">
      <div className="h-3 w-20 bg-border rounded mb-3" />
      <div className="h-4 w-3/4 bg-border rounded mb-2" />
      <div className="h-3 w-1/2 bg-border rounded" />
    </div>
  );
}
