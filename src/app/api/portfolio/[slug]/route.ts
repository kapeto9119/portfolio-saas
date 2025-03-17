import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
    
    // Find the portfolio by slug
    const portfolio = await prisma.portfolio.findUnique({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            location: true,
            phone: true,
            website: true,
            job_title: true,
            experiences: {
              orderBy: {
                startDate: 'desc',
              },
            },
            education: {
              orderBy: {
                startDate: 'desc', 
              },
            },
            projects: {
              orderBy: [
                { isFeatured: 'desc' },
                { order: 'asc' },
              ],
            },
            skills: {
              orderBy: {
                order: 'asc',
              },
            },
            socialLinks: true,
          },
        },
      },
    });
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }
    
    // Increment view count
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { viewCount: { increment: 1 } },
    });
    
    // Restructure the data to maintain compatibility with the old format
    const restructuredPortfolio = {
      ...portfolio,
      projects: portfolio.user.projects,
      skills: portfolio.user.skills,
      experiences: portfolio.user.experiences,
      educations: portfolio.user.education,
      socialLinks: portfolio.user.socialLinks,
      testimonials: [] // Empty testimonials for now as we don't have this model yet
    };
    
    return NextResponse.json(restructuredPortfolio);
  } catch (error) {
    console.error('Error fetching portfolio by slug:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 