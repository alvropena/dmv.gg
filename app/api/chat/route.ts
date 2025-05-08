import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
    from: "me" | "agent";
    text: string;
}

export async function POST(req: Request) {
    try {
        const { messages, agent } = await req.json();

        const systemPrompt = getAgentSystemPrompt(agent);

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages.map((msg: ChatMessage) => ({
                    role: msg.from === "me" ? "user" : "assistant",
                    content: msg.text,
                })),
            ],
            temperature: 0.7,
        });

        return NextResponse.json({
            message: response.choices[0].message.content,
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Failed to process chat message" },
            { status: 500 }
        );
    }
}

function getAgentSystemPrompt(agent: string): string {
    const prompts: Record<string, string> = {
        content_planner: "You are a content planning expert. Help users plan and structure their content effectively.",
        seo_specialist: "You are an SEO specialist. Help users optimize their content for search engines.",
        copywriter: "You are a professional copywriter. Help users write compelling and engaging content.",
        editor: "You are an experienced editor. Help users refine and improve their content.",
        researcher: "You are a thorough researcher. Help users gather and analyze information effectively.",
    };

    return prompts[agent] || "You are a helpful assistant.";
} 