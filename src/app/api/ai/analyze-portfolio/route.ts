import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { analyzePortfolio } from '@/lib/ai-service';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for portfolio analysis request
const analyzeRequestSchema = z.object({
  portfolioId: z.string().uuid()
});

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    
    try {
      const { portfolioId } = analyzeRequestSchema.parse(body);
      
      // Check if the portfolio exists and belongs to the user
      const portfolio = await prisma.portfolio.findUnique({
        where: {
          id: portfolioId,
          userId: session.user.id
        },
        include: {
          user: {
            select: {
              skills: true,
              projects: true,
              experiences: true,
              education: true,
              socialLinks: true,
            }
          }
        }
      });
      
      if (!portfolio) {
        return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
      }
      
      // Format the portfolio data for analysis
      const portfolioData = {
        title: portfolio.title,
        description: portfolio.description,
        skills: portfolio.user.skills,
        projects: portfolio.user.projects,
        experiences: portfolio.user.experiences,
        educations: portfolio.user.education,
        socialLinks: portfolio.user.socialLinks,
      };
      
      // Analyze the portfolio using AI service
      const suggestions = await analyzePortfolio(portfolioData);
      
      return NextResponse.json({ suggestions });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 