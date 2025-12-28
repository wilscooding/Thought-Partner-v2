import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const { firebaseUid, topic, area, feeling, desiredOutcome, avatarId } = body;

  if (!firebaseUid) {
    return NextResponse.json({ error: "Missing firebaseUid" }, { status: 400 });
  }
  if (!topic || !area || !feeling || !desiredOutcome) {
    return NextResponse.json({ error: "Missing session answers" }, { status: 400 });
  }

  // 1) Ensure User exists
  const user = await prisma.user.upsert({
    where: { firebaseUid },
    update: {},
    create: { firebaseUid },
    select: { id: true, firebaseUid: true },
  });

  // 2) Pick an avatar
  let avatar:
    | { id: string; name: string; archetype: string | null; photoKey: string | null }
    | null = null;

  // ✅ Chosen-TP flow: force selected avatarId
  if (avatarId) {
    avatar = await prisma.avatar.findUnique({
      where: { id: String(avatarId) },
      select: { id: true, name: true, archetype: true, photoKey: true },
    });

    if (!avatar) {
      return NextResponse.json({ error: "Selected avatar not found" }, { status: 404 });
    }
  } else {
    // ✅ Match flow: random match (filter by area if possible)
    const candidates = await prisma.avatar.findMany({
      where: { engagedWhen: { contains: area, mode: "insensitive" } },
      select: { id: true, name: true, archetype: true, photoKey: true },
    });

    const pool =
      candidates.length > 0
        ? candidates
        : await prisma.avatar.findMany({
          select: { id: true, name: true, archetype: true, photoKey: true },
        });

    if (!pool.length) {
      return NextResponse.json({ error: "No avatars found. Did you seed?" }, { status: 500 });
    }

    avatar = pool[Math.floor(Math.random() * pool.length)];
  }

  // 3) Create Session
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      avatarId: avatar.id,
      status: "ACTIVE",
      context: { topic, area, feeling, desiredOutcome },
    },
    select: { id: true, status: true, avatarId: true },
  });

  return NextResponse.json({ session, avatar });
}
