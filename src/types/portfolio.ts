/**
 * Core data models for the portfolio system
 * These types mirror the Prisma schema but include additional properties needed by the frontend
 */

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  job_title: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Experience {
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
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  current: boolean;
  achievements?: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
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
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  proficiency: number | null;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  isPublished: boolean;
  primaryColor: string | null;
  secondaryColor: string | null;
  fontFamily: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  viewCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface CombinedPortfolio extends Portfolio {
  user: User;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  socialLinks: SocialLink[];
  testimonials: Testimonial[];
} 