import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { enhanceContent } from "@/lib/ai/content-enhancer";
import { prisma } from "@/lib/db";

// Define the validation schema
const enhanceContentSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters long"),
  type: z.enum(["improve", "proofread", "simplify", "expand", "keywords"]),
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
    const validationResult = enhanceContentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid request",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }
    
    const { content, type, tone } = validationResult.data;
    
    // Check if content is too long
    if (content.length > 5000) {
      return new NextResponse(
        JSON.stringify({
          error: "Content is too long. Maximum 5000 characters allowed.",
        }),
        { status: 400 }
      );
    }
    
    // Check if user has exceeded rate limits
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
    
    // Use the content enhancer service
    const enhancedContent = await enhanceContent(content, type, tone);
    
    // Log the request
    await prisma.aIRequest.create({
      data: {
        userId: session.user.id,
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Error enhancing content:", error);
    
    return new NextResponse(
      JSON.stringify({
        error: "Failed to enhance content. Please try again later.",
      }),
      { status: 500 }
    );
  }
} 