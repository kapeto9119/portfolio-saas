import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import rateLimit from "@/lib/rate-limit";

// Initialize rate limiter
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Apply rate limiting
    try {
      await limiter.check(5, session.user.email); // 5 deletes per minute
    } catch {
      return new NextResponse("Too many requests", { status: 429 });
    }

    // Get user's portfolio
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: session.user.id },
      include: {
        customSections: {
          where: { id: params.id },
        },
      },
    });

    if (!portfolio) {
      return new NextResponse("Portfolio not found", { status: 404 });
    }

    // Check if section exists and belongs to user
    if (portfolio.customSections.length === 0) {
      return new NextResponse("Section not found", { status: 404 });
    }

    // Delete section
    await prisma.customSection.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[SECTION_DELETE]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 