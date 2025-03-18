import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { generateBio } from "@/lib/ai/content-enhancer";
import { prisma } from "@/lib/db";

// Define the validation schema
const bioGenerationSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience: z.string().min(10, "Experience must be at least 10 characters long"),
  education: z.string().min(10, "Education must be at least 10 characters long"),
  tone: z.enum(["professional", "conversational", "technical", "enthusiastic", "authoritative"]),
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    
    // Parse and validate request body
    const body = await req.json();
    const validationResult = bioGenerationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid request",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }
    
    const { skills, experience, education, tone } = validationResult.data;
    
    // Check rate limits
    const recentRequests = await prisma.aIRequest.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(Date.now() - 3600000), // Last hour
        },
      },
    });
    
    if (recentRequests >= 10) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Try again later.",
          retryAfter: "1 hour",
        }),
        { status: 429 }
      );
    }
    
    // Generate the bio
    const bioContent = await generateBio(skills, experience, education, tone);
    
    // Log the request
    await prisma.aIRequest.create({
      data: {
        userId: session.user.id,
        requestType: "generate-bio",
        promptLength: JSON.stringify({ skills, experience, education }).length,
        responseLength: bioContent.length,
        model: "gpt-4-turbo",
      },
    });
    
    return new NextResponse(
      JSON.stringify({
        bioContent,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating bio:", error);
    
    return new NextResponse(
      JSON.stringify({
        error: "Failed to generate bio. Please try again later.",
      }),
      { status: 500 }
    );
  }
} 