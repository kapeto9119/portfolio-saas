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

// Profile schema for validation
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  job_title: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().nullable(),
  github: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Apply rate limiting
    try {
      await limiter.check(10, session.user.email);
    } catch {
      return new NextResponse("Too many requests", { status: 429 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        image: true,
        bio: true,
        job_title: true,
        location: true,
        website: true,
        socialLinks: {
          select: {
            platform: true,
            url: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Transform social links into the expected format
    const socialLinks = user.socialLinks.reduce((acc, link) => {
      acc[link.platform.toLowerCase()] = link.url;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      ...user,
      github: socialLinks.github || null,
      twitter: socialLinks.twitter || null,
      linkedin: socialLinks.linkedin || null,
    });
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Apply rate limiting
    try {
      await limiter.check(5, session.user.email);
    } catch {
      return new NextResponse("Too many requests", { status: 429 });
    }

    const body = await req.json();
    
    // Validate profile data
    try {
      const validatedData = profileSchema.parse(body);
      const { github, twitter, linkedin, ...userData } = validatedData;

      // Update user data
      const user = await prisma.user.update({
        where: { email: session.user.email },
        data: userData,
      });

      // Update social links
      const socialLinksData = [
        { platform: 'GitHub', url: github },
        { platform: 'Twitter', url: twitter },
        { platform: 'LinkedIn', url: linkedin },
      ].filter(link => link.url) as { platform: string; url: string }[];

      // Delete existing social links
      await prisma.socialLink.deleteMany({
        where: {
          userId: session.user.id,
          platform: {
            in: socialLinksData.map(link => link.platform),
          },
        },
      });

      // Create new social links
      if (socialLinksData.length > 0) {
        await prisma.socialLink.createMany({
          data: socialLinksData.map(link => ({
            ...link,
            userId: session.user.id,
          })),
        });
      }

      // Fetch updated user data with social links
      const updatedUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          name: true,
          email: true,
          image: true,
          bio: true,
          job_title: true,
          location: true,
          website: true,
          socialLinks: {
            select: {
              platform: true,
              url: true,
            },
          },
        },
      });

      if (!updatedUser) {
        throw new Error("Failed to fetch updated user data");
      }

      // Transform social links into the expected format
      const socialLinks = updatedUser.socialLinks.reduce((acc, link) => {
        acc[link.platform.toLowerCase()] = link.url;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({
        ...updatedUser,
        github: socialLinks.github || null,
        twitter: socialLinks.twitter || null,
        linkedin: socialLinks.linkedin || null,
      });
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
    console.error("[PROFILE_PUT]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
} 