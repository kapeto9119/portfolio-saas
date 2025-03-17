import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ProfessionType = 'technology' | 'design' | 'legal' | 'healthcare' | 'education' | 'finance' | 'other';

interface ContentSuggestionParams {
  profession: ProfessionType;
  experience: string;
  education: string;
  skills: string[];
  contentType: 'bio' | 'project' | 'experience' | 'skill' | 'education';
}

/**
 * Generates professional content suggestions based on user's profile
 */
export async function generateContentSuggestion({
  profession,
  experience,
  education,
  skills,
  contentType,
}: ContentSuggestionParams): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }
    
    const prompts = {
      bio: `Create a professional biography for a ${profession} professional with the following background:
Experience: ${experience}
Education: ${education}
Skills: ${skills.join(', ')}
Keep it concise (120-150 words), professional, and highlight key strengths.`,
      
      project: `Suggest a compelling project description for a ${profession} professional with the following background:
Experience: ${experience}
Education: ${education}
Skills: ${skills.join(', ')}
Format as a concise project description including challenge, solution, and outcome.`,
      
      experience: `Craft a professional experience description for a ${profession} professional with this background:
Experience: ${experience}
Education: ${education}
Skills: ${skills.join(', ')}
Include responsibilities, achievements, and skills applied in a concise way (70-90 words).`,
      
      skill: `Suggest 5-7 professionally phrased skills for a ${profession} professional with:
Experience: ${experience}
Education: ${education}
Current skills: ${skills.join(', ')}
Format as a comma-separated list of skills with brief descriptions.`,
      
      education: `Create a professional education entry for a ${profession} professional with:
Experience: ${experience}
Education: ${education}
Include degree, institution, key courses, and notable achievements in a concise format.`,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional content writer specializing in career development and professional portfolios." },
        { role: "user", content: prompts[contentType] }
      ],
      max_tokens: 350,
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || "Unable to generate content. Please try again.";
  } catch (error) {
    console.error('Error generating content suggestion:', error);
    return "An error occurred while generating content. Please try again later.";
  }
}

/**
 * Enhances and improves existing content to sound more professional
 */
export async function enhanceContent(
  content: string, 
  profession: ProfessionType,
  tone: 'formal' | 'conversational' | 'technical' | 'creative' = 'formal'
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }
    
    const prompt = `Enhance the following ${profession} professional's content to sound more ${tone} while maintaining accuracy:

"${content}"

Improved version:`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional content editor who specializes in improving professional biographies and descriptions." },
        { role: "user", content: prompt }
      ],
      max_tokens: 350,
      temperature: 0.6,
    });

    return response.choices[0].message.content?.trim() || "Unable to enhance content. Please try again.";
  } catch (error) {
    console.error('Error enhancing content:', error);
    return "An error occurred while enhancing content. Please try again later.";
  }
}

/**
 * Analyzes a portfolio and provides suggestions for improvement
 */
export async function analyzePortfolio(portfolioData: any): Promise<string[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }
    
    // Convert portfolio data to a string representation
    const portfolioString = JSON.stringify({
      title: portfolioData.title,
      description: portfolioData.description,
      skills: portfolioData.skills?.map((s: { name: string }) => s.name).join(', '),
      projects: portfolioData.projects?.length || 0,
      experiences: portfolioData.experiences?.length || 0,
      education: portfolioData.educations?.length || 0,
    });
    
    const prompt = `Analyze this portfolio data and provide 5 specific improvement suggestions:
${portfolioString}

Provide suggestions in this format:
1. [Suggestion title]: [Brief explanation]
2. [Suggestion title]: [Brief explanation]
...and so on`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional career coach and portfolio expert who provides actionable feedback." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const suggestions = response.choices[0].message.content?.trim() || "";
    return suggestions.split('\n').filter((s: string) => s.trim() !== '');
  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    return ["An error occurred while analyzing your portfolio. Please try again later."];
  }
} 