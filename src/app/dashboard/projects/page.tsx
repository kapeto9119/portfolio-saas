"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ExternalLink, Edit, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    title: "Portfolio Website",
    description: "A personal portfolio website built with Next.js and Tailwind CSS.",
    link: "https://example.com/portfolio",
    image: "/placeholder-project.jpg",
  },
  {
    id: "2",
    title: "E-commerce Platform",
    description: "A full-stack e-commerce platform with user authentication and payment processing.",
    link: "https://example.com/ecommerce",
    image: "/placeholder-project.jpg",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    image: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = {
      id: Date.now().toString(),
      ...formData,
    };
    setProjects((prev) => [...prev, newProject]);
    setFormData({ title: "", description: "", link: "", image: "" });
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>
                  Add details about your project to showcase in your portfolio.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="My Awesome Project"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link">Project Link</Label>
                  <Input
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="https://example.com/project"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3">
                {project.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              {project.link && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 