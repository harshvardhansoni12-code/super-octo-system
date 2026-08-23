"use client";

import { useState } from "react";
import { LogOut, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({ name, label }) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);
    await signOut({ callbackUrl: "/" });
  }

  return (
    <header className="flex items-center justify-between border-b border-[#dbe5dc] px-5 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-[#214a38] text-[#d6e7c9]">
          <Sparkles className="size-4" />
        </span>
        <div>
          <p className="text-sm font-bold tracking-[0.16em] text-[#214a38] uppercase">
            NEST
          </p>
          <p className="text-xs text-[#718078]">{label}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-[#526258] sm:block">{name}</span>
        <Button
          aria-label="Sign out"
          aria-busy={isSigningOut}
          className="text-[#526258]"
          disabled={isSigningOut}
          onClick={handleSignOut}
          size="icon"
          type="button"
          variant="ghost"
        >
          <LogOut />
        </Button>
      </div>
    </header>
  );
}
