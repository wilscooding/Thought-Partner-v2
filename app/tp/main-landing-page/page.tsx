"use client";

import { useRouter } from "next/navigation";
import SiteMenu from "@/components/SiteMenu";
import Image from "next/image";

export default function MainLandingPage() {
  const router = useRouter();

  return (
    <main className="dark-landing-page">
      {/* 1. Reusable Site Menu */}
      <SiteMenu />

      {/* 2. Small Logo (Top-Right) */}
      <Image
        src="/Logo Gold.png"
        alt="App Logo"
        width={56}
        height={56}
        priority={true}
        className="main-logo-top-right"
      />

      {/* 3. Main Content */}
      <div className="landing-shell">
        <button
          className="landing-action-card"
          onClick={() => router.push("/partners")}
        >
          Browse Our Thought Partners
        </button>

        <span className="landing-or-divider">Or</span>

        <button
          className="landing-action-card"
          onClick={() => router.push("/match-intro")}
        >
          Find My Match for This Moment
        </button>
      </div>
    </main>
  );
}
