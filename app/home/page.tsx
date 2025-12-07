"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [loadingMatch, setLoadingMatch] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || (!user && typeof window !== "undefined")) {
    return (
      <main className="h-screen flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading your space…</div>
      </main>
    );
  }

  const handleMatchMe = async () => {
    setLoadingMatch(true);
    try {
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "Test topic",
          feeling: "curious",
          desiredOutcome: "Just testing the flow",
        }),
      });
      const data = await res.json();
      console.log("Session start result:", data);
      alert(`Matched avatar: ${data.avatar?.name ?? "placeholder"}`);
    } catch (err) {
      console.error(err);
      alert("Error starting session (stub).");
    } finally {
      setLoadingMatch(false);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center px-6 gap-6 text-center">
      <h1 className="text-2xl font-semibold">Your Thinking Space</h1>
      <p className="text-sm text-gray-400">
        Choose how you want to start.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-3 mt-4">
        <button className="py-3 rounded-xl border border-gray-700">
          Browse Thought Partners
        </button>

        <button
          onClick={handleMatchMe}
          disabled={loadingMatch}
          className="py-3 rounded-xl bg-white text-black font-medium disabled:opacity-60"
        >
          {loadingMatch ? "Matching…" : "Match Me for This Moment"}
        </button>
      </div>
    </main>
  );
}
