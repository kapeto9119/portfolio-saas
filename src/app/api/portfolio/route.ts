import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for portfolio validation
const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  isPublished: z.boolean().optional().default(false),
  primaryColor: z.string().optional().nullable(),
  secondaryColor: z.string().optional().nullable(),
  fontFamily: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

// GET /api/portfolio - Get all portfolios for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/portfolio - Create a new portfolio
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    
    // Validate the request body
    const validationResult = portfolioSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Check if slug is already taken
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug: data.slug },
    });
    
    if (existingPortfolio) {
      return NextResponse.json(
        { error: 'Slug already in use' },
        { status: 400 }
      );
    }
    
    // Create the portfolio
    const portfolio = await prisma.portfolio.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });
    
    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/portfolio/:id - Update a portfolio
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
    }
    
    // Validate the request body
    const validationResult = portfolioSchema.partial().safeParse(data);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Check if the portfolio exists and belongs to the user
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id },
    });
    
    if (!existingPortfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }
    
    if (existingPortfolio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // If slug is being updated, check if it's already taken
    if (data.slug && data.slug !== existingPortfolio.slug) {
      const slugExists = await prisma.portfolio.findUnique({
        where: { slug: data.slug },
      });
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already in use' },
          { status: 400 }
        );
      }
    }
    
    // Update the portfolio
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id },
      data: validationResult.data,
    });
    
    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/portfolio/:id - Delete a portfolio
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
    }
    
    // Check if the portfolio exists and belongs to the user
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id },
    });
    
    if (!existingPortfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }
    
    if (existingPortfolio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Delete the portfolio
    await prisma.portfolio.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 