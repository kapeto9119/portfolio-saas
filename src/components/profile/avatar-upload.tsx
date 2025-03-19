"use client";

import { useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AvatarUploadProps {
  currentImage?: string | null;
  onUpload: (url: string) => Promise<void>;
  className?: string;
}

export function AvatarUpload({ currentImage, onUpload, className }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      await onUpload(data.url);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  return (
    <div className="relative group">
      <Avatar className={`h-24 w-24 ${className}`}>
        <AvatarImage src={currentImage || ''} alt="Profile picture" />
        <AvatarFallback>
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Camera className="h-8 w-8" />
          )}
        </AvatarFallback>
      </Avatar>
      <label
        htmlFor="avatar-upload"
        className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
      >
        <Camera className="h-6 w-6" />
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
} 