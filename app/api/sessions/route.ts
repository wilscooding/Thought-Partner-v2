import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CreateSessionBody = {
    firebaseUid: string;          // required for now
    email?: string;
    avatarId: string;             // e.g. "denise_okoro"
    context?: unknown;            // optional JSON blob
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as CreateSessionBody;

        if (!body.firebaseUid) {
            return NextResponse.json({ error: "Missing firebaseUid" }, { status: 400 });
        }
        if (!body.avatarId) {
            return NextResponse.json({ error: "Missing avatarId" }, { status: 400 });
        }

        // Ensure user exists
        const user = await prisma.user.upsert({
            where: { firebaseUid: body.firebaseUid },
            update: { email: body.email ?? undefined },
            create: { firebaseUid: body.firebaseUid, email: body.email ?? null },
            select: { id: true, firebaseUid: true, email: true },
        });

        // Ensure avatar exists
        const avatar = await prisma.avatar.findUnique({
            where: { id: body.avatarId },
            select: { id: true, name: true, archetype: true, photoKey: true },
        });

        if (!avatar) {
            return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
        }

        // Create session
        const session = await prisma.session.create({
            data: {
                userId: user.id,
                avatarId: avatar.id,
                status: "ACTIVE",
                context: body.context ?? undefined,
            },
            select: {
                id: true,
                status: true,
                startedAt: true,
                endedAt: true,
                context: true,
                user: { select: { firebaseUid: true, email: true } },
                avatar: { select: { id: true, name: true, archetype: true, photoKey: true } },
            },
        });

        return NextResponse.json(session, { status: 201 });
    } catch (err) {
        console.error("POST /api/sessions error:", err);
        return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }
}
