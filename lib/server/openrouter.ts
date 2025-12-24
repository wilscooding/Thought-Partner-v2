import "server-only";

type OpenRouterMessage = { role: "system" | "user" | "assistant"; content: string };

export async function openRouterChat(opts: {
    model?: string;
    messages: OpenRouterMessage[];
    temperature?: number;
}) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is missing");

    const model = opts.model ?? process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            // Optional but recommended by OpenRouter:
            "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
            "X-Title": process.env.OPENROUTER_APP_NAME ?? "Thought Partner v2",
        },
        body: JSON.stringify({
            model,
            messages: opts.messages,
            temperature: opts.temperature ?? 0.7,
        }),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`OpenRouter error ${res.status}: ${text}`);
    }

    const data = await res.json();

    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenRouter returned no content");

    return { content, raw: data };
}
