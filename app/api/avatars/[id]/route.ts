import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    let resolvedId = '';
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

        return NextResponse.json(avatar);
    } catch (err) {
        console.error(`GET /api/avatars/${resolvedId} error:`, err);
        return NextResponse.json(
            { error: "Failed to fetch avatar" },
            { status: 500 }
        );
    }
}
