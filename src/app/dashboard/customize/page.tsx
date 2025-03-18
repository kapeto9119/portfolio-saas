"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

// Theme schema for validation
const themeSchema = z.object({
  layout: z.enum(["grid", "timeline", "cards"]),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  fontFamily: z.string(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  backgroundImage: z.string().optional().nullable(),
  customCss: z.string().optional().nullable(),
});

type ThemeFormValues = z.infer<typeof themeSchema>;

// Theme presets
const themePresets = {
  modern: {
    name: "Modern",
    values: {
      layout: "grid",
      primaryColor: "#3b82f6",
      secondaryColor: "#10b981",
      fontFamily: "Inter",
      backgroundColor: "#ffffff",
      backgroundImage: "",
      customCss: "",
    },
  },
  minimal: {
    name: "Minimal",
    values: {
      layout: "cards",
      primaryColor: "#000000",
      secondaryColor: "#666666",
      fontFamily: "Roboto",
      backgroundColor: "#ffffff",
      backgroundImage: "",
      customCss: "",
    },
  },
  dark: {
    name: "Dark Mode",
    values: {
      layout: "grid",
      primaryColor: "#60a5fa",
      secondaryColor: "#34d399",
      fontFamily: "Inter",
      backgroundColor: "#111827",
      backgroundImage: "",
      customCss: `
        body { color: #ffffff; }
        .text-muted-foreground { color: #9ca3af; }
      `,
    },
  },
  creative: {
    name: "Creative",
    values: {
      layout: "timeline",
      primaryColor: "#8b5cf6",
      secondaryColor: "#ec4899",
      fontFamily: "Poppins",
      backgroundColor: "#fffbf5",
      backgroundImage: "",
      customCss: `
        .card { border-radius: 1rem; }
        .timeline-item { transition: transform 0.2s; }
        .timeline-item:hover { transform: translateX(8px); }
      `,
    },
  },
} as const;

// Font options
const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
];

// Layout options
const layoutOptions = [
  { value: "grid", label: "Grid" },
  { value: "timeline", label: "Timeline" },
  { value: "cards", label: "Cards" },
];

export default function CustomizePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewKey, setPreviewKey] = useState(0);
  const [activeTab, setActiveTab] = useState<keyof typeof themePresets>("modern");

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: themePresets.modern.values,
  });

  // Watch form changes for live preview
  const formValues = form.watch();
  useEffect(() => {
    const previewTheme = async () => {
      try {
        const response = await fetch("/api/portfolio/theme/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        if (response.ok) {
          setPreviewKey(prev => prev + 1);
        }
      } catch (error) {
        console.error("Preview error:", error);
      }
    };

    const debounceTimer = setTimeout(previewTheme, 500);
    return () => clearTimeout(debounceTimer);
  }, [formValues]);

  // Load current theme settings
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const response = await fetch("/api/portfolio/theme");
      if (!response.ok) {
        throw new Error(`Failed to load theme: ${response.statusText}`);
      }
      const theme = await response.json();
      if (!theme) {
        throw new Error("No theme data found");
      }
      form.reset(theme);
      setPreviewUrl(`/${theme.portfolioSlug}`);
    } catch (error) {
      console.error("Error loading theme:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load theme settings");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: ThemeFormValues) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/portfolio/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to save theme");
      }

      toast.success("Theme settings saved successfully");
      setPreviewKey(prev => prev + 1);
    } catch (error) {
      console.error("Error saving theme:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save theme settings");
    } finally {
      setIsSaving(false);
    }
  };

  const applyPreset = (preset: keyof typeof themePresets) => {
    form.reset(themePresets[preset].values);
    setActiveTab(preset);
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
        <h1 className="text-3xl font-bold">Customize Portfolio</h1>
        <p className="text-muted-foreground">
          Customize the look and feel of your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Theme Presets */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Presets</CardTitle>
              <CardDescription>
                Choose a preset theme or customize your own.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => applyPreset(value as keyof typeof themePresets)}>
                <TabsList className="grid grid-cols-4 gap-4">
                  {Object.entries(themePresets).map(([key, preset]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {preset.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize colors, fonts, and layout of your portfolio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="layout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a layout" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {layoutOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose how your content is displayed.
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a font" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fontOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the main font for your portfolio.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="#3b82f6"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Main color used throughout your portfolio.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="#10b981"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Accent color for highlights and secondary elements.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="#ffffff"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Background color of your portfolio.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="backgroundImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Image URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="https://..."
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Add a background image URL.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customCss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom CSS</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          placeholder=".custom-class { ... }"
                          className="font-mono min-h-[150px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Add custom CSS styles.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your portfolio looks with the current settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] w-full border rounded-lg overflow-hidden bg-muted">
                {previewUrl && (
                  <iframe
                    key={previewKey}
                    src={previewUrl}
                    className="w-full h-full"
                    title="Portfolio Preview"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Theme Preview Cards */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(themePresets).map(([key, preset]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  activeTab === key ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => applyPreset(key as keyof typeof themePresets)}
              >
                <div
                  className="h-20 w-full"
                  style={{ backgroundColor: preset.values.backgroundColor }}
                >
                  <div className="p-4">
                    <div
                      className="h-4 w-24 mb-2 rounded"
                      style={{ backgroundColor: preset.values.primaryColor }}
                    />
                    <div
                      className="h-3 w-16 rounded"
                      style={{ backgroundColor: preset.values.secondaryColor }}
                    />
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium">{preset.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 