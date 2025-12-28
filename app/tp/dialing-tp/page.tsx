"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type AvatarDTO = {
    id: string;
    name: string;
};

export default function DialingTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sessionId = searchParams.get("sessionId") ?? "";
    const avatarId = searchParams.get("avatarId") ?? "";
    const avatarNameFromQS = searchParams.get("avatarName") ?? "";

    const [avatarName, setAvatarName] = useState(avatarNameFromQS);

    // ✅ Match SelectedTPProfilePage behavior: name-based webp in /public
    const avatarImgSrc = useMemo(() => {
        const name = (avatarName || avatarNameFromQS || "").trim();
        if (name) return `/${name}.webp`;
        return "/Denise Okoro.webp";
    }, [avatarName, avatarNameFromQS]);

    useEffect(() => {
        if (!sessionId || !avatarId) {
            router.replace("/match/landing-page");
            return;
        }

        let alive = true;

        // Fetch avatar details for correct name (and therefore correct image)
        (async () => {
            try {
                const res = await fetch(`/api/avatars/${encodeURIComponent(avatarId)}`);
                const data = (await res.json()) as AvatarDTO;
                if (alive && res.ok) {
                    setAvatarName(data?.name ?? avatarNameFromQS);
                }
            } catch {
                // silent fallback
            }
        })();

        // Auto transition to speaking after a short delay
        const t = setTimeout(() => {
            router.replace(
                `/tp/speaking-tp?sessionId=${encodeURIComponent(sessionId)}&avatarId=${encodeURIComponent(
                    avatarId
                )}&avatarName=${encodeURIComponent(avatarName || avatarNameFromQS)}`
            );
        }, 1400);

        return () => {
            alive = false;
            clearTimeout(t);
        };
    }, [sessionId, avatarId, avatarNameFromQS, avatarName, router]);

    const endCall = async () => {
        try {
            if (sessionId) {
                await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/end`, {
                    method: "POST",
                });
            }
        } finally {
            router.replace("/tp/session-end");
        }
    };

    return (
        <main className="dialing-page">
            <div className="dialing-shell">
                <div className="dialing-header">
                    <div className="dialing-status">Dialing....</div>
                    <h1 className="dialing-name">{avatarName || "Connecting..."}</h1>
                </div>

                <div className="dialing-avatar-wrap">
                    <div className="dialing-avatar-ring">
                        <Image
                            src={avatarImgSrc}
                            alt={avatarName || "Avatar"}
                            width={260}
                            height={260}
                            className="dialing-avatar"
                            priority
                        />
                    </div>

                    <Image
                        src="/Logo Gold.png"
                        alt="Logo"
                        width={42}
                        height={42}
                        className="dialing-mini-logo"
                        priority
                    />
                </div>

                <button className="dialing-end-btn" onClick={endCall} type="button">
                    End Call
                </button>
            </div>
        </main>
    );
}
