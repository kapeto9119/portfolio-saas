import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { getPortfolioBySlug } from '@/lib/portfolio-service';

// GET /api/portfolio/[slug] - Get a portfolio by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Use the portfolio service to get the portfolio with all related data
    const portfolio = await getPortfolioBySlug(slug);
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio by slug:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 