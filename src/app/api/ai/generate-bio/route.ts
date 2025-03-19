import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AI_ROLES, generateAIResponse } from "@/lib/ai/openai";

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get request body
    const { currentBio, experience, skills } = await req.json();
    if (!experience && !skills?.length) {
      return new NextResponse(
        "Either experience or skills are required",
        { status: 400 }
      );
    }

    // Generate bio suggestions
    const response = await generateAIResponse(
      AI_ROLES.BIO_WRITER,
      `Please write a professional bio based on:
Experience: ${experience || "Not provided"}
Skills: ${skills?.join(", ") || "Not provided"}
Current bio (if any to improve upon): ${currentBio || "None"}

Please provide three versions:
1. Concise: A brief, impactful summary
2. Detailed: A comprehensive professional bio
3. Story-based: A narrative approach highlighting the journey`,
      {
        model: "GPT4",
        temperature: 0.7,
        max_tokens: 1000,
      }
    );

    const suggestions = response
      .split(/\n\n|\r\n\r\n/)
      .filter(Boolean)
      .map(s => s.replace(/^(Concise|Detailed|Story-based): /, ""));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Bio generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 