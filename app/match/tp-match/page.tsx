"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SiteMenu from "@/components/SiteMenu";

type AvatarDTO = {
    id: string;
    name: string;
    archetype?: string | null;

    // match selected-tp fields
    profileBlurb?: string | null;
    bestUsedWhen?: string[] | null;
    lastConnectedDate?: string | null;

    // image
    photoKey?: string | null;
    imagePath?: string | null;
};

export default function TPMatchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sessionId = searchParams.get("sessionId");
    const avatarId = searchParams.get("avatarId");

    const [avatar, setAvatar] = useState<AvatarDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId || !avatarId) {
            router.replace("/match/landing-page");
            return;
        }

        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`/api/avatars/${encodeURIComponent(avatarId)}`, {
                    method: "GET",
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data?.error ?? "Failed to load Thought Partner");

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
    }, [sessionId, avatarId, router]);

    // same image rule as selected-tp: name-based fallback
    const imageSrc = useMemo(() => {
        if (avatar?.imagePath) return avatar.imagePath;
        const name = (avatar?.name ?? "").trim();
        if (name) return `/${name}.webp`;
        return "/Denise Okoro.webp";
    }, [avatar]);

    const bestUsedWhen = useMemo(() => {
        if (Array.isArray(avatar?.bestUsedWhen)) return avatar?.bestUsedWhen ?? [];
        return [];
    }, [avatar]);

    const isPreviouslyConnected = !!avatar?.lastConnectedDate;

    const onMakeCall = () => {
        if (!sessionId || !avatarId || !avatar?.name) return;

        router.push(
            `/tp/dialing-tp?sessionId=${encodeURIComponent(sessionId)}&avatarId=${encodeURIComponent(
                avatarId
            )}&avatarName=${encodeURIComponent(avatar.name)}`
        );
    };

    const onNewMatch = () => {
        router.push("/match/landing-page");
    };

    if (loading) {
        return (
            <main className="light-bg-page partner-match-beige">
                <SiteMenu burgerColor="#2f2b25" />
                <Image
                    src="/Logo Dark.png"
                    alt="App Logo"
                    width={56}
                    height={56}
                    priority
                    className="up-logo-top-right"
                />

                <div className="match-beige-shell">
                    <header className="match-beige-header">
                        <h1 className="match-beige-title">Here&apos;s who I&apos;ve matched you with for this session.</h1>
                        <p className="match-beige-subtitle">Matching you now...</p>
                    </header>
                </div>
            </main>
        );
    }

    if (error || !avatar) {
        return (
            <main className="light-bg-page partner-match-beige">
                <SiteMenu burgerColor="#2f2b25" />
                <Image
                    src="/Logo Dark.png"
                    alt="App Logo"
                    width={56}
                    height={56}
                    priority
                    className="up-logo-top-right"
                />

                <div className="match-beige-shell">
                    <header className="match-beige-header">
                        <h1 className="match-beige-title">Something went wrong.</h1>
                        <p className="match-beige-subtitle">{error ?? "Partner not found."}</p>
                    </header>

                    <div className="match-beige-actions">
                        <button className="match-beige-new-link-v2" onClick={onNewMatch}>
                            <span className="arrow-left">←</span> Back to Match
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="light-bg-page partner-match-beige">
            <SiteMenu burgerColor="#2f2b25" />

            <Image
                src="/Logo Dark.png"
                alt="App Logo"
                width={56}
                height={56}
                priority
                className="up-logo-top-right"
            />

            <div className="match-beige-shell">
                <header className="match-beige-header">
                    <h1 className="match-beige-title">Here&apos;s who I&apos;ve matched you with for this session.</h1>
                    <p className="match-beige-subtitle">
                        Based on what you shared, this Thought Partner is a strong fit for what you need right now.
                    </p>
                </header>

                <section className="match-beige-bio-section">
                    <div className="match-history-divider" />

                    {/* same photo + name row */}
                    <div className="match-partner-header-row">
                        <div className="match-avatar-wrapper">
                            <Image
                                src={imageSrc}
                                alt={`Profile picture of ${avatar.name}`}
                                width={80}
                                height={80}
                                className="match-avatar-img"
                                priority
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <h2 className="match-partner-name">{avatar.name}</h2>

                        </div>
                    </div>

                    {/* same as selected-tp: profile blurb */}
                    {avatar.profileBlurb && (
                        <p className="match-partner-bio">{avatar.profileBlurb}</p>
                    )}
                </section>

                {/* same as selected-tp: best used when */}
                {bestUsedWhen.length > 0 && (
                    <section className="match-beige-use-cases">
                        <h3 className="match-use-case-title">Best to use when you&apos;re...</h3>
                        <ul className="match-use-case-list">
                            {bestUsedWhen.map((useCase, index) => (
                                <li key={index}>{useCase}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* same as selected-tp: previously connected */}
                {isPreviouslyConnected && (
                    <footer className="match-beige-history">
                        <div className="match-history-divider" />
                        <span className="match-history-label">Previously Connected</span>
                        <span className="match-history-date">
                            Last Conversation: {avatar.lastConnectedDate}
                        </span>
                    </footer>
                )}

                <div className="match-beige-actions">
                    <button className="match-beige-call-btn-v2" onClick={onMakeCall}>
                        <div className="match-call-icon-circle-v2">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="match-call-icon-v2">
                                <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.72 11.72 0 003.7.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.7 1 1 0 01-.27 1.11l-2.2 2.2z" />
                            </svg>
                        </div>
                        Make the Call
                    </button>

                    <button className="match-beige-new-link-v2" onClick={onNewMatch}>
                        <span className="arrow-left">←</span> New Match
                    </button>
                </div>
            </div>
        </main>
    );
}
