"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, Suspense } from "react"; // Added Suspense
import { useRouter, useSearchParams } from "next/navigation";

type AvatarDTO = {
    id: string;
    name: string;
};

function SpeakingTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sessionId = searchParams.get("sessionId") ?? "";
    const avatarId = searchParams.get("avatarId") ?? "";
    const avatarNameFromQS = searchParams.get("avatarName") ?? "";

    const [avatarName, setAvatarName] = useState(avatarNameFromQS);

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

        return () => {
            alive = false;
        };
    }, [sessionId, avatarId, avatarNameFromQS, router]);

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
        <div className="dialing-shell">
            <div className="dialing-header">
                <div className="dialing-status">Speaking To</div>
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
    );
}

export default function SpeakingTPPage() {
    return (
        <main className="dialing-page">
            <Suspense fallback={<div className="dialing-shell"><div className="dialing-status">Connecting...</div></div>}>
                <SpeakingTPContent />
            </Suspense>
        </main>
    );
}