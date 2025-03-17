"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/radix-tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, MessageSquarePlus, UserPlus, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { EnhancementType, Tone } from "@/types/ai";
import DashboardHeader from "@/components/dashboard/dashboard-header";

// Schema for content enhancement form
const enhanceContentSchema = z.object({
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  type: z.enum(["improve", "proofread", "simplify", "expand", "keywords"], {
    required_error: "Please select an enhancement type.",
  }),
  tone: z.enum(["professional", "conversational", "technical", "enthusiastic", "authoritative"], {
    required_error: "Please select a tone.",
  }),
});

// Schema for skill recommendations form
const skillRecommendationSchema = z.object({
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  currentSkills: z.string().optional(),
  experience: z.string().optional(),
});

// Schema for bio generation form
const bioGenerationSchema = z.object({
  skills: z.string().min(3, {
    message: "Please enter at least a few skills.",
  }),
  experience: z.string().min(10, {
    message: "Experience must be at least 10 characters.",
  }),
  education: z.string().min(10, {
    message: "Education must be at least 10 characters.",
  }),
  tone: z.enum(["professional", "conversational", "technical", "enthusiastic", "authoritative"], {
    required_error: "Please select a tone.",
  }),
});

export default function AIEnhancerPage() {
  const [activeTab, setActiveTab] = useState("enhance");
  const [enhancedContent, setEnhancedContent] = useState("");
  const [bioContent, setBioContent] = useState("");
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isRecommendingSkills, setIsRecommendingSkills] = useState(false);

  // Form for content enhancement
  const enhanceForm = useForm<z.infer<typeof enhanceContentSchema>>({
    resolver: zodResolver(enhanceContentSchema),
    defaultValues: {
      content: "",
      type: "improve",
      tone: "professional",
    },
  });

  // Form for skill recommendations
  const skillsForm = useForm<z.infer<typeof skillRecommendationSchema>>({
    resolver: zodResolver(skillRecommendationSchema),
    defaultValues: {
      jobTitle: "",
      currentSkills: "",
      experience: "",
    },
  });

  // Form for bio generation
  const bioForm = useForm<z.infer<typeof bioGenerationSchema>>({
    resolver: zodResolver(bioGenerationSchema),
    defaultValues: {
      skills: "",
      experience: "",
      education: "",
      tone: "professional",
    },
  });

  // Submit handler for content enhancement
  const onSubmitEnhance = async (data: z.infer<typeof enhanceContentSchema>) => {
    setIsEnhancing(true);
    setEnhancedContent("");
    
    try {
      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: data.content,
          type: data.type as EnhancementType,
          tone: data.tone as Tone,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to enhance content");
      }
      
      setEnhancedContent(result.enhancedContent);
      toast.success("Content enhanced successfully");
    } catch (error) {
      console.error("Error enhancing content:", error);
      toast.error(error instanceof Error ? error.message : "Failed to enhance content");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Submit handler for skill recommendations
  const onSubmitSkills = async (data: z.infer<typeof skillRecommendationSchema>) => {
    setIsRecommendingSkills(true);
    setRecommendedSkills([]);
    
    try {
      const response = await fetch("/api/ai/recommend-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: data.jobTitle,
          currentSkills: data.currentSkills ? data.currentSkills.split(",").map(s => s.trim()) : undefined,
          experience: data.experience,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to recommend skills");
      }
      
      setRecommendedSkills(result.recommendedSkills || []);
      toast.success("Skills recommended successfully");
    } catch (error) {
      console.error("Error recommending skills:", error);
      toast.error(error instanceof Error ? error.message : "Failed to recommend skills");
    } finally {
      setIsRecommendingSkills(false);
    }
  };

  // Submit handler for bio generation
  const onSubmitBio = async (data: z.infer<typeof bioGenerationSchema>) => {
    setIsGeneratingBio(true);
    setBioContent("");
    
    try {
      const response = await fetch("/api/ai/generate-bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: data.skills.split(",").map(s => s.trim()),
          experience: data.experience,
          education: data.education,
          tone: data.tone as Tone,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to generate bio");
      }
      
      setBioContent(result.bioContent);
      toast.success("Bio generated successfully");
    } catch (error) {
      console.error("Error generating bio:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate bio");
    } finally {
      setIsGeneratingBio(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <DashboardHeader
        heading="AI Content Enhancer"
        text="Use AI to improve your portfolio content, generate professional bios, and get skill recommendations."
        icon={<Sparkles className="h-6 w-6 text-blue-500" />}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enhance" className="flex items-center space-x-2">
            <MessageSquarePlus className="h-4 w-4" />
            <span>Enhance Content</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center space-x-2">
            <BrainCircuit className="h-4 w-4" />
            <span>Skill Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="bio" className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Generate Bio</span>
          </TabsTrigger>
        </TabsList>

        {/* Content Enhancement Tab */}
        <TabsContent value="enhance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhance Your Content</CardTitle>
                <CardDescription>
                  Improve your portfolio content with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...enhanceForm}>
                  <form onSubmit={enhanceForm.handleSubmit(onSubmitEnhance)} className="space-y-4">
                    <FormField
                      control={enhanceForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enhancement Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select enhancement type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Enhancement Options</SelectLabel>
                                <SelectItem value="improve">General Improvement</SelectItem>
                                <SelectItem value="proofread">Proofreading & Grammar</SelectItem>
                                <SelectItem value="simplify">Simplify & Clarify</SelectItem>
                                <SelectItem value="expand">Expand & Elaborate</SelectItem>
                                <SelectItem value="keywords">Add Industry Keywords</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select how you want to enhance your content
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={enhanceForm.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Tone Options</SelectLabel>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="conversational">Conversational</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                <SelectItem value="authoritative">Authoritative</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the writing style and tone
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={enhanceForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the content you want to enhance..."
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Paste your existing portfolio content here
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isEnhancing} className="w-full">
                      {isEnhancing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Enhance Content
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enhanced Content</CardTitle>
                <CardDescription>
                  Your AI-enhanced content will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEnhancing ? (
                  <div className="flex flex-col items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">The AI is enhancing your content...</p>
                  </div>
                ) : enhancedContent ? (
                  <div className="border rounded-md p-4 min-h-[300px] bg-muted/30">
                    <p className="whitespace-pre-wrap">{enhancedContent}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Fill out the form and click "Enhance Content" to see the AI-enhanced version here
                    </p>
                  </div>
                )}
              </CardContent>
              {enhancedContent && (
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => navigator.clipboard.writeText(enhancedContent)}
                    className="w-full"
                  >
                    Copy to Clipboard
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Skills Recommendation Tab */}
        <TabsContent value="skills">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Recommendations</CardTitle>
                <CardDescription>
                  Get AI recommendations for skills to add to your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...skillsForm}>
                  <form onSubmit={skillsForm.handleSubmit(onSubmitSkills)} className="space-y-4">
                    <FormField
                      control={skillsForm.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title or Position</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Frontend Developer" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your current or desired job title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={skillsForm.control}
                      name="currentSkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Skills (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. React, TypeScript, CSS"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            List your current skills, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={skillsForm.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Summary (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Briefly describe your professional experience..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A brief overview of your experience to help with recommendations
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isRecommendingSkills} className="w-full">
                      {isRecommendingSkills ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Recommendations...
                        </>
                      ) : (
                        <>
                          <BrainCircuit className="mr-2 h-4 w-4" />
                          Get Skill Recommendations
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Skills</CardTitle>
                <CardDescription>
                  Skills that could enhance your portfolio based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isRecommendingSkills ? (
                  <div className="flex flex-col items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">The AI is analyzing and recommending skills...</p>
                  </div>
                ) : recommendedSkills.length > 0 ? (
                  <div className="border rounded-md p-4 min-h-[300px] bg-muted/30">
                    <ul className="list-disc pl-6 space-y-2">
                      {recommendedSkills.map((skill, index) => (
                        <li key={index} className="text-sm sm:text-base">{skill}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Fill out the form and click "Get Skill Recommendations" to see AI-recommended skills here
                    </p>
                  </div>
                )}
              </CardContent>
              {recommendedSkills.length > 0 && (
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => navigator.clipboard.writeText(recommendedSkills.join(", "))}
                    className="w-full"
                  >
                    Copy to Clipboard
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Bio Generation Tab */}
        <TabsContent value="bio">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Professional Bio</CardTitle>
                <CardDescription>
                  Create a compelling professional bio for your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...bioForm}>
                  <form onSubmit={bioForm.handleSubmit(onSubmitBio)} className="space-y-4">
                    <FormField
                      control={bioForm.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Skills</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. Web Development, UX Design, Project Management"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            List your key skills, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bioForm.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Experience</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Summarize your professional experience..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A summary of your work history and achievements
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bioForm.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your educational background..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your educational qualifications and certifications
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bioForm.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Tone Options</SelectLabel>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="conversational">Conversational</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                <SelectItem value="authoritative">Authoritative</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the writing style and tone for your bio
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isGeneratingBio} className="w-full">
                      {isGeneratingBio ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Bio...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Generate Professional Bio
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Professional Bio</CardTitle>
                <CardDescription>
                  Your AI-generated professional biography will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGeneratingBio ? (
                  <div className="flex flex-col items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">The AI is crafting your professional bio...</p>
                  </div>
                ) : bioContent ? (
                  <div className="border rounded-md p-4 min-h-[300px] bg-muted/30">
                    <p className="whitespace-pre-wrap">{bioContent}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Fill out the form and click "Generate Professional Bio" to see your AI-crafted bio here
                    </p>
                  </div>
                )}
              </CardContent>
              {bioContent && (
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => navigator.clipboard.writeText(bioContent)}
                    className="w-full"
                  >
                    Copy to Clipboard
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 