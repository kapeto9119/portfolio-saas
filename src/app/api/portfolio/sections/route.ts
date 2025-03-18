import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import rateLimit from "@/lib/rate-limit";

// Initialize rate limiter
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

// Section schema for validation
const sectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["text", "gallery", "timeline", "skills", "custom"]),
  content: z.string().optional(),
  isPublished: z.boolean().default(true),
  order: z.number(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Apply rate limiting
    try {
      await limiter.check(10, session.user.email); // 10 requests per minute
    } catch {
      return new NextResponse("Too many requests", { status: 429 });
    }

    // Get user's portfolio and sections
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
      include: {
        customSections: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!portfolio) {
      return new NextResponse("Portfolio not found", { status: 404 });
    }

    return NextResponse.json(portfolio.customSections);
  } catch (error) {
    console.error("[SECTIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Apply rate limiting
    try {
      await limiter.check(5, session.user.email); // 5 updates per minute
    } catch {
      return new NextResponse("Too many requests", { status: 429 });
    }

    const body = await req.json();
    
    // Validate section data
    try {
      const validatedData = sectionSchema.parse(body);

      // Get user's portfolio
      const portfolio = await prisma.portfolio.findFirst({
        where: { userId: session.user.id },
      });

      if (!portfolio) {
        return new NextResponse("Portfolio not found", { status: 404 });
      }

      // Create or update section
      const section = await prisma.customSection.upsert({
        where: {
          id: body.id || "",
        },
        create: {
          ...validatedData,
          portfolioId: portfolio.id,
        },
        update: validatedData,
      });

      return NextResponse.json(section);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({ errors: error.errors }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("[SECTIONS_POST]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 