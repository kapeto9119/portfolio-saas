import { NextResponse } from "next/server";
import { z } from "zod";

import { getUser } from "@/server/services/session-service";
import { enhanceContent } from "@/server/services/ai-service";
import { prisma } from "@/server/models/prisma";

// Define the validation schema
const enhanceContentSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters long"),
  type: z.enum(["improve", "proofread", "simplify", "expand", "keywords"]),
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
    const validationResult = enhanceContentSchema.safeParse(body);
    
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
    
    const { content, type, tone } = validationResult.data;
    
    // Check if content is too long
    if (content.length > 5000) {
      return new NextResponse(
        JSON.stringify({
          error: "Content is too long. Maximum 5000 characters allowed.",
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Check if user has exceeded rate limits
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
    
    // Use the content enhancer service
    const enhancedContent = await enhanceContent(content, type, tone);
    
    // Ensure we got results
    if (!enhancedContent || enhancedContent.trim().length === 0) {
      throw new Error('Failed to generate enhanced content. Please try again with different content.');
    }
    
    // Log the request
    await prisma.aIRequest.create({
      data: {
        userId: user.id,
        requestType: `enhance-${type}`,
        promptLength: content.length,
        responseLength: enhancedContent.length,
        model: "gpt-4-turbo",
      },
    });
    
    return new NextResponse(
      JSON.stringify({
        enhancedContent,
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error("Error enhancing content:", error);
    
    // Determine the appropriate status code based on the error
    let statusCode = 500;
    let errorMessage = "Failed to enhance content. Please try again later.";
    
    if (error.message.includes("Rate limit")) {
      statusCode = 429;
      errorMessage = error.message;
    } else if (error.message.includes("Invalid request")) {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error.message.includes("too long") || error.message.includes("required")) {
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