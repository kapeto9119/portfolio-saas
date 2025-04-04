import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { generateUniqueSlug, isSlugAvailable } from '@/lib/portfolio-service';

/**
 * Schema for portfolio validation
 * Defines the structure and validation rules for portfolio data
 */
const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  subtitle: z.string().max(200, 'Subtitle must be 200 characters or less').optional().nullable(),
  description: z.string().max(5000, 'Description must be 5000 characters or less').optional().nullable(),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be 100 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  isPublished: z.boolean().optional().default(false),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional().nullable(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional().nullable(),
  fontFamily: z.string().max(50, 'Font family name is too long').optional().nullable(),
  seoTitle: z.string().max(70, 'SEO title must be 70 characters or less').optional().nullable(),
  seoDescription: z.string().max(160, 'SEO description must be 160 characters or less').optional().nullable(),
});

/**
 * Error handler helper function
 */
function handleError(error: unknown, message = 'Internal server error') {
  console.error(`Portfolio API error: ${message}`, error);
  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

/**
 * GET /api/portfolio - Get all portfolios for the current user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      }
    });
    
    return NextResponse.json(portfolios);
  } catch (error) {
    return handleError(error, 'Error fetching portfolios');
  }
}

/**
 * POST /api/portfolio - Create a new portfolio
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Get and parse request body
    const body = await req.json();
    
    // Extract theme properties from body
    const { primaryColor, secondaryColor, fontFamily, ...portfolioData } = body;
    
    // Validate the request body
    const validationResult = portfolioSchema.safeParse(portfolioData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Check if slug is already taken for this user
    const slugAvailable = await isSlugAvailable(data.slug, session.user.id);
    
    if (!slugAvailable) {
      // Try to generate a unique slug if title is provided
      if (data.title) {
        data.slug = await generateUniqueSlug(data.title, session.user.id);
      } else {
        return NextResponse.json(
          { error: 'This slug is already in use. Please choose another.' },
          { status: 400 }
        );
      }
    }
    
    // Create the portfolio and theme in a transaction
    const portfolio = await prisma.$transaction(async (tx) => {
      // Create the portfolio
      const portfolio = await tx.portfolio.create({
        data: {
          ...data,
          userId: session.user.id,
        },
      });

      // Create the theme
      await tx.portfolioTheme.create({
        data: {
          portfolioId: portfolio.id,
          primaryColor: primaryColor || '#3b82f6',
          secondaryColor: secondaryColor || '#10b981',
          fontFamily: fontFamily || 'Inter',
          layout: 'grid',
          backgroundColor: '#ffffff',
        },
      });

      return portfolio;
    });
    
    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    return handleError(error, 'Error creating portfolio');
  }
}

/**
 * PUT /api/portfolio/:id - Update a portfolio
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Get and parse request body
    const body = await req.json();
    const { id, primaryColor, secondaryColor, fontFamily, ...data } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }
    
    // Validate the request body (partial validation for updates)
    const validationResult = portfolioSchema.partial().safeParse(data);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    // Check if the portfolio exists and belongs to the user
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id },
      select: { userId: true, slug: true } // Only get necessary fields
    });
    
    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    if (existingPortfolio.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this portfolio' },
        { status: 403 }
      );
    }
    
    // If slug is being updated, check if it's already taken
    if (data.slug && data.slug !== existingPortfolio.slug) {
      const slugAvailable = await isSlugAvailable(data.slug, session.user.id, id);
      
      if (!slugAvailable) {
        // Try to generate a unique slug if title is provided
        if (data.title) {
          data.slug = await generateUniqueSlug(data.title, session.user.id, id);
        } else {
          return NextResponse.json(
            { error: 'This slug is already in use. Please choose another.' },
            { status: 400 }
          );
        }
      }
    }
    
    // Update the portfolio and theme in a transaction
    const updatedPortfolio = await prisma.$transaction(async (tx) => {
      // Update the portfolio
      const portfolio = await tx.portfolio.update({
        where: { id },
        data: validationResult.data,
        include: { theme: true }
      });

      // Update or create the theme
      if (primaryColor || secondaryColor || fontFamily) {
        await tx.portfolioTheme.upsert({
          where: { portfolioId: portfolio.id },
          create: {
            portfolioId: portfolio.id,
            primaryColor: primaryColor || '#3b82f6',
            secondaryColor: secondaryColor || '#10b981',
            fontFamily: fontFamily || 'Inter',
            layout: 'grid',
            backgroundColor: '#ffffff',
          },
          update: {
            ...(primaryColor && { primaryColor }),
            ...(secondaryColor && { secondaryColor }),
            ...(fontFamily && { fontFamily }),
          },
        });
      }

      return portfolio;
    });
    
    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    return handleError(error, 'Error updating portfolio');
  }
}

/**
 * DELETE /api/portfolio/:id - Delete a portfolio
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the portfolio exists and belongs to the user
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id },
      select: { userId: true } // Only get the userId for checking ownership
    });
    
    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    if (existingPortfolio.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this portfolio' },
        { status: 403 }
      );
    }
    
    // Delete the portfolio
    await prisma.portfolio.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true, message: 'Portfolio deleted successfully' });
  } catch (error) {
    return handleError(error, 'Error deleting portfolio');
  }
} 