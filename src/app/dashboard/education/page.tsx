"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

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

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    degree: "",
    school: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    current: false,
  });

  // Load educations on mount
  useEffect(() => {
    loadEducations();
  }, []);

  const loadEducations = async () => {
    try {
      const response = await fetch('/api/education');
      if (response.ok) {
        const data = await response.json();
        setEducations(data);
      }
    } catch (error) {
      console.error('Error loading education entries:', error);
      toast.error('Failed to load education entries');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      degree: "",
      school: "",
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
      const newEducation = {
        ...formData,
        endDate: formData.current ? null : formData.endDate,
      };

      const response = await fetch('/api/education', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingId ? { id: editingId, ...newEducation } : newEducation),
      });

      if (!response.ok) {
        throw new Error('Failed to save education');
      }

      toast.success(editingId ? 'Education updated successfully' : 'Education added successfully');
      await loadEducations();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('Failed to save education');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/education?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete education');
      }

      toast.success('Education deleted successfully');
      await loadEducations();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
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
          <h1 className="text-3xl font-bold">Education</h1>
          <p className="text-muted-foreground">
            Manage your educational background.
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsOpen(true); }}>
          Add Education
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : educations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-32 space-y-2">
            <p className="text-muted-foreground">No education entries yet.</p>
            <Button variant="outline" onClick={() => { resetForm(); setIsOpen(true); }}>
              Add your first education
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {educations.map((education) => (
            <Card key={education.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{education.degree}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {education.school}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setFormData({
                          degree: education.degree,
                          school: education.school,
                          location: education.location,
                          startDate: new Date(education.startDate).toISOString().split('T')[0],
                          endDate: education.endDate
                            ? new Date(education.endDate).toISOString().split('T')[0]
                            : '',
                          description: education.description,
                          current: !education.endDate,
                        });
                        setEditingId(education.id);
                        setIsOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(education.id)}
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
                      {formatDate(education.startDate)} - {formatDate(education.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{education.location}</span>
                  </div>
                  <p className="mt-2 text-sm">{education.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Education' : 'Add Education'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update your education details.'
                : 'Add a new education entry to your portfolio.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) =>
                    setFormData({ ...formData, school: e.target.value })
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
                  <Label htmlFor="current">I currently study here</Label>
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