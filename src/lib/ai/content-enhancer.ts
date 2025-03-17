"use server";

import OpenAI from "openai";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth/session";
import { EnhancementType, Tone } from '@/types/ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Enhance content using OpenAI's API
 * 
 * @param content - The original content to enhance
 * @param type - The type of enhancement to apply
 * @param tone - The tone to apply to the content
 * @returns The enhanced content
 */
export async function enhanceContent(
  content: string,
  type: EnhancementType = 'improve',
  tone: Tone = 'professional'
): Promise<string> {
  // Input validation
  if (!content || content.trim().length === 0) {
    throw new Error('Content is required');
  }
  
  // Set a reasonable maximum length
  if (content.length > 5000) {
    throw new Error('Content is too long. Maximum 5000 characters allowed.');
  }
  
  // Create prompt based on enhancement type
  let prompt = '';
  let systemPrompt = '';

  switch (type) {
    case 'improve':
      systemPrompt = `You are an expert content enhancer specialized in improving portfolio text. 
      Enhance the provided content by improving clarity, professionalism, and impact. 
      Maintain the same overall meaning but make it more compelling and impressive.
      Tone: ${tone}`;
      prompt = `Please enhance the following portfolio content while maintaining its meaning but making it more impactful:\n\n${content}`;
      break;
      
    case 'proofread':
      systemPrompt = `You are an expert proofreader. 
      Fix grammar, spelling, and punctuation errors in the provided text.
      Improve readability without changing the meaning or adding new information.
      Tone: ${tone}`;
      prompt = `Please proofread the following portfolio content:\n\n${content}`;
      break;
      
    case 'simplify':
      systemPrompt = `You are an expert in simplifying complex content. 
      Make the provided text more concise and easier to understand.
      Remove jargon and complex sentences without losing key information.
      Tone: ${tone}`;
      prompt = `Please simplify the following portfolio content:\n\n${content}`;
      break;
      
    case 'expand':
      systemPrompt = `You are an expert in content expansion. 
      Elaborate on the provided text by adding relevant details, examples, and context.
      Make it more comprehensive and thorough without changing the core message.
      Tone: ${tone}`;
      prompt = `Please expand on the following portfolio content by adding relevant details:\n\n${content}`;
      break;
      
    case 'keywords':
      systemPrompt = `You are an expert in optimizing portfolio content for discoverability. 
      Enhance the provided text by incorporating relevant industry keywords and phrases.
      Make it more searchable and discoverable without making it sound unnatural.
      Tone: ${tone}`;
      prompt = `Please optimize the following portfolio content with relevant industry keywords:\n\n${content}`;
      break;
      
    default:
      systemPrompt = `You are an expert content enhancer specialized in improving portfolio text. 
      Enhance the provided content by improving clarity, professionalism, and impact. 
      Maintain the same overall meaning but make it more compelling and impressive.
      Tone: ${tone}`;
      prompt = `Please enhance the following portfolio content while maintaining its meaning but making it more impactful:\n\n${content}`;
  }
  
  try {
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });
    
    // Extract and return the enhanced content
    const enhancedContent = response.choices[0].message.content;
    
    if (!enhancedContent) {
      throw new Error('Failed to generate enhanced content');
    }
    
    return enhancedContent;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to enhance content');
  }
}

/**
 * Generate a professional bio based on skills, experience, and education
 * 
 * @param skills - The user's skills
 * @param experience - The user's work experience
 * @param education - The user's educational background
 * @param tone - The tone to apply to the bio
 * @returns The generated bio
 */
export async function generateBio(
  skills: string[],
  experience: string,
  education: string,
  tone: Tone = 'professional'
): Promise<string> {
  const systemPrompt = `You are an expert in creating compelling professional bios for portfolios.
  Create a concise, engaging bio that highlights the person's skills, experience, and education.
  The bio should be well-structured, around 3-4 paragraphs, and written in the ${tone} tone.
  Focus on career achievements, unique selling points, and professional identity.`;
  
  const prompt = `Please generate a professional bio based on the following information:
  
  Skills: ${skills.join(', ')}
  
  Experience: ${experience}
  
  Education: ${education}
  
  Tone: ${tone}
  `;
  
  try {
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });
    
    // Extract and return the bio
    const bioContent = response.choices[0].message.content;
    
    if (!bioContent) {
      throw new Error('Failed to generate bio');
    }
    
    return bioContent;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate bio');
  }
}

/**
 * Recommend skills based on job title, current skills, and experience
 * 
 * @param jobTitle - The user's job title
 * @param currentSkills - The user's current skills
 * @param experience - The user's work experience
 * @returns An array of recommended skills
 */
