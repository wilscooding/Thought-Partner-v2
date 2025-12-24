import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeStringArray(value: unknown): string[] {
    if (!value) return [];

    // Already an array
    if (Array.isArray(value)) {
        return value.map(String).map((s) => s.trim()).filter(Boolean);
    }

    // If stored as JSON string like '["a","b"]'
    if (typeof value === "string") {
        const trimmed = value.trim();

        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.map(String).map((s) => s.trim()).filter(Boolean);
            }
        } catch {
            // If stored as newline / bullet list string
            return trimmed
                .split(/\r?\n|•/g)
                .map((s) => s.trim())
                .filter(Boolean);
        }
    }

    return [];
}

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    let resolvedId = "";
    try {
        const { id } = await params;
        resolvedId = id;

        const avatar = await prisma.avatar.findUnique({
            where: { id: resolvedId },
            select: {
                id: true,
                name: true,
                archetype: true,
                gender: true,
                engagedWhen: true,
                profileBlurb: true,
                bestUsedWhen: true,
                personalityDescription: true,
                physicalDescription: true,
                voiceDescription: true,
                systemPrompt: true,
                photoKey: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!avatar) {
            return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
        }

        return NextResponse.json({
            ...avatar,
            bestUsedWhen: normalizeStringArray(avatar.bestUsedWhen),
        });
    } catch (err) {
        console.error(`GET /api/avatars/${resolvedId} error:`, err);
        return NextResponse.json({ error: "Failed to fetch avatar" }, { status: 500 });
    }
}
