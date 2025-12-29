"use client";

import SiteMenu from "@/components/SiteMenu";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react"; // Added Suspense

// 1. Internal Content Component
function SessionSetupStartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ chosen TP flow uses this
  const avatarId = searchParams.get("avatarId");

  const handleBeginClick = () => {
    // ✅ If avatarId exists, preserve it into the setup page
    if (avatarId) {
      router.push(`/match/setup-page?avatarId=${encodeURIComponent(avatarId)}`);
      return;
    }

    // fallback: normal match flow
    router.push("/match/setup-page");
  };

  const handleBrowseProfilesClick = () => {
    router.push("/tp/profile-landing");
  };

  return (
    <div className="session-setup-shell">
      <h1 className="session-setup-title">
        Let me get things set up
        <br />
        for your session.
      </h1>

      <p className="session-setup-subtitle">
        Just a few quick questions so I can pass along what you’re hoping to
        cover today.
      </p>

      <button className="session-setup-primary-btn" onClick={handleBeginClick}>
        Begin
      </button>

      <button
        className="session-setup-secondary-btn"
        onClick={handleBrowseProfilesClick}
      >
        Browse Profiles
      </button>
    </div>
  );
}

// 2. Exported Page Wrapper
export default function SessionSetupStartPage() {
  return (
    <main className="light-bg-page">
      <SiteMenu burgerColor="#2f2b25" />
      <Image
        src="/Logo Dark.png"
        alt="Thought Partner Logo"
        width={56}
        height={56}
        priority
        className="main-logo-top-right"
      />

      <Suspense fallback={
        <div className="session-setup-shell">
          <h1 className="session-setup-title">Loading...</h1>
        </div>
      }>
        <SessionSetupStartContent />
      </Suspense>
    </main>
  );
}