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
    const { currentSkills, experience } = await req.json();
    if (!experience) {
      return new NextResponse("Experience description is required", { status: 400 });
    }

    // Generate skill recommendations
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a career advisor specializing in technical skills. Based on the user's experience and current skills, suggest relevant additional skills they should learn. Group skills by category and include relevance scores.",
        },
        {
          role: "user",
          content: `Experience: ${experience}\nCurrent skills: ${currentSkills.join(", ")}\n\nPlease suggest additional relevant skills.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse the response into structured data
    const response = completion.choices[0].message.content ?? "";
    const skills = parseSkillSuggestions(response);

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("AI skill recommendation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function parseSkillSuggestions(response: string | undefined): Array<{
  name: string;
  relevance: number;
  category: string;
}> {
  if (!response) return [];

  // This is a simple parser. In production, you'd want more robust parsing
  const categories = response.split(/\n\n|\r\n\r\n/);
  const skills: Array<{ name: string; relevance: number; category: string }> = [];

  categories.forEach((category) => {
    const lines = category.split("\n");
    const categoryName = lines[0].replace(":", "").trim();

    lines.slice(1).forEach((line) => {
      const match = line.match(/^[-*•]?\s*([^(]+)\s*\((\d+)%\)/);
      if (match) {
        skills.push({
          name: match[1].trim(),
          relevance: parseInt(match[2], 10),
          category: categoryName,
        });
      }
    });
  });

  return skills.sort((a, b) => b.relevance - a.relevance);
} 