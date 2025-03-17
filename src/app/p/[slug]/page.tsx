import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Metadata, ResolvingMetadata } from 'next';
import { PortfolioView } from '@/components/portfolio/portfolio-view';

interface PortfolioPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: PortfolioPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch portfolio data
  const portfolio = await getPortfolioBySlug(params.slug);
  
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
      description: 'The requested portfolio could not be found.',
    };
  }
  
  // Use SEO fields if available, otherwise use defaults
  const title = portfolio.seoTitle || portfolio.title || 'Portfolio';
  const description = portfolio.seoDescription || portfolio.description || 'View my professional portfolio';
  
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
}

async function getPortfolioBySlug(slug: string) {
  try {
    // Increment view count
    const portfolio = await prisma.portfolio.update({
      where: {
        slug,
        isPublished: true,
      },
      data: {
        viewCount: {
          increment: 1,
        },
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
      return null;
    }

    // Get related data
    const skills = await prisma.skill.findMany({
      where: {
        userId: portfolio.userId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        userId: portfolio.userId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    const experiences = await prisma.experience.findMany({
      where: {
        userId: portfolio.userId,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    const educations = await prisma.education.findMany({
      where: {
        userId: portfolio.userId,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    const socials = await prisma.socialLink.findMany({
      where: {
        userId: portfolio.userId,
      },
    });

    return {
      ...portfolio,
      skills,
      projects,
      experiences,
      educations,
      socials,
    };
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const portfolio = await getPortfolioBySlug(params.slug);
  
  if (!portfolio) {
    notFound();
  }
  
  return <PortfolioView portfolio={portfolio} />;
} 