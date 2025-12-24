"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import SiteMenu from "@/components/SiteMenu";
import { useEffect, useMemo, useState } from "react";

// Phone Icon SVG
const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="connect-phone-icon"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-4.71-4.71 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.74A14.28 14.28 0 0 0 9.87 7.7a2 2 0 0 1-.33 2.13l-1.9 1.9a15.4 15.4 0 0 0 6.55 6.55l1.9-1.9a2 2 0 0 1 2.13-.33 14.28 14.28 0 0 0 3.96 1.63 2 2 0 0 1 1.74 2z" />
  </svg>
);

// Long-tail back arrow (bottom left)
const BottomBackArrowIcon = () => (
  <svg
    viewBox="0 0 40 24"
    className="tp-detail-back-icon"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="36" y1="12" x2="8" y2="12" />
    <polyline points="14 8 8 12 14 16" />
  </svg>
);

type AvatarDTO = {
  id: string;
  name: string;
  systemPrompt?: string | null;

  // Optional fields depending on your schema/API
  profileBlurb?: string | null;
  bestUsedWhen?: string[] | null; // if stored as JSON array
  lastConnectedDate?: string | null;

  // image
  photoKey?: string | null; // e.g. "Denise Okoro.webp"
  imagePath?: string | null; // if your API returns an absolute/relative path
};

export default function SelectedTPProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Expect: /tp/selected-tp?avatarId=denise_okoro
  const avatarId = searchParams.get("avatarId") ?? "denise_okoro";

  const [avatar, setAvatar] = useState<AvatarDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/avatars/${encodeURIComponent(avatarId)}`, {
          method: "GET",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error ?? "Failed to load Thought Partner");
        }

        if (alive) setAvatar(data);
      } catch (e: any) {
        if (alive) {
          setAvatar(null);
          setError(e?.message ?? "Failed to load Thought Partner");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [avatarId]);

  const imageSrc = useMemo(() => {
    // Prefer API-provided imagePath, then photoKey, then fallback
    const name = (avatar?.name ?? "").trim();
    if (name) return `/${name}.webp`;
    return "/Denise Okoro.webp";
  }, [avatar]);

  const bestUsedWhen = useMemo(() => {
    // Normalize to array
    if (Array.isArray(avatar?.bestUsedWhen)) return avatar?.bestUsedWhen ?? [];
    return [];
  }, [avatar]);

  const isPreviouslyConnected = !!avatar?.lastConnectedDate;

  if (loading) {
    return (
      <main className="dark-landing-page tp-detail-page">
        <SiteMenu />
        <Image
          src="/Logo Gold.png"
          alt="App Logo"
          width={56}
          height={56}
          priority
          className="main-logo-top-right"
        />
        <div className="tp-detail-shell">Loading...</div>
      </main>
    );
  }

  if (error || !avatar) {
    return (
      <main className="dark-landing-page tp-detail-page">
        <SiteMenu />
        <Image
          src="/Logo Gold.png"
          alt="App Logo"
          width={56}
          height={56}
          priority
          className="main-logo-top-right"
        />
        <div className="tp-detail-shell">
          <p>{error ?? "Partner not found."}</p>
          <button
            type="button"
            className="tp-detail-back-btn"
            onClick={() => router.push("/tp/profile-landing")}
          >
            Back to profiles
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dark-landing-page tp-detail-page">
      <SiteMenu />

      <Image
        src="/Logo Gold.png"
        alt="App Logo"
        width={56}
        height={56}
        priority
        className="main-logo-top-right"
      />

      <div className="tp-detail-shell">
        <div className="tp-detail-header-row">
          <div className="tp-detail-image-wrapper">
            <Image
              src={imageSrc}
              alt={`Profile picture of ${avatar.name}`}
              width={80}
              height={80}
              className="tp-detail-image"
              priority
            />
          </div>
          <h1 className="tp-detail-name">{avatar.name}</h1>
        </div>

        {avatar.profileBlurb && (
          <p className="tp-detail-description">{avatar.profileBlurb}</p>
        )}

        {bestUsedWhen.length > 0 && (
          <>
            <h2 className="tp-detail-use-header">Best to use when you’re…</h2>
            <ul className="tp-detail-use-list">
              {bestUsedWhen.map((useCase, index) => (
                <li key={index} className="tp-detail-use-item">
                  {useCase}
                </li>
              ))}
            </ul>
          </>
        )}

        {isPreviouslyConnected && (
          <div className="tp-detail-previous-section">
            <div className="tp-detail-divider" />
            <span className="tp-previous-status">Previously Connected</span>
            <span className="tp-previous-date">
              Last Conversation: {avatar.lastConnectedDate}
            </span>
          </div>
        )}
      </div>

      <div className="tp-detail-bottom-nav">
        <button
          type="button"
          className="tp-detail-back-btn"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <BottomBackArrowIcon />
        </button>

        <button
          type="button"
          className="tp-detail-connect-btn"
          onClick={() =>
            router.push(
              `/tp/setup-start?avatarId=${encodeURIComponent(avatar.id)}`
            )
          }
          aria-label={`Connect with ${avatar.name}`}
        >
          <div className="tp-connect-icon-circle">
            <PhoneIcon />
          </div>
        </button>
      </div>
    </main>
  );
}
