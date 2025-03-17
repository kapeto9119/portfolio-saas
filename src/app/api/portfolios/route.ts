import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/portfolios - Get all portfolios for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/portfolios - Create a new portfolio
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const data = await request.json();
    
    // Check if slug is already taken
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { 
        slug: data.slug,
        userId: user.id
      },
    });

    if (existingPortfolio) {
      return NextResponse.json(
        { error: "Slug already in use" },
        { status: 400 }
      );
    }

    // Make sure userId is explicitly set from the authenticated user
    const portfolio = await prisma.portfolio.create({
      data: {
        ...data,
        userId: user.id, // Ensure this is explicitly set
      },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/portfolios - Update a portfolio
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Portfolio ID is required" },
        { status: 400 }
      );
    }

    // Check if portfolio exists and belongs to user
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { 
        id,
        userId: user.id
      },
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: "Portfolio not found or not owned by user" },
        { status: 404 }
      );
    }

    // Check if new slug is already taken by another portfolio
    if (updateData.slug && updateData.slug !== existingPortfolio.slug) {
      const slugExists = await prisma.portfolio.findFirst({
        where: { 
          slug: updateData.slug,
          userId: user.id,
          id: { not: id }
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already in use" },
          { status: 400 }
        );
      }
    }

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolios - Delete a portfolio
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Portfolio ID is required" },
        { status: 400 }
      );
    }

    // Check if portfolio exists and belongs to user
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { 
        id,
        userId: user.id
      },
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: "Portfolio not found or not owned by user" },
        { status: 404 }
      );
    }

    await prisma.portfolio.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 