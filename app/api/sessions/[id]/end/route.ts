import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await prisma.session.update({
            where: { id },
            data: { status: "ENDED", endedAt: new Date() },
            select: { id: true, status: true, endedAt: true },
        });

        return NextResponse.json(session);
    } catch (err) {
        console.error(`POST /api/sessions/${id}/end error:`, err);
        return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
    }
}
