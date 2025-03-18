import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getLayoutClass } from "@/lib/theme";

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
          skills: {
            orderBy: { order: "asc" },
          },
          socialLinks: true,
        },
      },
      theme: true,
    },
  });

  if (!portfolio) {
    notFound();
  }

  // Get layout class based on theme
  const layoutClass = getLayoutClass(portfolio.theme?.layout || "grid");

  return (
    <>
      {/* Theme Style Tag */}
      <style jsx global>{`
        :root {
          --primary-color: ${portfolio.theme?.primaryColor || "#3b82f6"};
          --secondary-color: ${portfolio.theme?.secondaryColor || "#10b981"};
          --background-color: ${portfolio.theme?.backgroundColor || "#ffffff"};
          --font-family: ${portfolio.theme?.fontFamily || "Inter"};
        }

        body {
          font-family: var(--font-family), system-ui, sans-serif;
          background-color: var(--background-color);
          ${portfolio.theme?.backgroundImage ? `background-image: url(${portfolio.theme.backgroundImage});` : ""}
          ${portfolio.theme?.backgroundImage ? "background-size: cover;" : ""}
          ${portfolio.theme?.backgroundImage ? "background-position: center;" : ""}
        }

        .theme-primary {
          color: var(--primary-color);
        }

        .theme-secondary {
          color: var(--secondary-color);
        }

        .theme-bg-primary {
          background-color: var(--primary-color);
        }

        .theme-bg-secondary {
          background-color: var(--secondary-color);
        }

        .theme-border-primary {
          border-color: var(--primary-color);
        }

        .theme-border-secondary {
          border-color: var(--secondary-color);
        }

        ${portfolio.theme?.customCss || ""}
      `}</style>

      {/* Portfolio Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold theme-primary mb-2">{portfolio.title}</h1>
          {portfolio.subtitle && (
            <p className="text-xl theme-secondary mb-4">{portfolio.subtitle}</p>
          )}
          {portfolio.description && (
            <p className="text-lg max-w-2xl mx-auto">{portfolio.description}</p>
          )}
        </header>

        {/* User Info */}
        <section className="mb-12 text-center">
          {portfolio.user.image && (
            <img
              src={portfolio.user.image}
              alt={portfolio.user.name || ""}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 theme-border-primary"
            />
          )}
          <h2 className="text-2xl font-bold mb-2">{portfolio.user.name}</h2>
          {portfolio.user.job_title && (
            <p className="text-xl theme-secondary mb-2">{portfolio.user.job_title}</p>
          )}
          {portfolio.user.bio && (
            <p className="max-w-2xl mx-auto mb-4">{portfolio.user.bio}</p>
          )}
          {portfolio.user.location && (
            <p className="text-muted-foreground">{portfolio.user.location}</p>
          )}
        </section>

        {/* Social Links */}
        {portfolio.user.socialLinks.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-center gap-4">
              {portfolio.user.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:theme-primary transition-colors"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {portfolio.user.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Skills</h2>
            <div className={layoutClass}>
              {portfolio.user.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-lg border theme-border-primary"
                >
                  <h3 className="font-semibold mb-2">{skill.name}</h3>
                  {skill.category && (
                    <p className="text-sm text-muted-foreground">{skill.category}</p>
                  )}
                  {skill.proficiency && (
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full theme-bg-primary"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {portfolio.user.experiences.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Experience</h2>
            <div className={layoutClass}>
              {portfolio.user.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-lg border theme-border-primary"
                >
                  <h3 className="font-semibold mb-1">{exp.title}</h3>
                  <p className="text-muted-foreground mb-2">
                    {exp.company} • {exp.location}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(exp.startDate).toLocaleDateString()} -{" "}
                    {exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString()
                      : "Present"}
                  </p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {portfolio.user.education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Education</h2>
            <div className={layoutClass}>
              {portfolio.user.education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-lg border theme-border-primary"
                >
                  <h3 className="font-semibold mb-1">{edu.degree}</h3>
                  <p className="text-muted-foreground mb-2">
                    {edu.school} • {edu.location}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(edu.startDate).toLocaleDateString()} -{" "}
                    {edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString()
                      : "Present"}
                  </p>
                  <p className="text-sm">{edu.description}</p>
                  {edu.achievements.length > 0 && (
                    <ul className="mt-2 text-sm list-disc list-inside">
                      {edu.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {portfolio.user.projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Projects</h2>
            <div className={layoutClass}>
              {portfolio.user.projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-lg border theme-border-primary"
                >
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm mb-4">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded theme-bg-secondary text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm theme-primary hover:underline"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm theme-primary hover:underline"
                      >
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
} 