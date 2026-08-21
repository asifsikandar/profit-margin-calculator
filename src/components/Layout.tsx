import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AdSlot } from "./AdSlot";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-graybg">
      <Header />
      <div className="mx-auto w-full max-w-6xl px-4 pt-4">
        <AdSlot format="leaderboard" />
      </div>
      <main className="flex-1">{children}</main>
      <div className="mx-auto w-full max-w-6xl px-4 pb-8">
        <AdSlot format="leaderboard" />
      </div>
      <Footer />
    </div>
  );
}

