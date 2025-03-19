"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Briefcase, MapPin, Link, Github, Twitter, Linkedin, Upload } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    job_title: "",
    location: "",
    website: "",
    github: "",
    twitter: "",
    linkedin: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          job_title: data.job_title || "",
          location: data.location || "",
          website: data.website || "",
          github: data.github || "",
          twitter: data.twitter || "",
          linkedin: data.linkedin || "",
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Update session with new image URL
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          image: data.url,
        },
      });

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    if (!profile.name) return "U";
    return profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and social profiles.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Your profile picture will be shown on your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div 
              className="relative cursor-pointer group"
              onClick={handleImageClick}
            >
              <Avatar className="h-32 w-32">
                <AvatarImage src={session?.user?.image || ""} alt={profile.name} />
                <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Button 
              variant="outline" 
              onClick={handleImageClick}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Change Picture"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Click the avatar or button to change your profile picture.
              <br />
              Maximum file size: 5MB
            </p>
          </CardContent>
        </Card>

        <div className="md:w-2/3">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="social">Social Profiles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-4">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            value={profile.email}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="john@example.com"
                            type="email"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="job_title">Job Title</Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="job_title"
                            name="job_title"
                            value={profile.job_title}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="Software Developer"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            name="location"
                            value={profile.location}
                            onChange={handleInputChange}
                            className="pl-10"
                            placeholder="San Francisco, CA"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          name="website"
                          value={profile.website}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="social" className="mt-4">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Social Profiles</CardTitle>
                    <CardDescription>
                      Connect your social media accounts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="github"
                          name="github"
                          value={profile.github}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="twitter"
                          name="twitter"
                          value={profile.twitter}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedin"
                          name="linkedin"
                          value={profile.linkedin}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 