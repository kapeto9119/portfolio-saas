"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Skill {
  name: string;
  relevance: number;
  category: string;
}

interface SkillSuggestionsProps {
  currentSkills: string[];
  experience: string;
  onAddSkill: (skill: string) => void;
}

export function SkillSuggestions({
  currentSkills,
  experience,
  onAddSkill,
}: SkillSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Skill[]>([]);

  const getSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/ai/recommend-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkills, experience }),
      });

      if (!response.ok) throw new Error("Failed to get suggestions");

      const data = await response.json();
      setSuggestions(data.skills);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get skill suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = (skill: Skill) => {
    onAddSkill(skill.name);
    setSuggestions(suggestions.filter((s) => s.name !== skill.name));
    toast({
      title: "Success",
      description: `Added ${skill.name} to your skills!`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">AI Skill Suggestions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={getSuggestions}
          disabled={isLoading}
        >
          <Sparkles className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Get Suggestions
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          {Object.entries(
            suggestions.reduce((acc, skill) => {
              acc[skill.category] = [...(acc[skill.category] || []), skill];
              return acc;
            }, {} as Record<string, Skill[]>)
          ).map(([category, skills]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium capitalize">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleAddSkill(skill)}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 