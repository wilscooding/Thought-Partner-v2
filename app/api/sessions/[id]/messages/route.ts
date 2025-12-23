import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CreateMessageBody = {
    role: "user" | "assistant" | "system";
    content: string;
    meta?: unknown; // optional JSON metadata (model, latency, etc.)
};

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: sessionId } = await params;

    try {
        const body = (await req.json()) as CreateMessageBody;

        if (!body?.role) {
            return NextResponse.json({ error: "Missing role" }, { status: 400 });
        }
        if (!body?.content?.trim()) {
            return NextResponse.json({ error: "Missing content" }, { status: 400 });
        }

        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            select: { id: true, status: true },
        });

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }
        if (session.status !== "ACTIVE") {
            return NextResponse.json({ error: "Session is not ACTIVE" }, { status: 400 });
        }

        const msg = await prisma.message.create({
            data: {
                sessionId,
                role: body.role,
                content: body.content,
                meta: body.meta ?? undefined,
            },
            select: { id: true, role: true, content: true, meta: true, createdAt: true },
        });

        return NextResponse.json(msg, { status: 201 });
    } catch (err) {
        console.error(`POST /api/sessions/${sessionId}/messages error:`, err);
        return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
    }
}
