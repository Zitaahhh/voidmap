"use client";

import { useEffect, useState } from "react";
import { AuthGate } from "@/components/AuthGate";
import { HeroScene } from "@/components/HeroScene";
import { explorerProfile, signals } from "@/data/signals";
import { getCurrentUser, type VoidMapUser } from "@/lib/auth";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<VoidMapUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setCurrentUser(getCurrentUser());
      setIsAuthReady(true);
    }, 0);

    return () => window.clearTimeout(handle);
  }, []);

  if (!isAuthReady) {
    return <main className="min-h-screen bg-[var(--vm-bg-void)]" />;
  }

  if (!currentUser) {
    return <AuthGate onAuthenticated={setCurrentUser} />;
  }

  return <HeroScene currentUser={currentUser} profile={explorerProfile} signals={signals} />;
}
