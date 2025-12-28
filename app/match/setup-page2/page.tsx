"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SiteMenu from "@/components/SiteMenu";
import { SESSION_PROMPTS } from "@/lib/sessionPrompts";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import SelectPill from "@/components/SelecPill";

export default function SessionSetupPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [values, setValues] = useState({
        focus: "",
        area: "",
        feeling: "",
        outcome: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const questions = [
        {
            id: "focus",
            label: "What do you want to think through today?",
            placeholder: "Select an option...",
        },
        {
            id: "area",
            label: "Which area best fits today's topic?",
            placeholder: "Select an area...",
        },
        {
            id: "feeling",
            label: "How are you feeling right now?",
            placeholder: "Select your mood...",
        },
        {
            id: "outcome",
            label: "What do you want to walk away with after todays session?",
            placeholder: "Select an outcome...",
        },
    ] as const;

    const onSubmit = async () => {
        setError(null);

        if (!values.focus || !values.area || !values.feeling || !values.outcome) {
            setError("Please answer all four questions.");
            return;
        }

        // Guest/dev fallback for now (auth will be enforced later)
        const firebaseUid = user?.uid ?? "dev_uid_local";

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/sessions/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firebaseUid,
                    topic: values.focus,
                    area: values.area,
                    feeling: values.feeling,
                    desiredOutcome: values.outcome,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Failed to start session");

            const sessionId = data.session?.id as string | undefined;
            const avatarId = data.avatar?.id as string | undefined;

            if (!sessionId || !avatarId) {
                throw new Error("Session start succeeded but returned missing sessionId/avatarId.");
            }

            // NEW FLOW: go to tp-match first (choose to call or rematch)
            router.push(
                `/match/tp-match?sessionId=${encodeURIComponent(sessionId)}&avatarId=${encodeURIComponent(
                    avatarId
                )}`
            );
        } catch (e: any) {
            setError(e?.message ?? "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="light-bg-page session-setup-page">
            <SiteMenu burgerColor="#2f2b25" />

            <Image
                src="/Logo Dark.png"
                alt="App Logo"
                width={56}
                height={56}
                priority
                className="main-logo-top-right"
            />

            <div className="setup-shell">
                <form className="setup-form" onSubmit={(e) => e.preventDefault()}>
                    {questions.map((q) => (
                        <div key={q.id} className="setup-field">
                            <SelectPill
                                label={q.label}
                                placeholder={q.placeholder}
                                value={values[q.id]}
                                options={SESSION_PROMPTS[q.id]}
                                onChange={(next) => setValues((prev) => ({ ...prev, [q.id]: next }))}
                            />
                        </div>
                    ))}

                    {error && <div className="setup-error">{error}</div>}

                    <button
                        type="button"
                        className="setup-submit-btn"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        aria-disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </main>
    );
}
