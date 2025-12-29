import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"; // adjust if your import differs

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

type TTSBody = {
    text: string;
    avatarId: string; // REQUIRED now
    modelId?: string;
    voiceSettings?: {
        stability?: number;
        similarity_boost?: number;
        style?: number;
        use_speaker_boost?: boolean;
    };
    outputFormat?: string; // e.g. "mp3_44100_128" if supported
};

export async function POST(req: Request) {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing ELEVENLABS_API_KEY" }, { status: 500 });
        }

        const body = (await req.json()) as TTSBody;

        if (!body?.text || typeof body.text !== "string") {
            return NextResponse.json({ error: "Missing `text`" }, { status: 400 });
        }

        if (!body?.avatarId || typeof body.avatarId !== "string") {
            return NextResponse.json({ error: "Missing `avatarId`" }, { status: 400 });
        }

        // Fetch voiceId from Prisma (seed already populated elevenVoiceId)
        const avatar = await prisma.avatar.findUnique({
            where: { id: body.avatarId },
            select: { elevenVoiceId: true },
        });

        const voiceId = avatar?.elevenVoiceId;
        if (!voiceId) {
            return NextResponse.json(
                { error: `Avatar missing elevenVoiceId: ${body.avatarId}` },
                { status: 400 }
            );
        }

        const modelId =
            body.modelId ||
            process.env.ELEVENLABS_TTS_MODEL ||
            "eleven_multilingual_v2";

        const url = new URL(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`);
        if (body.outputFormat) url.searchParams.set("output_format", body.outputFormat);

        const elevenRes = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "xi-api-key": apiKey,
                "Content-Type": "application/json",
                Accept: "audio/mpeg",
            },
            body: JSON.stringify({
                text: body.text,
                model_id: modelId,
                voice_settings: {
                    stability: 0.35,
                    similarity_boost: 0.75,
                    ...(body.voiceSettings ?? {}),
                },
            }),
        });

        if (!elevenRes.ok || !elevenRes.body) {
            const errText = await elevenRes.text().catch(() => "");
            return NextResponse.json(
                {
                    error: "ElevenLabs TTS failed",
                    status: elevenRes.status,
                    details: errText?.slice(0, 1000),
                },
                { status: 500 }
            );
        }

        // Stream audio through to client (best mobile UX)
        return new Response(elevenRes.body, {
            status: 200,
            headers: {
                "Content-Type": elevenRes.headers.get("Content-Type") || "audio/mpeg",
                "Cache-Control": "no-store",
            },
        });
    } catch (e: any) {
        return NextResponse.json(
            { error: "TTS route crashed", details: e?.message ?? String(e) },
            { status: 500 }
        );
    } finally {
        // In serverless you typically *don’t* disconnect per request,
        // but if you're on long-lived node you can leave it.
    }
}
