import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await prisma.session.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                startedAt: true,
                endedAt: true,
                context: true,
                avatar: {
                    select: { id: true, name: true, archetype: true, photoKey: true },
                },
                user: {
                    select: { firebaseUid: true, email: true },
                },
                messages: {
                    orderBy: { createdAt: "asc" },
                    select: { id: true, role: true, content: true, meta: true, createdAt: true },
                },
            },
        });

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        return NextResponse.json(session);
    } catch (err) {
        console.error(`GET /api/sessions/${id} error:`, err);
        return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
    }
}
