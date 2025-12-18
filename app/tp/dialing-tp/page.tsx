"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DialingTPPage() {
    const router = useRouter();

    return (
        <main className="dialing-page">
            <div className="dialing-shell">
                <div className="dialing-header">
                    <div className="dialing-status">Dialing....</div>
                    <h1 className="dialing-name">Denise Okoro</h1>
                </div>

                {/* Avatar + small logo */}
                <div className="dialing-avatar-wrap">
                    <div className="dialing-avatar-ring">
                        <Image
                            src="/Denise Okoro.webp"
                            alt="Denise Okoro"
                            width={260}
                            height={260}
                            className="dialing-avatar"
                            priority
                        />
                    </div>

                    {/* Small logo under-right */}
                    <Image
                        src="/Logo Gold.png"
                        alt="Logo"
                        width={42}
                        height={42}
                        className="dialing-mini-logo"
                        priority
                    />
                </div>

                <button
                    className="dialing-end-btn"
                    onClick={() => router.back()}
                    type="button"
                >
                    End Call
                </button>
            </div>
        </main>
    );
}
