"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useAI } from "../hooks/useAI";

interface BioGeneratorProps {
  initialBio?: string;
  experience?: string;
  skills?: string[];
  onUpdate: (newBio: string) => void;
}

interface BioResponse {
  suggestions: string[];
}

export function BioGenerator({
  initialBio = "",
  experience = "",
  skills = [],
  onUpdate,
}: BioGeneratorProps) {
  const [currentBio, setCurrentBio] = useState(initialBio);
  
  const {
    execute: generateBio,
    isLoading,
    data,
    reset: resetSuggestions,
  } = useAI<BioResponse>({
    endpoint: "generate-bio",
    successMessage: "Bio suggestions generated!",
    errorMessage: "Failed to generate bio. Please try again.",
  });

  const handleGenerateBio = () => {
    generateBio({
      currentBio,
      experience,
      skills,
    });
  };

  const applyBio = (bio: string) => {
    setCurrentBio(bio);
    onUpdate(bio);
    resetSuggestions();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Professional Bio</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateBio}
          disabled={isLoading}
        >
          <Sparkles className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Generate Bio
        </Button>
      </div>

      <div className="relative">
        <Textarea
          value={currentBio}
          onChange={(e) => {
            setCurrentBio(e.target.value);
            onUpdate(e.target.value);
          }}
          placeholder="Write your professional bio here or generate one with AI..."
          className="min-h-[150px]"
        />
      </div>

      {data?.suggestions && data.suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">AI Suggestions:</h4>
          <div className="space-y-2">
            {data.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
              >
                <p className="mb-2 text-sm whitespace-pre-wrap">{suggestion}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyBio(suggestion)}
                >
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 