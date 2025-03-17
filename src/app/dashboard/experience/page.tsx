"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Briefcase, Calendar, Edit, Trash2, Pencil, Trash } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// Mock data for experience
const mockExperience = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc.",
    location: "San Francisco, CA",
    startDate: "2020-01",
    endDate: "Present",
    description: "Led the development of multiple web applications using React, Next.js, and TypeScript. Implemented responsive designs and improved performance by 40%.",
    current: true,
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "Digital Innovations",
    location: "New York, NY",
    startDate: "2018-03",
    endDate: "2019-12",
    description: "Developed and maintained client websites using React and Redux. Collaborated with designers to implement UI/UX improvements.",
    current: false,
  },
];

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    current: false,
  });

  // Load experiences on mount
  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const response = await fetch('/api/experience');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error('Error loading experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newExperience = {
        ...formData,
        endDate: formData.current ? null : formData.endDate,
      };

      const response = await fetch('/api/experience', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? { id: editingId, ...newExperience } : newExperience),
      });

      if (!response.ok) {
        throw new Error('Failed to save experience');
      }

      toast.success(editingId ? 'Experience updated successfully' : 'Experience added successfully');
      await loadExperiences();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Failed to save experience');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/experience?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete experience');
      }

      toast.success('Experience deleted successfully');
      await loadExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-muted-foreground">
            Manage your work experience history.
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsOpen(true); }}>
          Add Experience
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : experiences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-32 space-y-2">
            <p className="text-muted-foreground">No experience entries yet.</p>
            <Button variant="outline" onClick={() => { resetForm(); setIsOpen(true); }}>
              Add your first experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {experiences.map((experience) => (
            <Card key={experience.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{experience.title}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {experience.company}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setFormData({
                          title: experience.title,
                          company: experience.company,
                          location: experience.location,
                          startDate: new Date(experience.startDate).toISOString().split('T')[0],
                          endDate: experience.endDate
                            ? new Date(experience.endDate).toISOString().split('T')[0]
                            : '',
                          description: experience.description,
                          current: !experience.endDate,
                        });
                        setEditingId(experience.id);
                        setIsOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(experience.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>
                      {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{experience.location}</span>
                  </div>
                  <p className="mt-2 text-sm">{experience.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update your work experience details.'
                : 'Add a new work experience to your portfolio.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  disabled={formData.current}
                  required={!formData.current}
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="current"
                    checked={formData.current}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        current: checked as boolean,
                        endDate: checked ? '' : formData.endDate,
                      });
                    }}
                  />
                  <Label htmlFor="current">I currently work here</Label>
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>{editingId ? 'Update' : 'Add'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 