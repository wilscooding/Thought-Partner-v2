import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const avatars = await prisma.avatar.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                archetype: true,
                gender: true,
                engagedWhen: true,
                profileBlurb: true,
                bestUsedWhen: true,
                photoKey: true,
            },
        });

        return NextResponse.json(avatars);
    } catch (err) {
        console.error("GET /api/avatars error:", err);
        return NextResponse.json(
            { error: "Failed to fetch avatars" },
            { status: 500 }
        );
    }
}
