import { prisma } from '@/lib/db';
import slugify from '@/utils/slugify';
import { Portfolio, CombinedPortfolio } from '@/types/portfolio';

/**
 * Generate a URL-friendly slug from a title
 * @param title The title to convert to a slug
 * @param userId The user ID to ensure uniqueness
 * @param existingId Optional existing portfolio ID (for updates)
 */
export async function generateUniqueSlug(title: string, userId: string, existingId?: string): Promise<string> {
  // Create base slug from title
  let baseSlug = slugify(title);
  
  // Check if slug exists
  let slug = baseSlug;
  let counter = 0;
  let slugExists = true;
  
  while (slugExists) {
    // Try to find a portfolio with the same slug for this user
    const existing = await prisma.portfolio.findFirst({
      where: {
        slug,
        userId,
        ...(existingId ? { id: { not: existingId } } : {}),
      },
      select: { id: true },
    });
    
    if (!existing) {
      slugExists = false;
    } else {
      // Increment counter and append to slug
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }
  
  return slug;
}

/**
 * Get a portfolio by its slug
 * @param slug The portfolio slug
 * @param includeUnpublished Whether to include unpublished portfolios (default: false)
 */
export async function getPortfolioBySlug(
  slug: string, 
  includeUnpublished = false
): Promise<CombinedPortfolio | null> {
  // Try to find the portfolio by slug
  const portfolio = await prisma.portfolio.findFirst({
    where: {
      slug,
      ...(includeUnpublished ? {} : { isPublished: true }),
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
        },
      },
    },
  });
  
  // If portfolio not found, return null
  if (!portfolio) return null;
  
  // Fetch related data
  const [skills, projects, experiences, educations, socialLinks] = await Promise.all([
    prisma.skill.findMany({
      where: { userId: portfolio.userId },
      orderBy: { order: 'asc' },
    }),
    prisma.project.findMany({
      where: { userId: portfolio.userId },
      orderBy: [
        { isFeatured: 'desc' },
        { order: 'asc' },
      ],
    }),
    prisma.experience.findMany({
      where: { userId: portfolio.userId },
      orderBy: { startDate: 'desc' },
    }),
    prisma.education.findMany({
      where: { userId: portfolio.userId },
      orderBy: { startDate: 'desc' },
    }),
    prisma.socialLink.findMany({
      where: { userId: portfolio.userId },
    }),
  ]);
  
  // Increment view count if portfolio is published
  if (portfolio.isPublished) {
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { viewCount: { increment: 1 } },
    });
  }
  
  // Return combined data
  return {
    ...portfolio,
    projects,
    skills,
    experiences,
    educations,
    socialLinks,
    testimonials: [], // Empty testimonials for now as we don't have this model yet
  };
}

/**
 * Get a user's portfolios
 * @param userId The user ID
 */
export async function getUserPortfolios(userId: string): Promise<Portfolio[]> {
  return prisma.portfolio.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

/**
 * Check if a slug is available for a user
 * @param slug The slug to check
 * @param userId The user ID
 * @param existingId Optional existing portfolio ID (for updates)
 */
export async function isSlugAvailable(
  slug: string, 
  userId: string, 
  existingId?: string
): Promise<boolean> {
  const existing = await prisma.portfolio.findFirst({
    where: {
      slug,
      userId,
      ...(existingId ? { id: { not: existingId } } : {}),
    },
    select: { id: true },
  });
  
  return !existing;
} 