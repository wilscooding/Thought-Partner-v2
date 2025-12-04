"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Later: check auth; for now just go to /home
    router.replace("/home");
  }, [router]);

  return (
    <main className="h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="text-xl font-semibold">Thought Partner</div>
        <div className="text-sm text-gray-400">Loading your thinking space…</div>
      </div>
    </main>
  );
}
