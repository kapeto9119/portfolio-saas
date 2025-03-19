// Common Response Types
export interface AIResponse<T> {
  data: T;
  error?: string;
}

// Bio Generator Types
export interface BioGeneratorProps {
  initialBio?: string;
  experience?: string;
  skills?: string[];
  onUpdate: (newBio: string) => void;
}

export interface BioResponse {
  suggestions: string[];
}

// Content Enhancer Types
export interface ContentEnhancerProps {
  content: string;
  onUpdate: (newContent: string) => void;
  placeholder?: string;
}

export interface ContentEnhancementResponse {
  suggestions: Array<{
    content: string;
    style: "professional" | "engaging" | "concise";
  }>;
}

// Skill Suggestions Types
export interface SkillSuggestionsProps {
  currentSkills: string[];
  experience?: string;
  onAddSkill: (skill: string) => void;
}

export interface SkillSuggestion {
  name: string;
  relevance: number;
  category: string;
}

export interface SkillSuggestionsResponse {
  skills: SkillSuggestion[];
}

// Portfolio Analyzer Types
export interface PortfolioProject {
  title: string;
  description: string;
  technologies: string[];
}

export interface PortfolioAnalyzerProps {
  projects: PortfolioProject[];
  skills: string[];
  experience?: string;
}

export interface PortfolioAnalysis {
  strengths: string[];
  improvements: string[];
  marketFit: {
    score: number;
    explanation: string;
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
}

export interface PortfolioAnalysisResponse {
  analysis: PortfolioAnalysis;
}

// AI Hook Types
export interface UseAIOptions<T> {
  endpoint: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
} 