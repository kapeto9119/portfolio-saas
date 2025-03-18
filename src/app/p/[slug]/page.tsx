import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Metadata, ResolvingMetadata } from 'next';
import { PortfolioView } from '@/components/portfolio/portfolio-view';
import { Prisma } from '@prisma/client';

interface PortfolioPageProps {
  params: {
    slug: string;
  };
}

// Define the return type using Prisma's type system
type PrismaPortfolio = Prisma.PortfolioGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        email: true;
        image: true;
      };
    };
    theme: true;
  };
}> & {
  skills: Prisma.SkillGetPayload<{}>[];
  projects: Prisma.ProjectGetPayload<{}>[];
  experiences: Prisma.ExperienceGetPayload<{}>[];
  educations: Prisma.EducationGetPayload<{}>[];
  socialLinks: Prisma.SocialLinkGetPayload<{}>[];
  testimonials: Prisma.TestimonialGetPayload<{}>[];
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
};

export async function generateMetadata(
  { params }: PortfolioPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    // Fetch portfolio data
    const portfolio = await getPortfolioBySlug(params.slug);
    
    if (!portfolio) {
      return {
        title: 'Portfolio Not Found',
        description: 'The requested portfolio could not be found.',
      };
    }
    
    // Use SEO fields if available, otherwise use defaults
    const title = portfolio.title || 'Portfolio';
    const description = portfolio.description || 'View my professional portfolio';
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/p/${params.slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (error) {
    return {
      title: 'Error',
      description: 'An error occurred while loading the portfolio.',
    };
  }
}

async function getPortfolioBySlug(slug: string): Promise<PrismaPortfolio | null> {
  try {
    // Find portfolio first
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        slug,
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
        theme: true,
      },
    });

    if (!portfolio) {
      return null;
    }

    // Get related data
    const [skills, projects, experiences, educations, socialLinks, testimonials] = await Promise.all([
      prisma.skill.findMany({
        where: {
          userId: portfolio.userId,
        },
        orderBy: {
          order: 'asc',
        },
      }),
      prisma.project.findMany({
        where: {
          userId: portfolio.userId,
        },
        orderBy: {
          order: 'asc',
        },
      }),
      prisma.experience.findMany({
        where: {
          userId: portfolio.userId,
        },
        orderBy: {
          startDate: 'desc',
        },
      }),
      prisma.education.findMany({
        where: {
          userId: portfolio.userId,
        },
        orderBy: {
          startDate: 'desc',
        },
      }),
      prisma.socialLink.findMany({
        where: {
          userId: portfolio.userId,
        },
      }),
      prisma.testimonial.findMany({
        where: {
          portfolioId: portfolio.id,
          isPublished: true,
        },
        orderBy: {
          order: 'asc',
        },
      }),
    ]);

    // Update view count in a separate query
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    // Return portfolio with theme properties and defaults
    return {
      ...portfolio,
      skills,
      projects,
      experiences,
      educations,
      socialLinks,
      testimonials,
      primaryColor: portfolio.theme?.primaryColor || '#3b82f6',
      secondaryColor: portfolio.theme?.secondaryColor || '#10b981',
      fontFamily: portfolio.theme?.fontFamily || 'Inter',
    };
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const prismaPortfolio = await getPortfolioBySlug(params.slug);
  
  if (!prismaPortfolio) {
    notFound();
  }

  // Transform dates to strings and rename socialLinks to socials
  const portfolio = {
    ...prismaPortfolio,
    experiences: prismaPortfolio.experiences.map(exp => ({
      ...exp,
      startDate: exp.startDate.toISOString(),
      endDate: exp.endDate?.toISOString() || null,
    })),
    educations: prismaPortfolio.educations.map(edu => ({
      ...edu,
      startDate: edu.startDate.toISOString(),
      endDate: edu.endDate?.toISOString() || null,
    })),
    socials: prismaPortfolio.socialLinks,
  };
  
  return <PortfolioView portfolio={portfolio} />;
} 