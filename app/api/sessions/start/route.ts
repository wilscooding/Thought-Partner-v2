import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { topic, feeling, desiredOutcome } = body;

  // Day 1: hardcode a single avatar stub
  const avatar = {
    id: "denise_okoro",
    name: "Denise Okoro",
    archetype: "Grounded Realist",
  };

  // Later: create Firestore Session doc here
  const session = {
    id: "dummy-session-id",
    avatarId: avatar.id,
    topic,
    feeling,
    desiredOutcome,
  };

  return NextResponse.json({ session, avatar });
}
