"use client";

import { useRouter } from "next/navigation";
import SiteMenu from "@/components/SiteMenu";
import Image from "next/image";

export default function MainLandingPage() {
  const router = useRouter();

  return (
    <main className="dark-landing-page">
      <SiteMenu />

      <Image
        src="/Logo Gold.png"
        alt="App Logo"
        width={56}
        height={56}
        priority
        className="main-logo-top-right"
      />

      <div className="landing-shell">
        <button
          className="landing-action-card"
          onClick={() => router.push("/tp/profile-landing")}
        >
          Browse Our Thought Partners
        </button>

        <span className="landing-or-divider">Or</span>

        <button
          className="landing-action-card"
          onClick={() => router.push("/tp/setup-start")}
        >
          Find My Match for This Moment
        </button>
      </div>
    </main>
  );
}
