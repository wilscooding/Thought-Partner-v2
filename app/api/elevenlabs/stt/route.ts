import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Expected form-data:
// - audio: File (required)  e.g. "audio.webm" from MediaRecorder on mobile
// - model_id: string (optional) default "scribe_v1"
// - language_code: string (optional) e.g. "en"

export async function POST(req: Request) {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing ELEVENLABS_API_KEY" }, { status: 500 });
        }

        const form = await req.formData();
        const audio = form.get("audio");

        if (!audio || !(audio instanceof File)) {
            return NextResponse.json(
                { error: "Missing form-data file field: `audio`" },
                { status: 400 }
            );
        }

        const modelId = (form.get("model_id") as string) || process.env.ELEVENLABS_STT_MODEL || "scribe_v1";
        const languageCode = (form.get("language_code") as string) || "";

        const elevenForm = new FormData();
        elevenForm.append("file", audio, audio.name || "audio.webm");
        elevenForm.append("model_id", modelId);
        if (languageCode) elevenForm.append("language_code", languageCode);

        const elevenRes = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
            method: "POST",
            headers: {
                "xi-api-key": apiKey,
            },
            body: elevenForm,
        });

        if (!elevenRes.ok) {
            const errText = await elevenRes.text().catch(() => "");
            return NextResponse.json(
                {
                    error: "ElevenLabs STT failed",
                    status: elevenRes.status,
                    details: errText?.slice(0, 1500),
                },
                { status: 500 }
            );
        }

        const data = await elevenRes.json();

        const transcript =
            data?.text ??
            data?.transcript ??
            data?.result?.text ??
            "";

        return NextResponse.json({
            transcript,
            raw: data, // keep during dev, remove later
        });
    } catch (e: any) {
        return NextResponse.json(
            { error: "STT route crashed", details: e?.message ?? String(e) },
            { status: 500 }
        );
    }
}
