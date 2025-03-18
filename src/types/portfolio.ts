/**
 * Core data models for the portfolio system
 * These types mirror the Prisma schema but include additional properties needed by the frontend
 */

import { Prisma } from '@prisma/client';

// Base types that match Prisma schema
export type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  job_title: string | null;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  current: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  current: boolean;
  achievements: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  technologies: string[];
  isFeatured: boolean;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Skill = {
  id: string;
  name: string;
  category: string | null;
  proficiency: number | null;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PortfolioTheme = {
  id: string;
  portfolioId: string;
  layout: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  backgroundColor: string;
  backgroundImage: string | null;
  customCss: string | null;
};

export type Testimonial = {
  id: string;
  portfolioId: string;
  name: string;
  title: string | null;
  content: string;
  rating: number | undefined;
  imageUrl: string | null;
  videoUrl: string | null;
  order: number;
  isPublished: boolean;
};

// Base Portfolio type
export type Portfolio = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  isPublished: boolean;
  viewCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  // Theme properties at the top level for convenience
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  // SEO fields
  seoTitle: string;
  seoDescription: string;
};

// Extended Portfolio type with all relations
export type CombinedPortfolio = Portfolio & {
  user: User;
  theme: PortfolioTheme | null;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  socialLinks: SocialLink[];
  testimonials: Testimonial[];
};

// Prisma query types for type safety
export type PortfolioWithTheme = Prisma.PortfolioGetPayload<{
  include: {
    theme: true;
  };
}>;

export type PortfolioWithRelations = Prisma.PortfolioGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
        bio: true;
        location: true;
        phone: true;
        website: true;
        job_title: true;
      };
    };
    theme: true;
    projects: true;
    skills: true;
    experiences: true;
    educations: true;
    socialLinks: true;
    testimonials: true;
  };
}>; 