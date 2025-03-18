"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { DragDropContext, Draggable, Droppable, DropResult, DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";

// Section schema for validation
const sectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  type: z.enum(["text", "gallery", "timeline", "skills", "custom"]),
  content: z.string().optional(),
  isPublished: z.boolean().default(true),
  order: z.number(),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

// Section type options
const sectionTypes = [
  { value: "text", label: "Text Content" },
  { value: "gallery", label: "Media Gallery" },
  { value: "timeline", label: "Timeline" },
  { value: "skills", label: "Skills Grid" },
  { value: "custom", label: "Custom HTML" },
] as const;

export default function SectionsPage() {
  const [sections, setSections] = useState<SectionFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      type: "text",
      content: "",
      isPublished: true,
      order: 0,
    },
  });

  // Load sections
  const loadSections = async () => {
    try {
      const response = await fetch("/api/portfolio/sections");
      if (!response.ok) {
        throw new Error(`Failed to load sections: ${response.statusText}`);
      }
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error loading sections:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load sections");
    } finally {
      setIsLoading(false);
    }
  };

  // Save section
  const onSubmit = async (values: SectionFormValues) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/portfolio/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const savedSection = await response.json();
      
      if (editingIndex !== null) {
        // Update existing section
        setSections(prev => 
          prev.map((section, index) => 
            index === editingIndex ? savedSection : section
          )
        );
        setEditingIndex(null);
      } else {
        // Add new section
        setSections(prev => [...prev, savedSection]);
      }

      form.reset();
      toast.success("Section saved successfully");
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save section");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete section
  const deleteSection = async (index: number) => {
    try {
      const section = sections[index];
      if (!section.id) return;

      const response = await fetch(`/api/portfolio/sections/${section.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSections(prev => prev.filter((_, i) => i !== index));
      toast.success("Section deleted successfully");
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete section");
    }
  };

  // Edit section
  const editSection = (index: number) => {
    const section = sections[index];
    form.reset(section);
    setEditingIndex(index);
  };

  // Handle drag and drop reordering
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setSections(updatedItems);

    // Save new order to backend
    try {
      const response = await fetch("/api/portfolio/sections/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: updatedItems }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Section order updated");
    } catch (error) {
      console.error("Error updating section order:", error);
      toast.error("Failed to update section order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Custom Sections</h1>
        <p className="text-muted-foreground">
          Create and manage custom sections for your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingIndex !== null ? "Edit Section" : "Add New Section"}</CardTitle>
            <CardDescription>
              Create a new custom section or edit an existing one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Section Title" />
                    </FormControl>
                    <FormDescription>
                      The title of your custom section.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose how your content will be displayed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter your content here..."
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Add your section content. Format depends on section type.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Published</FormLabel>
                      <FormDescription>
                        Show this section on your portfolio.
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

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setEditingIndex(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {editingIndex !== null ? "Update Section" : "Add Section"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sections List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Sections</CardTitle>
              <CardDescription>
                Drag and drop to reorder sections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided: DroppableProvided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {sections.map((section, index) => (
                        <Draggable
                          key={section.id ?? index.toString()}
                          draggableId={section.id ?? index.toString()}
                          index={index}
                        >
                          {(provided: DraggableProvided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center justify-between p-4 rounded-lg border ${
                                !section.isPublished && "opacity-50"
                              }`}
                            >
                              <div>
                                <h3 className="font-medium">{section.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {sectionTypes.find(t => t.value === section.type)?.label}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editSection(index)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteSection(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {sections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No sections yet. Create your first section!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 