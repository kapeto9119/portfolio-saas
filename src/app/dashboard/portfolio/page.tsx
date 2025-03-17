"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X, Save, Trash, Plus, Eye, Edit, Trash2, Globe, Copy } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

// Form schemas
const aboutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email address"),
  location: z.string().optional(),
  bio: z.string().min(10, "Bio should be at least 10 characters").max(500, "Bio should not exceed 500 characters"),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// Skill schema for the form
const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
});

// Project schema for the form
const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(10, "Description should be at least 10 characters").max(500, "Description should not exceed 500 characters"),
  technologies: z.string().min(1, "Technologies used is required"),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  repoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  imageUrl: z.string().optional(),
});

// Skill type
interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

// Category type
interface Category {
  id: string;
  name: string;
}

// Project type
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

// Add new interfaces for Experience and Education
interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

// Schema for portfolio validation
const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  isPublished: z.boolean().optional().default(false),
  primaryColor: z.string().optional().nullable(),
  secondaryColor: z.string().optional().nullable(),
  fontFamily: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

interface Portfolio {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  slug: string;
  isPublished: boolean;
  primaryColor: string | null;
  secondaryColor: string | null;
  fontFamily: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  viewCount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function PortfolioPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("about");
  
  // Skills state
  const [skills, setSkills] = useState<Skill[]>([
    { id: "1", name: "React", category: "Frontend", proficiency: "Advanced" },
    { id: "2", name: "TypeScript", category: "Languages", proficiency: "Advanced" },
    { id: "3", name: "Node.js", category: "Backend", proficiency: "Intermediate" },
    { id: "4", name: "CSS", category: "Frontend", proficiency: "Advanced" },
    { id: "5", name: "PostgreSQL", category: "Database", proficiency: "Intermediate" },
  ]);
  
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Frontend" },
    { id: "2", name: "Backend" },
    { id: "3", name: "Database" },
    { id: "4", name: "DevOps" },
    { id: "5", name: "Languages" },
    { id: "6", name: "Tools" },
  ]);
  
  const [newCategory, setNewCategory] = useState("");
  
  // Projects state
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Portfolio Website",
      description: "A personal portfolio website built with Next.js and Tailwind CSS. Features a responsive design, dark mode, and contact form.",
      technologies: "Next.js, React, Tailwind CSS, Vercel",
      liveUrl: "https://johndoe.dev",
      repoUrl: "https://github.com/johndoe/portfolio",
      imageUrl: "",
      featured: true,
    },
    {
      id: "2",
      title: "E-commerce Dashboard",
      description: "An admin dashboard for an e-commerce platform with analytics, order management, and inventory tracking.",
      technologies: "React, Redux, Node.js, Express, MongoDB",
      liveUrl: "https://dashboard-demo.com",
      repoUrl: "https://github.com/johndoe/dashboard",
      imageUrl: "",
      featured: false,
    },
  ]);
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // State for image upload preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // About form
  const aboutForm = useForm<z.infer<typeof aboutSchema>>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      name: "John Doe",
      title: "Full Stack Developer",
      email: "john@example.com",
      location: "San Francisco, CA",
      bio: "Experienced developer with a passion for creating clean, efficient code and user-friendly applications.",
      phone: "+1 (555) 123-4567",
      website: "https://johndoe.dev",
    },
  });

  // Skills form
  const skillForm = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "",
      proficiency: "Intermediate",
    },
  });

  // Projects form
  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: "",
      liveUrl: "",
      repoUrl: "",
      imageUrl: "",
    },
  });

  // When editing a project, update the form with the project data
  React.useEffect(() => {
    if (editingProject) {
      projectForm.reset({
        title: editingProject.title,
        description: editingProject.description,
        technologies: editingProject.technologies,
        liveUrl: editingProject.liveUrl || "",
        repoUrl: editingProject.repoUrl || "",
        imageUrl: editingProject.imageUrl || "",
      });
    }
  }, [editingProject, projectForm]);

  // Function to handle file upload
  const handleFileUpload = (file: File) => {
    // In a real app, you would upload this to a storage service
    // For now, we'll create a local object URL for preview
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    
    // Update the form value
    projectForm.setValue("imageUrl", url);
  };
  
  // Function to clear the image
  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    projectForm.setValue("imageUrl", "");
  };
  
  // Reset image preview when editing project changes or form resets
  React.useEffect(() => {
    if (editingProject) {
      setImagePreview(editingProject.imageUrl || null);
    } else {
      setImagePreview(null);
    }
    
    // Cleanup function to revoke any object URLs when component unmounts
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [editingProject]);

  function onSubmitAbout(data: z.infer<typeof aboutSchema>) {
    toast.success("Profile information saved successfully!");
    console.log(data);
  }
  
  function onSubmitSkill(data: z.infer<typeof skillSchema>) {
    // Add a new skill
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: data.name,
      category: data.category,
      proficiency: data.proficiency as "Beginner" | "Intermediate" | "Advanced" | "Expert",
    };
    
    setSkills([...skills, newSkill]);
    toast.success(`Added skill: ${data.name}`);
    
    // Reset form
    skillForm.reset({
      name: "",
      category: data.category, // Keep the same category for consecutive additions
      proficiency: "Intermediate",
    });
  }
  
  function removeSkill(skillId: string) {
    setSkills(skills.filter(skill => skill.id !== skillId));
    toast.success("Skill removed successfully");
  }
  
  function addCategory() {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    // Check for duplicates
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      toast.error("This category already exists");
      return;
    }
    
    const newCategoryObj: Category = {
      id: Date.now().toString(),
      name: newCategory,
    };
    
    setCategories([...categories, newCategoryObj]);
    setNewCategory("");
    toast.success(`Added category: ${newCategory}`);
  }
  
  function removeCategory(categoryId: string) {
    // Check if category is being used by any skills
    const isUsed = skills.some(skill => 
      skill.category === categories.find(cat => cat.id === categoryId)?.name
    );
    
    if (isUsed) {
      toast.error("Cannot remove category that is being used by skills");
      return;
    }
    
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success("Category removed successfully");
  }
  
  // Get unique categories from skills for grouping
  const uniqueCategories = Array.from(new Set(skills.map(skill => skill.category)));

  function onSubmitProject(data: z.infer<typeof projectSchema>) {
    if (editingProject) {
      // Update existing project
      setProjects(projects.map(project => 
        project.id === editingProject.id 
          ? { ...project, ...data, featured: editingProject.featured }
          : project
      ));
      toast.success(`Updated project: ${data.title}`);
      setEditingProject(null);
    } else {
      // Add a new project
      const newProject: Project = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        technologies: data.technologies,
        liveUrl: data.liveUrl,
        repoUrl: data.repoUrl,
        imageUrl: data.imageUrl,
        featured: false,
      };
      
      setProjects([...projects, newProject]);
      toast.success(`Added project: ${data.title}`);
    }
    
    // Reset form
    projectForm.reset({
      title: "",
      description: "",
      technologies: "",
      liveUrl: "",
      repoUrl: "",
      imageUrl: "",
    });
  }
  
  function removeProject(projectId: string) {
    setProjects(projects.filter(project => project.id !== projectId));
    toast.success("Project removed successfully");
  }
  
  function editProject(project: Project) {
    setEditingProject(project);
    setActiveTab("projects");
  }
  
  function toggleFeatured(projectId: string) {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, featured: !project.featured }
        : project
    ));
    
    const project = projects.find(p => p.id === projectId);
    if (project) {
      toast.success(`${project.featured ? 'Removed from' : 'Marked as'} featured projects`);
    }
  }
  
  function cancelEditing() {
    setEditingProject(null);
    
    // Clear image preview
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    
    projectForm.reset({
      title: "",
      description: "",
      technologies: "",
      liveUrl: "",
      repoUrl: "",
      imageUrl: "",
    });
  }

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  // Load experience and education data
  useEffect(() => {
    const loadExperienceData = async () => {
      try {
        const response = await fetch('/api/experience');
        if (response.ok) {
          const data = await response.json();
          setExperiences(data);
        }
      } catch (error) {
        console.error('Error loading experience data:', error);
      }
    };

    const loadEducationData = async () => {
      try {
        const response = await fetch('/api/education');
        if (response.ok) {
          const data = await response.json();
          setEducations(data);
        }
      } catch (error) {
        console.error('Error loading education data:', error);
      }
    };

    loadExperienceData();
    loadEducationData();
  }, []);

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  
  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      slug: '',
      isPublished: false,
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      fontFamily: 'Inter',
      seoTitle: '',
      seoDescription: '',
    },
  });
  
  // Load portfolios on component mount
  useEffect(() => {
    loadPortfolios();
  }, []);
  
  // Load portfolios from API
  const loadPortfolios = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/portfolio');
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolios');
      }
      
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      toast.error('Failed to load portfolios');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: PortfolioFormValues) => {
    setIsSubmitting(true);
    
    try {
      const url = editingPortfolio 
        ? '/api/portfolio' // PUT endpoint
        : '/api/portfolio'; // POST endpoint
      
      const method = editingPortfolio ? 'PUT' : 'POST';
      const body = editingPortfolio 
        ? JSON.stringify({ id: editingPortfolio.id, ...values })
        : JSON.stringify(values);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save portfolio');
      }
      
      toast.success(editingPortfolio ? 'Portfolio updated' : 'Portfolio created');
      setIsDialogOpen(false);
      loadPortfolios();
      form.reset();
      setEditingPortfolio(null);
    } catch (error: any) {
      console.error('Error saving portfolio:', error);
      toast.error(error.message || 'Failed to save portfolio');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle portfolio deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete portfolio');
      }
      
      toast.success('Portfolio deleted');
      loadPortfolios();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast.error('Failed to delete portfolio');
    }
  };
  
  // Handle portfolio edit
  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    form.reset({
      title: portfolio.title,
      subtitle: portfolio.subtitle,
      description: portfolio.description,
      slug: portfolio.slug,
      isPublished: portfolio.isPublished,
      primaryColor: portfolio.primaryColor || '#3b82f6',
      secondaryColor: portfolio.secondaryColor || '#10b981',
      fontFamily: portfolio.fontFamily || 'Inter',
      seoTitle: portfolio.seoTitle,
      seoDescription: portfolio.seoDescription,
    });
    setIsDialogOpen(true);
  };
  
  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    form.reset();
    setEditingPortfolio(null);
  };
  
  // Copy portfolio URL to clipboard
  const copyPortfolioUrl = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Portfolio URL copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">
          Manage your portfolios and customize their appearance.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                form.reset();
                setEditingPortfolio(null);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Create Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingPortfolio ? 'Edit Portfolio' : 'Create Portfolio'}</DialogTitle>
                <DialogDescription>
                  {editingPortfolio 
                    ? 'Update your portfolio details and appearance.' 
                    : 'Create a new portfolio to showcase your work and skills.'}
                </DialogDescription>
              </DialogHeader>
              
              <Form form={form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="basic">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="appearance">Appearance</TabsTrigger>
                      <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="My Portfolio" {...field} />
                            </FormControl>
                            <FormDescription>
                              The title of your portfolio.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subtitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subtitle</FormLabel>
                            <FormControl>
                              <Input placeholder="Full Stack Developer" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormDescription>
                              A short subtitle or tagline.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="A brief description of your portfolio..." 
                                className="min-h-[100px]" 
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormDescription>
                              A brief description of your portfolio.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <span className="text-muted-foreground mr-2">{window.location.origin}/</span>
                                <Input placeholder="my-portfolio" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              The URL-friendly name for your portfolio. Use only lowercase letters, numbers, and hyphens.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Published</FormLabel>
                              <FormDescription>
                                Make your portfolio visible to the public.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="appearance" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input type="color" {...field} value={field.value || '#3b82f6'} className="w-12 h-10 p-1" />
                                <Input {...field} value={field.value || '#3b82f6'} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              The main color for your portfolio.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="secondaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input type="color" {...field} value={field.value || '#10b981'} className="w-12 h-10 p-1" />
                                <Input {...field} value={field.value || '#10b981'} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              The accent color for your portfolio.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fontFamily"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Font Family</FormLabel>
                            <FormControl>
                              <Input placeholder="Inter" {...field} value={field.value || 'Inter'} />
                            </FormControl>
                            <FormDescription>
                              The font family for your portfolio.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="seo" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="seoTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO Title</FormLabel>
                            <FormControl>
                              <Input placeholder="My Professional Portfolio" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormDescription>
                              The title that appears in search engine results.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="seoDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="A professional portfolio showcasing my skills and projects..." 
                                className="min-h-[100px]" 
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormDescription>
                              The description that appears in search engine results.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingPortfolio ? 'Update Portfolio' : 'Create Portfolio'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : portfolios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground mb-4">You don't have any portfolios yet.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  form.reset();
                  setEditingPortfolio(null);
                  setIsDialogOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Portfolio
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{portfolio.title}</CardTitle>
                    {portfolio.subtitle && (
                      <CardDescription>{portfolio.subtitle}</CardDescription>
                    )}
                  </div>
                  {portfolio.isPublished ? (
                    <div className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full">
                      Published
                    </div>
                  ) : (
                    <div className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 rounded-full">
                      Draft
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Globe className="h-4 w-4 mr-1" />
                  <span className="truncate">/{portfolio.slug}</span>
                </div>
                
                {portfolio.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {portfolio.description}
                  </p>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{portfolio.viewCount} views</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(portfolio)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyPortfolioUrl(portfolio.slug)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy URL
                  </Button>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(portfolio.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Project Card Component
interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onRemove: () => void;
  onToggleFeatured: () => void;
}

function ProjectCard({ project, onEdit, onRemove, onToggleFeatured }: ProjectCardProps) {
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{project.technologies}</p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            title="Edit project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFeatured}
            title={project.featured ? "Remove from featured" : "Mark as featured"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={project.featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            title="Remove project"
            className="text-destructive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </Button>
        </div>
      </div>
      
      <div className="flex mt-3 gap-4">
        {project.imageUrl && (
          <div className="shrink-0">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="h-20 w-20 object-cover rounded-md border"
            />
          </div>
        )}
        <p className="text-sm line-clamp-2">{project.description}</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors"
          >
            Live Demo
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/90 transition-colors"
          >
            View Code
          </a>
        )}
      </div>
    </div>
  );
} 