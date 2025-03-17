/**
 * Types related to AI enhancement features
 */

/**
 * Types of content enhancement supported by the AI
 */
export type EnhancementType = 
  | 'improve'     // General improvement of content
  | 'proofread'   // Fix grammar and spelling
  | 'simplify'    // Make content more concise
  | 'expand'      // Add more details to content
  | 'keywords';   // Optimize with keywords

/**
 * Tone options for AI-generated content
 */
export type Tone = 
  | 'professional' // Formal, business-like tone
  | 'conversational' // Friendly, casual tone
  | 'technical' // Detailed, precise, technical tone
  | 'enthusiastic' // Energetic, positive tone
  | 'authoritative'; // Expert, confident tone

/**
 * AI request data for analytics
 */
export interface AIRequestData {
  userId: string;
  requestType: string;
  promptLength: number;
  responseLength?: number;
  model?: string;
  tokensUsed?: number;
  createdAt?: Date;
}

/**
 * Content enhancement request parameters
 */
export interface EnhanceContentParams {
  content: string;
  type?: EnhancementType;
  tone?: Tone;
  userId: string;
}

/**
 * Bio generation request parameters
 */
export interface GenerateBioParams {
  skills: string[];
  experience: string;
  education: string;
  tone?: Tone;
  userId: string;
}

/**
 * Skill recommendation request parameters
 */
export interface RecommendSkillsParams {
  jobTitle: string;
  currentSkills?: string[];
  experience?: string;
  userId: string;
} 