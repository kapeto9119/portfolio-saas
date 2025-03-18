"use server";

import OpenAI from "openai";
import { prisma } from "@/server/models/prisma";
import { getUser } from "@/server/services/session-service";
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
      systemPrompt = `You are a professional editor specialized in proofreading. 
      Correct any spelling, grammar, punctuation, or syntax errors in the provided text.
      Maintain the original tone and voice.
      Tone: ${tone}`;
      prompt = `Please proofread and correct the following portfolio content:\n\n${content}`;
      break;
    case 'simplify':
      systemPrompt = `You are a content simplification expert.
      Make the provided text more concise and easier to understand.
      Remove unnecessary words, jargon, and complexity while keeping the core message intact.
      Tone: ${tone}`;
      prompt = `Please simplify the following portfolio content to make it more concise and clear:\n\n${content}`;
      break;
    case 'expand':
      systemPrompt = `You are a content development specialist.
      Add more detail, examples, and context to the provided text.
      Elaborate on key points to make the content more comprehensive and informative.
      Tone: ${tone}`;
      prompt = `Please expand the following portfolio content with more details and examples:\n\n${content}`;
      break;
    case 'keywords':
      systemPrompt = `You are an SEO and keyword optimization expert.
      Enhance the provided text by incorporating relevant industry keywords.
      Make the content more searchable while maintaining a natural flow.
      Tone: ${tone}`;
      prompt = `Please optimize the following portfolio content with relevant industry keywords:\n\n${content}`;
      break;
    default:
      throw new Error(`Unsupported enhancement type: ${type}`);
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
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    
    // Provide more specific error messages based on the error type
    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.status === 400) {
      throw new Error('Invalid request to AI service. Please check your input and try again.');
    } else if (error.status === 500) {
      throw new Error('AI service is currently unavailable. Please try again later.');
    }
    
    throw new Error('Failed to enhance content');
  }
}

/**
 * Generate a professional bio based on skills, experience, and education
 * 
 * @param skills - Array of professional skills
 * @param experience - Work experience summary
 * @param education - Education background
 * @param tone - The tone to apply to the bio
 * @returns The generated bio content
 */
export async function generateBio(
  skills: string[],
  experience: string,
  education: string,
  tone: Tone = 'professional'
): Promise<string> {
  // Input validation
  if (!skills || skills.length === 0) {
    throw new Error('At least one skill is required');
  }
  
  if (!experience || experience.trim().length === 0) {
    throw new Error('Experience information is required');
  }
  
  if (!education || education.trim().length === 0) {
    throw new Error('Education information is required');
  }
  
  // Format skills as a comma-separated list
  const skillsList = skills.join(', ');
  
  // Create the system prompt based on tone
  const systemPrompt = `You are an expert professional bio writer.
  Create a compelling professional bio that showcases the person's skills, experience, and education.
  Make the bio engaging, concise, and impactful.
  Tone: ${tone}`;
  
  // Create the user prompt with the provided information
  const userPrompt = `Please generate a professional bio based on the following information:
  
  Skills: ${skillsList}
  
  Experience:
  ${experience}
  
  Education:
  ${education}
  
  The bio should be approximately 150-200 words and highlight the most impressive aspects of the person's background.`;
  
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
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });
    
    // Extract and return the generated bio
    const bioContent = response.choices[0].message.content;
    
    if (!bioContent) {
      throw new Error('Failed to generate bio');
    }
    
    // Get current user for tracking
    const user = await getUser();
    if (user) {
      await saveContentGeneration(
        user.id,
        'bio-generation',
        userPrompt,
        bioContent,
        'gpt-4-turbo',
        response.usage?.total_tokens || 0
      );
    }
    
    return bioContent;
  } catch (error: any) {
    console.error('Error generating bio:', error);
    
    // Provide more specific error messages based on the error type
    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.status === 400) {
      throw new Error('Invalid request to AI service. Please check your input and try again.');
    } else if (error.status === 500) {
      throw new Error('AI service is currently unavailable. Please try again later.');
    }
    
    throw new Error('Failed to generate bio');
  }
}

/**
 * Recommend skills based on job title, current skills, and experience
 * 
 * @param jobTitle - The job title to recommend skills for
 * @param currentSkills - Optional array of current skills
 * @param experience - Optional work experience summary
 * @returns Array of recommended skills
 */
export async function recommendSkills(
  jobTitle: string,
  currentSkills?: string[],
  experience?: string
): Promise<string[]> {
  // Input validation
  if (!jobTitle || jobTitle.trim().length === 0) {
    throw new Error('Job title is required');
  }
  
  // Format current skills if provided
  const skillsList = currentSkills && currentSkills.length > 0 
    ? currentSkills.join(', ')
    : 'None provided';
  
  // Create the system prompt
  const systemPrompt = `You are an expert career coach and industry analyst.
  Recommend relevant skills for the specified job title that would make a job seeker more competitive.
  Focus on both technical and soft skills that are in demand in the current job market.
  If the user has provided current skills, recommend complementary skills they might be missing.
  If the user has provided experience, tailor recommendations based on their background.`;
  
  // Create the user prompt with the provided information
  const userPrompt = `Please recommend 5-10 skills for someone pursuing a career as a ${jobTitle}.
  
  Current Skills: ${skillsList}
  
  ${experience ? `Experience:\n${experience}` : 'No experience information provided.'}
  
  Please provide the skills as a simple list without descriptions or explanations. Focus on specific, marketable skills rather than general qualities.`;
  
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
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });
    
    // Extract the response content
    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error('Failed to generate skill recommendations');
    }
    
    // Parse the skills from the response
    // Split by newlines and clean up any bullet points or numbers
    const skills = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Remove bullet points, numbers, or other list markers
        return line.replace(/^[-•*\d.)\s]+/, '').trim();
      })
      .filter(skill => skill.length > 0);
    
    // Get current user for tracking
    const user = await getUser();
    if (user) {
      await saveContentGeneration(
        user.id,
        'skill-recommendation',
        userPrompt,
        content,
        'gpt-4-turbo',
        response.usage?.total_tokens || 0
      );
    }
    
    return skills;
  } catch (error: any) {
    console.error('Error recommending skills:', error);
    
    // Provide more specific error messages based on the error type
    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.status === 400) {
      throw new Error('Invalid request to AI service. Please check your input and try again.');
    } else if (error.status === 500) {
      throw new Error('AI service is currently unavailable. Please try again later.');
    }
    
    throw new Error('Failed to recommend skills');
  }
}

/**
 * Save content generation history to the database
 */
async function saveContentGeneration(
  userId: string,
  requestType: string,
  prompt: string,
  result: string,
  model: string,
  tokens: number,
): Promise<void> {
  try {
    await prisma.aIRequest.create({
      data: {
        userId,
        requestType,
        promptLength: prompt.length,
        responseLength: result.length,
        model,
      },
    });
  } catch (error) {
    console.error("Error saving content generation history:", error);
    // Don't throw here, as we don't want to fail the main function if this fails
  }
} 