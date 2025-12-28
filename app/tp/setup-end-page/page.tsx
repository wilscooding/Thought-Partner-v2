"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SiteMenu from "@/components/SiteMenu";

// Phone icon (Make the call)
const PhoneIcon = () => (
    <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path
            d="M21 16.5v3a2 2 0 0 1-2.2 2
      18 18 0 0 1-7.8-2.8
      17.5 17.5 0 0 1-5.2-5.2
      18 18 0 0 1-2.8-7.8
      A2 2 0 0 1 5.5 3h3
      a2 2 0 0 1 2 1.7
      13 13 0 0 0 .8 3.5
      a2 2 0 0 1-.4 2.1
      l-1.6 1.6
      a14 14 0 0 0 5.4 5.4
      l1.6-1.6
      a2 2 0 0 1 2.1-.4
      13 13 0 0 0 3.5.8
      A2 2 0 0 1 21 16.5z"
        />
    </svg>
);

// Restart icon (Start over)
const RestartIcon = () => (
    <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <polyline points="3 4 3 10 9 10" />
    </svg>
);

type AvatarDTO = {
    id: string;
    name: string;
};

export default function SessionSetupEndPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sessionId = searchParams.get("sessionId") ?? "";
    const avatarId = searchParams.get("avatarId") ?? "";

    const [avatarName, setAvatarName] = useState<string>("");

    useEffect(() => {
        if (!sessionId || !avatarId) {
            // If someone lands here without params, send them back to start the flow
            router.replace("/tp/profile-landing");
            return;
        }

        let alive = true;

        (async () => {
            try {
                const res = await fetch(`/api/avatars/${encodeURIComponent(avatarId)}`);
                const data = (await res.json()) as AvatarDTO;

                if (alive && res.ok) {
                    setAvatarName(data?.name ?? "");
                }
            } catch {
                // silent fallback
            }
        })();

        return () => {
            alive = false;
        };
    }, [sessionId, avatarId, router]);

    const onMakeCall = () => {
        if (!sessionId || !avatarId) return;

        router.push(
            `/tp/dialing-tp?sessionId=${encodeURIComponent(sessionId)}&avatarId=${encodeURIComponent(
                avatarId
            )}&avatarName=${encodeURIComponent(avatarName)}`
        );
    };

    const onStartOver = () => {
        router.push("/tp/profile-landing");
    };

    return (
        <main className="light-bg-page">
            {/* burger (set burger to dark on light pages) */}
            <SiteMenu burgerColor="#2f2b25" />

            {/* top-right logo (dark logo on light page) */}
            <Image
                src="/Logo Dark.png"
                alt="Thought Partner Logo"
                width={56}
                height={56}
                priority
                className="main-logo-top-right"
            />

            <div className="session-end-shell">
                <h1 className="session-end-title">
                    All set. I’ve passed
                    <br />
                    everything along.
                </h1>

                <p className="session-end-subtitle">
                    Your Thought Partner has what
                    <br />
                    they need to begin.
                </p>

                <button className="session-end-primary-btn" onClick={onMakeCall}>
                    <PhoneIcon />
                    Make the Call
                </button>

                <button className="session-end-secondary-btn" onClick={onStartOver}>
                    <RestartIcon />
                    Start Over
                </button>
            </div>
        </main>
    );
}
