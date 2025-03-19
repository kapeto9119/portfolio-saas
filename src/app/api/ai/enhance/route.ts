import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get request body
    const { content } = await req.json();
    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    // Generate enhanced versions
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional content enhancer. Your task is to improve the given text while maintaining its core message. Provide 3 different enhanced versions, each with a different style: professional, engaging, and concise.",
        },
        {
          role: "user",
          content: `Please enhance this text: ${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const suggestions = completion.choices[0].message.content
      ?.split("\n\n")
      .filter(Boolean)
      .map(s => s.replace(/^(Professional|Engaging|Concise): /, ""));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("AI enhancement error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 