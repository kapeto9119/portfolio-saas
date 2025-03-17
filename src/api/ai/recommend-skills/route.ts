import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { recommendSkills } from "@/lib/ai/content-enhancer";
import { prisma } from "@/lib/db";

// Define the validation schema
const skillRecommendationSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters long"),
  currentSkills: z.array(z.string()).optional(),
  experience: z.string().optional(),
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
    const validationResult = skillRecommendationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid request",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }
    
    const { jobTitle, currentSkills, experience } = validationResult.data;
    
    // Check rate limits
    const recentRequests = await prisma.AIRequest.count({
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
    
    // Generate skill recommendations
    const recommendedSkills = await recommendSkills(jobTitle, currentSkills, experience);
    
    // Log the request
    await prisma.AIRequest.create({
      data: {
        userId: session.user.id,
        requestType: "recommend-skills",
        promptLength: jobTitle.length + (JSON.stringify(currentSkills)?.length || 0) + (experience?.length || 0),
        responseLength: JSON.stringify(recommendedSkills).length,
        model: "gpt-4-turbo",
      },
    });
    
    return new NextResponse(
      JSON.stringify({
        recommendedSkills,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error recommending skills:", error);
    
    return new NextResponse(
      JSON.stringify({
        error: "Failed to recommend skills. Please try again later.",
      }),
      { status: 500 }
    );
  }
} 