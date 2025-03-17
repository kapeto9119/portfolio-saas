'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Portfolio {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/portfolios');
      
      if (!response.ok) {
        throw new Error('Failed to load portfolios');
      }
      
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      toast.error('Failed to load portfolios. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/portfolios?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete portfolio');
      }

      toast.success('Portfolio deleted successfully');
      
      // Refresh the list
      loadPortfolios();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast.error('Failed to delete portfolio. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => router.push('/dashboard/portfolio-management')}>
          <Plus className="mr-2 h-4 w-4" /> Create Portfolio
        </Button>
      </div>

      <Tabs defaultValue="portfolios" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolios">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : portfolios.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground mb-4">You don't have any portfolios yet.</p>
                <Button onClick={() => router.push('/dashboard/portfolio-management')}>
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Portfolio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <Card key={portfolio.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="truncate">{portfolio.title}</CardTitle>
                        {portfolio.subtitle && (
                          <CardDescription className="truncate mt-1">
                            {portfolio.subtitle}
                          </CardDescription>
                        )}
                      </div>
                      <Badge variant={portfolio.isPublished ? "default" : "outline"}>
                        {portfolio.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Slug: {portfolio.slug}</p>
                      <p>Views: {portfolio.viewCount}</p>
                      <p>Created: {formatDate(portfolio.createdAt)}</p>
                      <p>Updated: {formatDate(portfolio.updatedAt)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/dashboard/portfolio-management?id=${portfolio.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(portfolio.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    </div>
                    {portfolio.isPublished && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(`/p/${portfolio.slug}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> View
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Overview of your portfolio performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Portfolios</h3>
                  <p className="text-3xl font-bold">{portfolios.length}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Published</h3>
                  <p className="text-3xl font-bold">
                    {portfolios.filter(p => p.isPublished).length}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Views</h3>
                  <p className="text-3xl font-bold">
                    {portfolios.reduce((sum, p) => sum + p.viewCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 