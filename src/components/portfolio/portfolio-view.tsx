'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  GraduationCap, 
  Code, 
  User, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Github,
  Mail,
  Link as LinkIcon,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Dribbble,
  Figma,
  Globe
} from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  fontFamily: string | null;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  socials: SocialLink[];
}

interface Skill {
  id: string;
  name: string;
  category: string | null;
  proficiency: number | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  technologies: string[];
  isFeatured: boolean;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  current: boolean;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  current: boolean;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface PortfolioViewProps {
  portfolio: Portfolio;
}

export function PortfolioView({ portfolio }: PortfolioViewProps) {
  const [activeTab, setActiveTab] = useState('about');
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };
  
  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "h-5 w-5" };
    
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'twitter':
      case 'x':
        return <Twitter {...iconProps} />;
      case 'github':
        return <Github {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'dribbble':
        return <Dribbble {...iconProps} />;
      case 'figma':
        return <Figma {...iconProps} />;
      default:
        return <Globe {...iconProps} />;
    }
  };
  
  // Group skills by category
  const skillsByCategory = portfolio.skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
  
  // Custom styles based on portfolio settings
  const customStyles = {
    '--primary-color': portfolio.primaryColor || '#3b82f6',
    '--secondary-color': portfolio.secondaryColor || '#10b981',
    '--font-family': portfolio.fontFamily || 'Inter, sans-serif',
  } as React.CSSProperties;
  
  return (
    <div style={customStyles} className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {portfolio.user.image && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image 
                  src={portfolio.user.image} 
                  alt={portfolio.user.name || 'Profile'} 
                  width={128} 
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold">{portfolio.title}</h1>
              {portfolio.subtitle && (
                <p className="text-xl mt-2 opacity-90">{portfolio.subtitle}</p>
              )}
              {portfolio.user.name && (
                <p className="text-lg mt-1 opacity-80">{portfolio.user.name}</p>
              )}
              
              {/* Social Links */}
              {portfolio.socials.length > 0 && (
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  {portfolio.socials.map((social) => (
                    <a 
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                      aria-label={social.platform}
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs 
          defaultValue="about" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          
          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.description ? (
                  <div className="prose max-w-none dark:prose-invert">
                    {portfolio.description}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No description provided.</p>
                )}
              </CardContent>
            </Card>
            
            {/* Education Section */}
            {portfolio.educations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" /> Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {portfolio.educations.map((education) => (
                      <div key={education.id} className="border-l-2 pl-4 pb-2 border-[var(--primary-color)]">
                        <h3 className="text-xl font-semibold">{education.degree}</h3>
                        <h4 className="text-lg">{education.school}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(education.startDate)} - {education.current ? 'Present' : education.endDate ? formatDate(education.endDate) : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{education.location}</span>
                        </div>
                        {education.description && (
                          <p className="mt-2">{education.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.experiences.length === 0 ? (
                  <p className="text-muted-foreground">No experience entries found.</p>
                ) : (
                  <div className="space-y-8">
                    {portfolio.experiences.map((experience) => (
                      <div key={experience.id} className="border-l-2 pl-4 pb-2 border-[var(--primary-color)]">
                        <h3 className="text-xl font-semibold">{experience.title}</h3>
                        <h4 className="text-lg">{experience.company}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(experience.startDate)} - {experience.current ? 'Present' : experience.endDate ? formatDate(experience.endDate) : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{experience.location}</span>
                        </div>
                        <p className="mt-2">{experience.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" /> Projects
                </CardTitle>
                <CardDescription>
                  Showcasing my work and contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio.projects.length === 0 ? (
                  <p className="text-muted-foreground">No projects found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolio.projects.map((project) => (
                      <Card key={project.id}>
                        {project.imageUrl && (
                          <div className="aspect-video w-full overflow-hidden">
                            <Image
                              src={project.imageUrl}
                              alt={project.title}
                              width={600}
                              height={340}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{project.title}</CardTitle>
                            {project.isFeatured && (
                              <Badge>Featured</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline">{tech}</Badge>
                            ))}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{project.description}</p>
                          
                          <div className="flex gap-3 mt-4">
                            {project.liveUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" /> Live Demo
                                </Link>
                              </Button>
                            )}
                            {project.repoUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-4 w-4 mr-2" /> Repository
                                </Link>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" /> Skills & Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.skills.length === 0 ? (
                  <p className="text-muted-foreground">No skills found.</p>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(skillsByCategory).map(([category, skills]) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold mb-3">{category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <div 
                              key={skill.id}
                              className="relative"
                            >
                              <Badge 
                                variant="secondary"
                                className="py-1.5 px-3 text-sm"
                              >
                                {skill.name}
                                {skill.proficiency !== null && (
                                  <span className="ml-2 text-xs opacity-70">
                                    {skill.proficiency}%
                                  </span>
                                )}
                              </Badge>
                              {skill.proficiency !== null && (
                                <div className="w-full h-1 bg-muted rounded-full mt-1 overflow-hidden">
                                  <div 
                                    className="h-full bg-[var(--primary-color)]" 
                                    style={{ width: `${skill.proficiency}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} {portfolio.user.name || portfolio.title}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Built with Portfolio SaaS
          </p>
        </div>
      </footer>
    </div>
  );
} 