"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import SiteMenu from "@/components/SiteMenu";

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
      <main className="min-h-screen flex items-center justify-center bg-[#4a4a58]">
        <div className="text-sm text-[#c2b280] opacity-80">
          Loading your space…
        </div>
      </main>
    );
  }

  const handleBrowse = () => {
    router.push("/tp/profile-landing"); // adjust if needed
  };

  const handleMatchMe = async () => {
    router.push("/match/landing-page");
  };

  return (
    <main className="tp-home">
      <div className="tp-home__topbar">
        <SiteMenu />
        <Image
          src="/Logo Gold.png"
          alt="Thought Partner Logo"
          width={48}
          height={48}
          priority
          className="main-logo-top-right"
        />
      </div>

      <div className="tp-home__content">
        <button type="button" onClick={handleBrowse} className="tp-home__card">
          <div className="tp-home__cardText tp-home__cardText--big">
            Browse Our<br />Thought Partners
          </div>
        </button>

        <div className="tp-home__divider">
          <div className="tp-home__line" />
          <div className="tp-home__or">Or</div>
          <div className="tp-home__line" />
        </div>

        <button
          type="button"
          onClick={handleMatchMe}
          disabled={loadingMatch}
          className="tp-home__card"
        >
          <div className="tp-home__cardText tp-home__cardText--med">
            {loadingMatch ? "Matching…" : "Find My Match for"}<br />
            {loadingMatch ? "This Moment…" : "This Moment"}
          </div>
        </button>
      </div>
    </main>
  );

}