export async function recommendSkills(
  jobTitle: string,
  currentSkills?: string[],
  experience?: string
): Promise<string[]> {
  const systemPrompt = `You are an expert career advisor with deep knowledge of technical and professional skills across industries.
  Recommend relevant skills for a given job title, considering the person's current skills and experience.
  Focus on both technical skills and soft skills that would make them more competitive in the job market.
  Provide skills that are in-demand, relevant to the job title, and complement their existing skillset.`;
  
  const prompt = `Please recommend relevant skills for someone with the following profile:
  
  Job Title: ${jobTitle}
  ${currentSkills ? `Current Skills: ${currentSkills.join(', ')}` : ''}
  ${experience ? `Experience: ${experience}` : ''}
  
  Provide a list of 10-15 recommended skills they should develop or highlight in their portfolio.
  Format the response as a simple JSON array of strings.
  `;
  
  try {
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });
    
    // Extract and return the skills
    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error('Failed to generate skill recommendations');
    }
    
    try {
      const parsedResponse = JSON.parse(content);
      
      if (Array.isArray(parsedResponse.skills)) {
        return parsedResponse.skills;
      } else {
        // In case the model didn't format as expected
        return Object.values(parsedResponse).flat().filter(item => typeof item === 'string');
      }
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      // Fallback: try to extract skills from text if JSON parsing fails
      const skillsMatch = content.match(/\"[^"]+\"/g);
      if (skillsMatch) {
        return skillsMatch.map(match => match.replace(/\"/g, ''));
      } else {
        throw new Error('Failed to parse skill recommendations');
      }
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to recommend skills');
  }
}

/**
 * Get skill recommendations based on a user's background and interests
 */
export async function getSkillRecommendations(
  currentSkills: string[],
  jobTitle: string,
  interests: string,
): Promise<{
  recommendations: { name: string; category: string; reason: string }[];
  error?: string;
}> {
  try {
    const user = await getUser();
    
    if (!user) {
      return {
        recommendations: [],
        error: "You must be logged in to use this feature",
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: `You are a career advisor specialized in technical skill development. Your task is to recommend relevant skills for the user based on their current skillset, job title, and interests. Provide recommendations that would be valuable to showcase on a portfolio.`
        },
        { 
          role: "user", 
          content: `My current skills: ${currentSkills.join(", ")}
          Job title: ${jobTitle}
          Interests: ${interests}
          
          Please recommend additional skills that would complement my existing skillset and be valuable to showcase on my portfolio. For each skill, explain why it's relevant and what category it belongs to.`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      return {
        recommendations: [],
        error: "No recommendations generated",
      };
    }
    
    try {
      const parsedResponse = JSON.parse(content);
      const recommendations = parsedResponse.recommendations || parsedResponse.skills || [];
      
      await saveContentGeneration(
        user.id,
        "skill-recommendations",
        `Current skills: ${currentSkills.join(", ")}, Job title: ${jobTitle}, Interests: ${interests}`,
        content,
        "gpt-4",
        response.usage?.total_tokens || 0
      );
      
      return { recommendations };
    } catch (e) {
      console.error("Error parsing skill recommendations:", e, content);
      return {
        recommendations: [],
        error: "Failed to parse recommendations",
      };
    }
  } catch (error) {
    console.error("Error getting skill recommendations:", error);
    return {
      recommendations: [],
      error: "Failed to generate skill recommendations. Please try again later.",
    };
  }
}

/**
 * Get tailored system prompts based on content type and other factors
 */
function getSystemPrompt(
  contentType: string,
  tone: string,
  targetAudience: string,
  length: string
): string {
  const baseProfessionalWriterPrompt = `You are an expert portfolio content writer who specializes in creating impactful, ${tone} content for professionals. Your writing is tailored for ${targetAudience}. Keep the content ${length} in length compared to the original.`;
  
  switch (contentType) {
    case "improve-bio":
      return `${baseProfessionalWriterPrompt} Your task is to enhance professional bios, emphasizing achievements and unique strengths while maintaining the person's authentic voice. Focus on making the bio engaging, clear, and memorable.`;
    
    case "project-description":
      return `${baseProfessionalWriterPrompt} Your task is to improve project descriptions for portfolios. Highlight technical achievements, challenges overcome, and outcomes. Use clear, concise language with relevant technical terms where appropriate. Structure with problem, solution, and results when possible.`;
    
    case "experience-accomplishments":
      return `${baseProfessionalWriterPrompt} Your task is to enhance descriptions of professional accomplishments. Use strong action verbs, quantify achievements when possible, and emphasize impact. Focus on specific contributions and results rather than general responsibilities.`;
    
    case "skill-recommendations":
      return `${baseProfessionalWriterPrompt} Your task is to recommend relevant skills based on a person's current skillset and career goals. Provide thoughtful suggestions that would complement their existing skills and be valuable to showcase on their portfolio.`;
    
    case "general-improvement":
    default:
      return `${baseProfessionalWriterPrompt} Your task is to improve the quality, clarity, and impact of the content while preserving the original meaning and key points. Fix grammatical issues, enhance readability, and make the writing more compelling.`;
  }
}

/**
 * Save content generation history to the database
 */
async function saveContentGeneration(
  userId: string,
  contentType: string,
  prompt: string,
  result: string,
  modelUsed: string,
  tokens: number,
): Promise<void> {
  try {
    await prisma.aIContentGeneration.create({
      data: {
        userId,
        contentType,
        prompt,
        result,
        modelUsed,
        tokens,
      },
    });
  } catch (error) {
    console.error("Error saving content generation history:", error);
    // Don't throw here, as we don't want to fail the main function if this fails
  }
} 