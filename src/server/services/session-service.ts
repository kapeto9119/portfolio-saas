"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Get the current user session
 */
export async function getSession() {
  return await auth();
}

/**
 * Get the current user information
 */
export async function getUser() {
  const session = await getSession();
  
  if (!session?.user?.email) {
    return null;
  }
  
  // Get the full user record from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
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
      theme: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Get the current user's portfolio
 */
export async function getUserPortfolio() {
  const user = await getUser();
  
  if (!user) {
    return null;
  }
  
  // Get the user's primary portfolio with theme
  const portfolio = await prisma.portfolio.findFirst({
    where: { userId: user.id },
    include: {
      theme: true,
    },
  });

  if (!portfolio) {
    return null;
  }

  // Map the portfolio data to include theme properties
  return {
    id: portfolio.id,
    slug: portfolio.slug,
    title: portfolio.title,
    description: portfolio.description,
    isPublished: portfolio.isPublished,
    viewCount: portfolio.viewCount,
    createdAt: portfolio.createdAt,
    updatedAt: portfolio.updatedAt,
    // Theme properties with defaults
    primaryColor: portfolio.theme?.primaryColor ?? '#3b82f6',
    secondaryColor: portfolio.theme?.secondaryColor ?? '#10b981',
    fontFamily: portfolio.theme?.fontFamily ?? 'Inter',
  };
} 