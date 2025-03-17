import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Briefcase, 
  Github, 
  Globe, 
  Mail, 
  MapPin, 
  Phone,
  ExternalLink,
  Calendar,
  GraduationCap,
  Building,
  Star,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

// Import shared types and services
import { Education, Experience, Project, Skill, SocialLink, CombinedPortfolio } from '@/types/portfolio';
import { getPortfolioBySlug } from '@/lib/portfolio-service';

interface PortfolioPageProps {
  params: {
    username: string;
  };
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { username } = params;
  
  // Fetch portfolio data for metadata
  const portfolio = await getPortfolioBySlug(username);
  
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
      description: 'The requested portfolio could not be found.',
    };
  }
  
  return {
    title: portfolio.seoTitle || `${portfolio.user.name}'s Portfolio`,
    description: portfolio.seoDescription || `Professional portfolio of ${portfolio.user.name}, ${portfolio.user.job_title || 'Professional'}`,
    openGraph: {
      title: portfolio.seoTitle || `${portfolio.user.name}'s Portfolio`,
      description: portfolio.seoDescription || `Professional portfolio of ${portfolio.user.name}, ${portfolio.user.job_title || 'Professional'}`,
    },
  };
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = params;
  const portfolio = await getPortfolioBySlug(username);
  
  // If portfolio doesn't exist or is not published, return 404
  if (!portfolio) {
    notFound();
  }
  
  // Group skills by category
  const skillsByCategory = portfolio.skills.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
  
  // Custom styles based on portfolio settings
  const customStyles = {
    primaryColor: portfolio.primaryColor || '#3b82f6',
    secondaryColor: portfolio.secondaryColor || '#10b981',
    fontFamily: portfolio.fontFamily || 'Inter',
  };
  
  return (
    <div 
      className="min-h-screen bg-background" 
      style={{ fontFamily: customStyles.fontFamily }}
    >
      {/* Header */}
      <header 
        className="relative py-20 px-4 text-white"
        style={{ 
          backgroundColor: customStyles.primaryColor,
          backgroundImage: `linear-gradient(135deg, ${customStyles.primaryColor}, ${customStyles.secondaryColor})` 
        }}
      >
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {portfolio.user.image && (
              <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-white shadow-lg">
                <Image
                  src={portfolio.user.image}
                  alt={portfolio.user.name || 'Profile picture'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            
            <div className="text-center md:text-left space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">{portfolio.user.name}</h1>
              <h2 className="text-xl md:text-2xl font-medium opacity-90">{portfolio.user.job_title}</h2>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                {portfolio.user.location && (
                  <span className="flex items-center gap-1 text-sm md:text-base">
                    <MapPin className="w-4 h-4" />
                    {portfolio.user.location}
                  </span>
                )}
                
                {portfolio.user.email && (
                  <a 
                    href={`mailto:${portfolio.user.email}`}
                    className="flex items-center gap-1 text-sm md:text-base hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    {portfolio.user.email}
                  </a>
                )}
                
                {portfolio.user.phone && (
                  <a 
                    href={`tel:${portfolio.user.phone}`}
                    className="flex items-center gap-1 text-sm md:text-base hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {portfolio.user.phone}
                  </a>
                )}
                
                {portfolio.user.website && (
                  <a 
                    href={portfolio.user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm md:text-base hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    {new URL(portfolio.user.website).hostname}
                  </a>
                )}
              </div>
              
              <div className="flex justify-center md:justify-start gap-2 mt-4">
                {portfolio.socialLinks.map((link: SocialLink) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                    title={link.platform}
                  >
                    {link.platform.toLowerCase() === 'github' ? <Github className="w-5 h-5" /> : 
                     link.platform.toLowerCase() === 'linkedin' ? 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> : 
                     link.platform.toLowerCase() === 'twitter' ? 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg> : 
                     <Globe className="w-5 h-5" />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto max-w-5xl px-4 py-12">
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-wrap gap-1">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            {portfolio.skills.length > 0 && <TabsTrigger value="skills">Skills</TabsTrigger>}
            {portfolio.experiences.length > 0 && <TabsTrigger value="experience">Experience</TabsTrigger>}
            {portfolio.educations.length > 0 && <TabsTrigger value="education">Education</TabsTrigger>}
            {portfolio.testimonials.length > 0 && <TabsTrigger value="testimonials">Testimonials</TabsTrigger>}
          </TabsList>
          
          {/* About Section */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>
                  Professional overview and background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {portfolio.user.bio ? (
                    <p className="whitespace-pre-wrap">{portfolio.user.bio}</p>
                  ) : (
                    <p className="text-muted-foreground">No bio information available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {portfolio.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{portfolio.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.user.email && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href={`mailto:${portfolio.user.email}`} className="font-medium hover:underline">
                          {portfolio.user.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {portfolio.user.phone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a href={`tel:${portfolio.user.phone}`} className="font-medium hover:underline">
                          {portfolio.user.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {portfolio.user.location && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{portfolio.user.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {portfolio.user.website && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a 
                          href={portfolio.user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline"
                        >
                          {new URL(portfolio.user.website).hostname}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Projects Section */}
          <TabsContent value="projects" className="space-y-6">
            {portfolio.projects.filter(project => project.isFeatured).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Featured Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio.projects
                    .filter(project => project.isFeatured)
                    .map((project) => (
                      <Card key={project.id} className="overflow-hidden flex flex-col h-full">
                        {project.imageUrl && (
                          <div className="relative h-56 w-full">
                            <Image
                              src={project.imageUrl}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle>{project.title}</CardTitle>
                          {project.technologies && (
                            <CardDescription>
                              {project.technologies.join(', ')}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="flex-grow">
                          {project.description && (
                            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                          )}
                        </CardContent>
                        <div className="px-6 pb-6 flex flex-wrap gap-2">
                          {project.liveUrl && (
                            <ButtonLink 
                              href={project.liveUrl || ''} 
                              external
                              variant="default" 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Globe className="h-4 w-4" />
                              Live Demo
                            </ButtonLink>
                          )}
                          {project.repoUrl && (
                            <ButtonLink 
                              href={project.repoUrl || ''} 
                              external
                              variant="secondary" 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Github className="h-4 w-4" />
                              Source Code
                            </ButtonLink>
                          )}
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            )}
            
            {portfolio.projects.filter(project => !project.isFeatured).length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">All Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {portfolio.projects
                    .filter(project => !project.isFeatured)
                    .map((project) => (
                      <Card key={project.id} className="overflow-hidden flex flex-col h-full">
                        {project.imageUrl && (
                          <div className="relative h-40 w-full">
                            <Image
                              src={project.imageUrl}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          {project.technologies && (
                            <CardDescription className="text-xs">
                              {project.technologies.join(', ')}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="flex-grow pt-0">
                          {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                          )}
                        </CardContent>
                        <div className="px-6 pb-6 flex flex-wrap gap-2">
                          {project.liveUrl && (
                            <ButtonLink 
                              href={project.liveUrl || ''} 
                              external
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Demo
                            </ButtonLink>
                          )}
                          {project.repoUrl && (
                            <ButtonLink 
                              href={project.repoUrl || ''} 
                              external
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Code className="h-3 w-3" />
                              Code
                            </ButtonLink>
                          )}
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            )}
            
            {portfolio.projects.length === 0 && (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No projects to display.
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Skills Section */}
          <TabsContent value="skills" className="space-y-6">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{skill.name}</h4>
                          {skill.proficiency && skill.proficiency > 0 && (
                            <div className="w-full bg-secondary h-2 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full" 
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          {/* Experience Section */}
          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>My professional journey and career achievements.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-l border-border pl-8 ml-4">
                  {portfolio.experiences.map((experience) => (
                    <div key={experience.id} className="mb-8 relative">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background"></div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{experience.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(experience.startDate)} - {experience.current ? 'Present' : experience.endDate ? formatDate(experience.endDate) : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{experience.company}</span>
                        {experience.location && (
                          <>
                            <span className="text-muted-foreground mx-1">•</span>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{experience.location}</span>
                          </>
                        )}
                      </div>
                      {experience.description && (
                        <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">{experience.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Education Section */}
          <TabsContent value="education" className="space-y-6">
            {portfolio.educations.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {portfolio.educations.map((education) => (
                      <div key={education.id} className="relative pl-8 pb-8 border-l-2 border-muted last:border-0 last:pb-0">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background"></div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{education.degree}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(education.startDate)} - {education.endDate ? formatDate(education.endDate) : 'Present'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{education.school}</span>
                          {education.location && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{education.location}</span>
                            </>
                          )}
                        </div>
                        {education.description && (
                          <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">{education.description}</p>
                        )}
                        {education.achievements && education.achievements.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Achievements:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              {education.achievements.map((achievement, index) => (
                                <li key={index} className="text-sm">{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No education information to display.
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Testimonials Section */}
          <TabsContent value="testimonials" className="space-y-6">
            {portfolio.testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.testimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        {testimonial.avatar ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image 
                              src={testimonial.avatar} 
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-lg font-medium">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{testimonial.name}</h3>
                          {testimonial.role && testimonial.company && (
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role} at {testimonial.company}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -top-4 -left-1 text-4xl text-muted opacity-20">"</div>
                        <p className="relative z-10 text-muted-foreground">{testimonial.content}</p>
                        <div className="mt-2 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-4 w-4 text-amber-500 fill-amber-500" 
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No testimonials to display.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {portfolio.user.name}. All rights reserved.
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                Last updated {formatDistanceToNow(new Date(portfolio.updatedAt))} ago
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 