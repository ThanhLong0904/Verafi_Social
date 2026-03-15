import type { ReactNode } from "react";
import LeftSidebar from "@/components/layout/LeftSidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar with built-in mobile nav */}
      <LeftSidebar />

      {/* Main content with left padding on desktop */}
      <div className="lg:pl-[72px] min-h-screen">
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      </div>
    </div>
  );
}
