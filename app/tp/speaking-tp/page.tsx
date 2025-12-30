"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type AvatarDTO = {
    id: string;
    name: string;
};

type SttResponse = {
    transcript?: string;
};

function SpeakingTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sessionId = searchParams.get("sessionId") ?? "";
    const avatarId = searchParams.get("avatarId") ?? "";
    const avatarNameFromQS = searchParams.get("avatarName") ?? "";

    const [avatarName, setAvatarName] = useState(avatarNameFromQS);

    // --- VOICE PIPELINE STATE ---
    const [isRecording, setIsRecording] = useState(false);
    const [busy, setBusy] = useState(false);
    const [lastUserText, setLastUserText] = useState("");
    const [lastTPText, setLastTPText] = useState("");
    const [err, setErr] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const avatarImgSrc = useMemo(() => {
        const name = (avatarName || avatarNameFromQS || "").trim();
        if (name) return `/${name}.webp`;
        return "/Denise Okoro.webp";
    }, [avatarName, avatarNameFromQS]);

    useEffect(() => {
        // keep a single audio element alive
        audioRef.current = new Audio();

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;

            // stop mic if still open
            streamRef.current?.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        };
    }, []);

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

    // --- HELPERS: STT / CHAT / TTS ---

    async function runSTT(audioBlob: Blob): Promise<string> {
        const fd = new FormData();
        fd.append("audio", audioBlob, "speech.webm");

        const res = await fetch("/api/elevenlabs/stt", {
            method: "POST",
            body: fd,
        });

        if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(`STT failed (${res.status}): ${t || res.statusText}`);
        }

        const data = (await res.json()) as SttResponse;
        return (data.transcript ?? "").trim();
    }

    async function runChat(userText: string): Promise<string> {
        if (!sessionId) throw new Error("Missing sessionId.");

        const res = await fetch(
            `/api/sessions/${encodeURIComponent(sessionId)}/chat`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: userText,
                    meta: { avatarId }, // optional, for tracking/debug
                }),
            }
        );

        if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(`Chat failed (${res.status}): ${t || res.statusText}`);
        }

        const data = await res.json();

        // IMPORTANT: your backend returns assistantMessage.content
        const assistantText: string = data?.assistantMessage?.content ?? "";

        return assistantText.trim();
    }

    async function playTTS(text: string) {
        if (!avatarId) throw new Error("Missing avatarId.");

        const res = await fetch("/api/elevenlabs/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, avatarId }),
        });

        if (!res.ok) {
            const t = await res.text().catch(() => "");
            throw new Error(`TTS failed (${res.status}): ${t || res.statusText}`);
        }

        const audioBlob = await res.blob();
        const url = URL.createObjectURL(audioBlob);

        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        audio.src = url;
        audio.currentTime = 0;

        await audio.play();

        audio.onended = () => URL.revokeObjectURL(url);
    }

    // --- RECORDING CONTROL ---

    async function startRecording() {
        setErr(null);
        if (busy) return;

        if (!navigator.mediaDevices?.getUserMedia) {
            setErr("Microphone not supported in this browser.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mimeType =
                MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
                    ? "audio/webm;codecs=opus"
                    : MediaRecorder.isTypeSupported("audio/webm")
                        ? "audio/webm"
                        : "";

            const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            mediaRecorderRef.current = mr;
            chunksRef.current = [];

            mr.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
            };

            mr.onstop = async () => {
                setIsRecording(false);

                // stop mic tracks right after recording ends
                streamRef.current?.getTracks().forEach((t) => t.stop());
                streamRef.current = null;

                try {
                    setBusy(true);

                    const blob = new Blob(chunksRef.current, {
                        type: mr.mimeType || "audio/webm",
                    });

                    // 1) STT
                    const transcript = await runSTT(blob);
                    if (!transcript) {
                        setErr("I didn’t catch that—try again.");
                        return;
                    }
                    setLastUserText(transcript);

                    // 2) Chat
                    const assistantText = await runChat(transcript);
                    if (!assistantText) {
                        setErr("Chat returned no response.");
                        return;
                    }
                    setLastTPText(assistantText);

                    // 3) TTS
                    await playTTS(assistantText);
                } catch (e: any) {
                    setErr(e?.message ?? "Voice pipeline failed.");
                } finally {
                    setBusy(false);
                }
            };

            mr.start();
            setIsRecording(true);
        } catch (e: any) {
            setErr(e?.message ?? "Could not start microphone.");
            streamRef.current?.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    }

    async function stopRecording() {
        setErr(null);
        const mr = mediaRecorderRef.current;
        if (!mr || mr.state !== "recording") return;
        mr.stop(); // triggers mr.onstop pipeline
    }

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

            {/* --- TALK CONTROLS (reuses your existing button class, no CSS change required) --- */}
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    marginTop: 18,
                }}
            >
                {!isRecording ? (
                    <button
                        className="dialing-end-btn"
                        onClick={startRecording}
                        type="button"
                        disabled={busy}
                    >
                        {busy ? "Working..." : "Start Talking"}
                    </button>
                ) : (
                    <button className="dialing-end-btn" onClick={stopRecording} type="button">
                        Stop
                    </button>
                )}
            </div>

            {err && (
                <div style={{ marginTop: 12, textAlign: "center" }}>
                    <p style={{ color: "crimson" }}>{err}</p>
                </div>
            )}

            {/* Optional debug text (remove anytime) */}
            {(lastUserText || lastTPText) && (
                <div style={{ marginTop: 14, padding: 12 }}>
                    <p>
                        <b>You:</b> {lastUserText || "—"}
                    </p>
                    <p>
                        <b>TP:</b> {lastTPText || "—"}
                    </p>
                </div>
            )}

            <button className="dialing-end-btn" onClick={endCall} type="button">
                End Call
            </button>
        </div>
    );
}

export default function SpeakingTPPage() {
    return (
        <main className="dialing-page">
            <Suspense
                fallback={
                    <div className="dialing-shell">
                        <div className="dialing-status">Connecting...</div>
                    </div>
                }
            >
                <SpeakingTPContent />
            </Suspense>
        </main>
    );
}
