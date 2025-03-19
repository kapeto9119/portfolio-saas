"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ContentEnhancerProps {
  content: string;
  onUpdate: (newContent: string) => void;
  placeholder?: string;
}

export function ContentEnhancer({ content, onUpdate, placeholder }: ContentEnhancerProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const enhanceContent = async () => {
    try {
      setIsEnhancing(true);
      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Enhancement failed");

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    onUpdate(suggestion);
    setSuggestions([]);
    toast({
      title: "Success",
      description: "Content updated successfully!",
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder={placeholder}
          className="min-h-[150px] pr-12"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-2 opacity-70 hover:opacity-100"
          onClick={enhanceContent}
          disabled={isEnhancing || !content.trim()}
        >
          <Wand2 className={`h-4 w-4 ${isEnhancing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">AI Suggestions:</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
              >
                <p className="mb-2 text-sm">{suggestion}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applySuggestion(suggestion)}
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