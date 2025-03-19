"use client";

import React from 'react';
import { formatDateRange } from '@/lib/utils/date';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Github, 
  Globe, 
  Linkedin, 
  Twitter, 
  Instagram,
  Facebook,
  Youtube,
  ExternalLink
} from 'lucide-react';

interface PortfolioDisplayProps {
  portfolio: any;
  layoutClass: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const getSocialIcon = (platform: string) => {
  const iconProps = { className: "h-5 w-5" };
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github {...iconProps} />;
    case 'linkedin':
      return <Linkedin {...iconProps} />;
    case 'twitter':
      return <Twitter {...iconProps} />;
    case 'instagram':
      return <Instagram {...iconProps} />;
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'youtube':
      return <Youtube {...iconProps} />;
    default:
      return <Globe {...iconProps} />;
  }
};

export default function PortfolioDisplay({ portfolio, layoutClass }: PortfolioDisplayProps) {
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

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        ${portfolio.theme?.customCss || ""}
      `}</style>

      {/* Portfolio Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold theme-primary mb-4 tracking-tight">
            {portfolio.title}
          </h1>
          {portfolio.subtitle && (
            <p className="text-xl md:text-2xl theme-secondary mb-6 font-light">
              {portfolio.subtitle}
            </p>
          )}
          {portfolio.description && (
            <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
              {portfolio.description}
            </p>
          )}
        </motion.header>

        {/* User Info */}
        <motion.section 
          className="mb-16 text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {portfolio.user.image && (
            <motion.div variants={item}>
              <img
                src={portfolio.user.image}
                alt={portfolio.user.name || ""}
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 theme-border-primary shadow-xl"
              />
            </motion.div>
          )}
          <motion.h2 variants={item} className="text-3xl font-bold mb-3">
            {portfolio.user.name}
          </motion.h2>
          {portfolio.user.job_title && (
            <motion.p variants={item} className="text-xl theme-secondary mb-3">
              {portfolio.user.job_title}
            </motion.p>
          )}
          {portfolio.user.bio && (
            <motion.p variants={item} className="max-w-2xl mx-auto mb-4 text-muted-foreground">
              {portfolio.user.bio}
            </motion.p>
          )}
          {portfolio.user.location && (
            <motion.p variants={item} className="text-muted-foreground">
              {portfolio.user.location}
            </motion.p>
          )}
        </motion.section>

        {/* Social Links */}
        {portfolio.user.socialLinks && portfolio.user.socialLinks.length > 0 && (
          <motion.section 
            className="mb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <div className="flex justify-center gap-4">
              {portfolio.user.socialLinks.map((link: any) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full theme-bg-primary hover:opacity-90 transition-opacity text-white"
                  variants={item}
                >
                  {getSocialIcon(link.platform)}
                </motion.a>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills */}
        {portfolio.user.skills && portfolio.user.skills.length > 0 && (
          <motion.section 
            className="mb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-3xl font-bold text-center mb-8 theme-primary">Skills</h2>
            <div className={`${layoutClass} gap-6`}>
              {portfolio.user.skills.map((skill: any) => (
                <motion.div
                  key={skill.id}
                  className="glass-card p-6 rounded-xl"
                  variants={item}
                >
                  <h3 className="font-semibold text-xl mb-3">{skill.name}</h3>
                  {skill.category && (
                    <p className="text-sm text-muted-foreground mb-3">{skill.category}</p>
                  )}
                  {skill.proficiency && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full theme-bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.proficiency}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-sm text-right mt-1 text-muted-foreground">
                        {skill.proficiency}%
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience */}
        {portfolio.user.experiences && portfolio.user.experiences.length > 0 && (
          <motion.section 
            className="mb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-3xl font-bold text-center mb-8 theme-primary">Experience</h2>
            <div className={`${layoutClass} gap-6`}>
              {portfolio.user.experiences.map((exp: any) => (
                <motion.div
                  key={exp.id}
                  className="glass-card p-6 rounded-xl relative"
                  variants={item}
                >
                  <div className="absolute top-0 left-0 w-2 h-full theme-bg-primary rounded-l-xl"/>
                  <h3 className="font-semibold text-xl mb-2">{exp.title}</h3>
                  <p className="text-lg mb-2 theme-secondary">{exp.company}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatDateRange(exp.startDate, exp.endDate)}
                  </p>
                  {exp.location && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {exp.location}
                    </p>
                  )}
                  <p className="text-muted-foreground">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education */}
        {portfolio.user.education && portfolio.user.education.length > 0 && (
          <motion.section 
            className="mb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-3xl font-bold text-center mb-8 theme-primary">Education</h2>
            <div className={`${layoutClass} gap-6`}>
              {portfolio.user.education.map((edu: any) => (
                <motion.div
                  key={edu.id}
                  className="glass-card p-6 rounded-xl relative"
                  variants={item}
                >
                  <div className="absolute top-0 left-0 w-2 h-full theme-bg-secondary rounded-l-xl"/>
                  <h3 className="font-semibold text-xl mb-2">{edu.degree}</h3>
                  <p className="text-lg mb-2 theme-secondary">{edu.school}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </p>
                  {edu.location && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {edu.location}
                    </p>
                  )}
                  <p className="text-muted-foreground mb-3">{edu.description}</p>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {edu.achievements.map((achievement: string, index: number) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <motion.section 
            className="mb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-3xl font-bold text-center mb-8 theme-primary">Projects</h2>
            <div className={`${layoutClass} gap-6`}>
              {portfolio.projects.map((project: any) => (
                <motion.div
                  key={project.id}
                  className="glass-card rounded-xl overflow-hidden"
                  variants={item}
                >
                  {project.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-xl">{project.title}</h3>
                      {project.isFeatured && (
                        <Badge className="theme-bg-secondary">Featured</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech: string, index: number) => (
                          <Badge key={index} variant="outline" className="theme-border-primary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="theme-border-primary hover:theme-bg-primary hover:text-white"
                          asChild
                        >
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Globe className="h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="theme-border-secondary hover:theme-bg-secondary hover:text-white"
                          asChild
                        >
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Github className="h-4 w-4" />
                            Source Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </>
  );
} 