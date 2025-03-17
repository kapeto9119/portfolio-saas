import { NextResponse } from "next/server";
import { z } from "zod";

import { getUser } from "@/server/services/session-service";
import { generateBio } from "@/server/services/ai-service";
import { prisma } from "@/server/models/prisma";

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
    const user = await getUser();
    
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
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
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    const { skills, experience, education, tone } = validationResult.data;
    
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
    
    // Generate the bio
    const bioContent = await generateBio(skills, experience, education, tone);
    
    // Log the request
    await prisma.aIRequest.create({
      data: {
        userId: user.id,
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
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error("Error generating bio:", error);
    
    // Determine the appropriate status code based on the error
    let statusCode = 500;
    let errorMessage = "Failed to generate bio. Please try again later.";
    
    if (error.message.includes("Rate limit")) {
      statusCode = 429;
      errorMessage = error.message;
    } else if (error.message.includes("Invalid request")) {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error.message.includes("required")) {
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