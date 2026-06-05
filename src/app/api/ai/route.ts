import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    const message = error?.message?.includes('Incorrect API key provided')
      ? 'OpenAI key invalid. Please update OPENAI_API_KEY in .env.local.'
      : error?.message || 'Failed to generate response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}