'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Eye, Edit, Trash2, Globe, Copy } from 'lucide-react';

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

export default function PortfolioManagementPage() {
  const router = useRouter();
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
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
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
              
              <Form {...form}>
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