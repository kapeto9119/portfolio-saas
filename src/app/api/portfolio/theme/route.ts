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

// Theme schema for validation
const themeSchema = z.object({
  layout: z.enum(["grid", "timeline", "cards"]),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  fontFamily: z.string(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  backgroundImage: z.string().optional().nullable(),
  customCss: z.string().optional().nullable(),
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

    // Get user's portfolio and theme
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
      include: { theme: true },
    });

    if (!portfolio) {
      return new NextResponse("Portfolio not found", { status: 404 });
    }

    // Return theme data with portfolio slug
    return NextResponse.json({
      ...portfolio.theme,
      portfolioSlug: portfolio.slug,
    });
  } catch (error) {
    console.error("[THEME_GET]", error);
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
    
    // Validate theme data
    try {
      const validatedData = themeSchema.parse(body);

      // Get user's portfolio
      const portfolio = await prisma.portfolio.findFirst({
        where: { userId: session.user.id },
        include: { theme: true },
      });

      if (!portfolio) {
        return new NextResponse("Portfolio not found", { status: 404 });
      }

      // Sanitize custom CSS if present
      if (validatedData.customCss) {
        validatedData.customCss = validatedData.customCss
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/@import/gi, "") // Remove @import statements
          .replace(/url\(/gi, ""); // Remove url() functions
      }

      // Update or create theme
      const theme = await prisma.portfolioTheme.upsert({
        where: {
          portfolioId: portfolio.id,
        },
        create: {
          ...validatedData,
          portfolioId: portfolio.id,
        },
        update: validatedData,
      });

      return NextResponse.json(theme);
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
    console.error("[THEME_POST]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 