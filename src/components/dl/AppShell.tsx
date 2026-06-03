import type { ReactNode } from "react";
import { PhoneFrame, StatusBar } from "./PhoneFrame";
import { BottomNav } from "./BottomNav";
import { PageTransition } from "./PageTransition";

export function AppShell({
  children,
  hideNav,
  hideStatus,
}: {
  children: ReactNode;
  hideNav?: boolean;
  hideStatus?: boolean;
}) {
  return (
    <PhoneFrame>
      {!hideStatus && <StatusBar />}
      <PageTransition>
        <main className="flex-1 overflow-y-auto scrollbar-hide">{children}</main>
      </PageTransition>
      {!hideNav && <BottomNav />}
    </PhoneFrame>
  );
}
