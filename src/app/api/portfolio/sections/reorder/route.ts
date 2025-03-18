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

// Reorder schema for validation
const reorderSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Apply rate limiting
    try {
      await limiter.check(5, session.user.email); // 5 reorders per minute
    } catch {
      return new NextResponse("Too many requests", { status: 429 });
    }

    const body = await req.json();
    
    // Validate reorder data
    try {
      const { sections } = reorderSchema.parse(body);

      // Get user's portfolio
      const portfolio = await prisma.portfolio.findFirst({
        where: { userId: session.user.id },
        include: {
          customSections: true,
        },
      });

      if (!portfolio) {
        return new NextResponse("Portfolio not found", { status: 404 });
      }

      // Verify all sections belong to user
      const sectionIds = sections.map(s => s.id);
      const userSectionIds = portfolio.customSections.map(s => s.id);
      const invalidSections = sectionIds.filter(id => !userSectionIds.includes(id));

      if (invalidSections.length > 0) {
        return new NextResponse("Invalid section IDs", { status: 400 });
      }

      // Update section orders
      await prisma.$transaction(
        sections.map(({ id, order }) =>
          prisma.customSection.update({
            where: { id },
            data: { order },
          })
        )
      );

      return new NextResponse(null, { status: 204 });
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
    console.error("[SECTIONS_REORDER]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 