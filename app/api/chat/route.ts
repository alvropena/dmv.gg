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
        data_analyst: `You are a data analyst specializing in social media and content performance analytics. Your role is to help users:
- Analyze content performance metrics
- Interpret engagement data
- Identify trends and patterns
- Make data-driven recommendations
- Track KPIs and ROI
- Create performance reports
Always provide clear insights backed by data and suggest actionable improvements.`
    };

    return prompts[agent] || "You are a helpful assistant.";
} 