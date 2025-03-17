"use client";

import * as React from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  previewUrl?: string;
  onClear?: () => void;
  onUpload?: (file: File) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  className,
  previewUrl,
  onClear,
  onUpload,
  acceptedFileTypes = "image/*",
  maxSizeMB = 5,
  ...props
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  
  const validateFile = React.useCallback((file: File): boolean => {
    // Check file type
    if (acceptedFileTypes && !file.type.match(acceptedFileTypes.replace(/\*/g, ".*"))) {
      setError(`Invalid file type. Please upload ${acceptedFileTypes.replace("image/", "")}.`);
      return false;
    }
    
    // Check file size
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }
    
    setError(null);
    return true;
  }, [acceptedFileTypes, maxSizeMB]);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file) && onUpload) {
        onUpload(file);
      }
    }
  }, [validateFile, onUpload]);
  
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file) && onUpload) {
        onUpload(file);
      }
    }
  }, [validateFile, onUpload]);
  
  const handleButtonClick = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="space-y-2">
      <div
        onDragEnter={handleDrag}
        className={cn(
          "relative flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          previewUrl ? "h-[200px]" : "h-[150px]",
          className
        )}
      >
        {previewUrl ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[180px] max-w-full object-contain"
              />
            </div>
            {onClear && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={onClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept={acceptedFileTypes}
              {...props}
            />
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-2 text-center",
                dragActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <UploadCloud className="h-10 w-10" />
              <div className="flex flex-col">
                <span className="font-medium">Drag & drop your image here</span>
                <span className="text-xs">or</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleButtonClick}
              >
                Browse files
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                {`Supported formats: ${acceptedFileTypes.replace("image/", "")}, up to ${maxSizeMB}MB`}
              </p>
            </div>
            <div
              className="absolute inset-0"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            />
          </>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
} 