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
  
  // Get the user's primary portfolio
  const portfolio = await prisma.portfolio.findFirst({
    where: { userId: user.id },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      isPublished: true,
      theme: true,
      customDomain: true,
      seoTitle: true,
      seoDescription: true,
      primaryColor: true,
      secondaryColor: true,
      fontFamily: true,
      viewCount: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return portfolio;
} 