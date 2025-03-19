import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getLayoutClass } from "@/lib/theme";
import PortfolioDisplay from "./PortfolioDisplay";

// Portfolio page metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const portfolio = await prisma.portfolio.findFirst({
    where: { slug: params.slug },
    include: { user: true },
  });

  if (!portfolio) {
    return {
      title: "Portfolio Not Found",
    };
  }

  return {
    title: `${portfolio.title} - ${portfolio.user.name}`,
    description: portfolio.description,
  };
}

// Portfolio page component
export default async function PortfolioPage({ params }: { params: { slug: string } }) {
  const portfolio = await prisma.portfolio.findFirst({
    where: { slug: params.slug },
    include: {
      user: {
        include: {
          socialLinks: true,
          skills: true,
          experiences: {
            orderBy: { startDate: "desc" },
          },
          education: {
            orderBy: { startDate: "desc" },
          },
          projects: {
            orderBy: [
              { isFeatured: "desc" },
              { order: "asc" },
            ],
          },
        },
      },
      theme: true,
      testimonials: true,
      customSections: true,
      mediaItems: true,
      contactForm: true,
      digitalCard: true,
    },
  });

  if (!portfolio) {
    notFound();
  }

  const layoutClass = getLayoutClass(portfolio.theme?.layout || "grid");

  return <PortfolioDisplay portfolio={portfolio} layoutClass={layoutClass} />;
} 