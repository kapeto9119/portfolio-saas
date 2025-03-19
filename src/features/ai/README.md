# AI Features

This directory contains AI-powered features for enhancing user portfolios and content.

## Components

### BioGenerator
Generates professional bios based on user experience and skills.
```tsx
<BioGenerator
  initialBio={user.bio}
  experience={user.experience}
  skills={user.skills}
  onUpdate={(newBio) => handleBioUpdate(newBio)}
/>
```

### ContentEnhancer
Enhances text content with AI suggestions for better engagement.
```tsx
<ContentEnhancer
  content={project.description}
  onUpdate={(newContent) => handleContentUpdate(newContent)}
  placeholder="Write your project description..."
/>
```

### SkillSuggestions
Suggests relevant skills based on current skills and experience.
```tsx
<SkillSuggestions
  currentSkills={user.skills}
  experience={user.experience}
  onAddSkill={(skill) => handleAddSkill(skill)}
/>
```

### PortfolioAnalyzer
Provides comprehensive portfolio analysis with actionable insights.
```tsx
<PortfolioAnalyzer
  projects={user.projects}
  skills={user.skills}
  experience={user.experience}
/>
```

## Hooks

### useAI
A generic hook for making AI-powered API calls with built-in loading and error states.
```tsx
const {
  execute,
  isLoading,
  data,
  error,
  reset,
} = useAI<ResponseType>({
  endpoint: "endpoint-name",
  successMessage: "Operation successful!",
  errorMessage: "Operation failed",
  onSuccess: (data) => console.log(data),
  onError: (error) => console.error(error),
});
```

## API Endpoints

All endpoints require authentication and are rate-limited.

### POST /api/ai/generate-bio
Generates professional bio suggestions.
```typescript
// Request
{
  currentBio?: string;
  experience?: string;
  skills?: string[];
}

// Response
{
  suggestions: string[];
}
```

### POST /api/ai/enhance
Enhances content with different styles.
```typescript
// Request
{
  content: string;
}

// Response
{
  suggestions: Array<{
    content: string;
    style: "professional" | "engaging" | "concise";
  }>;
}
```

### POST /api/ai/recommend-skills
Suggests relevant skills to learn.
```typescript
// Request
{
  currentSkills: string[];
  experience?: string;
}

// Response
{
  skills: Array<{
    name: string;
    relevance: number;
    category: string;
  }>;
}
```

### POST /api/ai/analyze-portfolio
Provides comprehensive portfolio analysis.
```typescript
// Request
{
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  skills: string[];
  experience?: string;
}

// Response
{
  analysis: {
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
  };
}
```

## Configuration

The AI features use OpenAI's GPT-4 model. Configure your OpenAI API key in the environment variables:

```env
OPENAI_API_KEY=your-api-key-here
```

## Best Practices

1. Always handle loading states in the UI
2. Provide clear feedback for errors
3. Use the shared `useAI` hook for consistency
4. Follow the type definitions in `types.ts`
5. Keep AI prompts focused and specific
6. Handle rate limiting gracefully
7. Cache results when appropriate
8. Test with various input scenarios 