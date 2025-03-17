import { NextResponse } from "next/server";
import { z } from "zod";

import { getUser } from "@/server/services/session-service";
import { recommendSkills } from "@/server/services/ai-service";
import { prisma } from "@/server/models/prisma";

// Define the validation schema
const skillRecommendationSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters long"),
  currentSkills: z.array(z.string()).optional(),
  experience: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const user = await getUser();
    
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
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
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    const { jobTitle, currentSkills, experience } = validationResult.data;
    
    // Check rate limits
    const recentRequests = await prisma.aIRequest.count({
      where: {
        userId: user.id,
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
        { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '3600',
          },
        }
      );
    }
    
    // Generate skill recommendations
    const recommendedSkills = await recommendSkills(jobTitle, currentSkills, experience);
    
    // Ensure we got results
    if (!recommendedSkills || recommendedSkills.length === 0) {
      throw new Error('Failed to generate skills recommendations. Please try with a different job title.');
    }
    
    // Log the request
    await prisma.aIRequest.create({
      data: {
        userId: user.id,
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
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error("Error recommending skills:", error);
    
    // Determine the appropriate status code based on the error
    let statusCode = 500;
    let errorMessage = "Failed to recommend skills. Please try again later.";
    
    if (error.message.includes("Rate limit")) {
      statusCode = 429;
      errorMessage = error.message;
    } else if (error.message.includes("Invalid request")) {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error.message.includes("job title")) {
      statusCode = 400;
      errorMessage = error.message;
    }
    
    return new NextResponse(
      JSON.stringify({
        error: errorMessage,
      }),
      { 
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 