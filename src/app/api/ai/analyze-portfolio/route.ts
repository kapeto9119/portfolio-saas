import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { analyzePortfolio } from '@/lib/ai-service';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { AI_ROLES, generateAIResponse } from "@/lib/ai/openai";
import type { PortfolioAnalysis } from "@/features/ai/types";

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
      
      // Generate portfolio analysis
      const response = await generateAIResponse(
        AI_ROLES.PORTFOLIO_ANALYZER,
        `Please analyze this developer's portfolio:

Projects:
${portfolio.user.projects.map(p => `
Title: ${p.title}
Description: ${p.description}
Technologies: ${p.technologies.join(", ")}
`).join("\n")}

Skills: ${portfolio.user.skills.join(", ")}
Experience: ${portfolio.user.experiences.map(e => e.title).join(", ")}

Please provide a structured analysis with:
1. Key strengths (list)
2. Areas for improvement (list)
3. Market fit score (0-100) with explanation
4. Specific recommendations with priority levels (high/medium/low)

Format the response in clear sections for parsing.`,
        {
          model: "GPT4",
          temperature: 0.7,
          max_tokens: 1500,
        }
      );

      // Parse the response into structured data
      const sections = response.split("\n\n");
      let strengths: string[] = [];
      let improvements: string[] = [];
      let marketFit = {
        score: 0,
        explanation: "",
      };
      let recommendations: PortfolioAnalysis["recommendations"] = [];

      for (const section of sections) {
        if (section.startsWith("Strengths:")) {
          strengths = section
            .replace("Strengths:", "")
            .split("\n")
            .filter(Boolean)
            .map(s => s.replace(/^-\s*/, "").trim());
        } else if (section.startsWith("Areas for Improvement:")) {
          improvements = section
            .replace("Areas for Improvement:", "")
            .split("\n")
            .filter(Boolean)
            .map(s => s.replace(/^-\s*/, "").trim());
        } else if (section.startsWith("Market Fit:")) {
          const [scoreText, ...explanation] = section
            .replace("Market Fit:", "")
            .split("\n")
            .filter(Boolean);
          
          const scoreMatch = scoreText.match(/(\d+)/);
          marketFit = {
            score: scoreMatch ? parseInt(scoreMatch[1], 10) : 0,
            explanation: explanation.join(" ").trim(),
          };
        } else if (section.startsWith("Recommendations:")) {
          recommendations = section
            .replace("Recommendations:", "")
            .split("\n")
            .filter(Boolean)
            .map(r => {
              const priorityMatch = r.match(/\[(high|medium|low)\]/i);
              const titleMatch = r.match(/^[^:]+:/);
              
              if (!titleMatch) return null;
              
              const title = titleMatch[0].replace(":", "").replace(/\[[^\]]+\]/, "").trim();
              const description = r.slice(titleMatch[0].length).trim();
              const priority = (priorityMatch?.[1].toLowerCase() ?? "medium") as "high" | "medium" | "low";
              
              return { title, description, priority };
            })
            .filter((r): r is NonNullable<typeof r> => r !== null);
        }
      }

      const analysis: PortfolioAnalysis = {
        strengths,
        improvements,
        marketFit,
        recommendations,
      };

      return NextResponse.json({ suggestions, analysis });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 