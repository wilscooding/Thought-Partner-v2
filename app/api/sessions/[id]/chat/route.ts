import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openRouterChat } from "@/lib/server/openrouter";

export const maxDuration = 60 //seconds


type ChatBody = {
    content: string;               // user message
    model?: string;                // optional override
    temperature?: number;          // optional
    maxHistory?: number;           // optional, default 20
    meta?: unknown;                // optional message meta
};

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: sessionId } = await params;

    try {
        const body = (await req.json()) as ChatBody;

        const userContent = body?.content?.trim();
        if (!userContent) {
            return NextResponse.json({ error: "Missing content" }, { status: 400 });
        }

        // Limit history between 1 and 50 to prevent context overflow
        const maxHistory = Math.min(Math.max(body.maxHistory ?? 20, 1), 50);

        // 1) Load session + avatar prompt + context
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            select: {
                id: true,
                status: true,
                context: true,
                avatar: {
                    select: {
                        id: true,
                        name: true,
                        systemPrompt: true,
                    },
                },
            },
        });

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }
        if (session.status !== "ACTIVE") {
            return NextResponse.json({ error: "Session is not ACTIVE" }, { status: 400 });
        }
        if (!session.avatar?.systemPrompt) {
            return NextResponse.json(
                { error: "Avatar systemPrompt is missing" },
                { status: 500 }
            );
        }

        // 2) Store the user message in DB first
        const userMsg = await prisma.message.create({
            data: {
                sessionId,
                role: "user",
                content: userContent,
                meta: body.meta ?? undefined,
            },
            select: { id: true, role: true, content: true, createdAt: true },
        });

        // 3) Fetch RECENT message history
        // We take 'desc' to get the most recent ones, then reverse to make them chronological
        const historyData = await prisma.message.findMany({
            where: { sessionId },
            orderBy: { createdAt: "desc" },
            take: maxHistory,
            select: { role: true, content: true },
        });

        const history = historyData.reverse();

        // 4) Build model messages (system + history)
        // Inject session context (like user mindset) into the system prompt
        const dynamicInputs = session.context
            ? `USER_DYNAMIC_INPUTS:\n${JSON.stringify(session.context, null, 2)}`
            : "";

        const systemMessage = dynamicInputs
            ? `${session.avatar.systemPrompt}\n\n${dynamicInputs}`
            : session.avatar.systemPrompt;

        const modelMessages = [
            { role: "system" as const, content: systemMessage },
            ...history.map((m) => ({
                role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
                content: m.content,
            })),
        ];

        // 5) Call OpenRouter via your utility
        const { content: assistantContent } = await openRouterChat({
            model: body.model,
            temperature: body.temperature,
            messages: modelMessages,
        });

        // 6) Store assistant response in DB
        const assistantMsg = await prisma.message.create({
            data: {
                sessionId,
                role: "assistant",
                content: assistantContent,
                meta: {
                    provider: "openrouter",
                    model: body.model ?? process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini"
                },
            },
            select: { id: true, role: true, content: true, createdAt: true },
        });

        // Return the full turn to the frontend
        return NextResponse.json({
            sessionId,
            avatarId: session.avatar.id,
            avatarName: session.avatar.name,
            userMessage: userMsg,
            assistantMessage: assistantMsg,
        });

    } catch (err) {
        console.error(`POST /api/sessions/${sessionId}/chat error:`, err);
        return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
    }
}