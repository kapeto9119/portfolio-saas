import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/p/[slug] - Get a public portfolio by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        slug: params.slug,
        isPublished: true,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Get related data for the portfolio
    const skills = await prisma.skill.findMany({
      where: {
        userId: portfolio.userId,
      },
      orderBy: {
        order: "asc",
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        userId: portfolio.userId,
      },
      orderBy: {
        order: "asc",
      },
    });

    const experiences = await prisma.experience.findMany({
      where: {
        userId: portfolio.userId,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    const educations = await prisma.education.findMany({
      where: {
        userId: portfolio.userId,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    const socials = await prisma.socialLink.findMany({
      where: {
        userId: portfolio.userId,
      },
    });

    // Combine all data
    const portfolioData = {
      ...portfolio,
      skills,
      projects,
      experiences,
      educations,
      socials,
    };

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 