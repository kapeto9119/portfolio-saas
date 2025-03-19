import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_MODELS = {
  GPT4: "gpt-4",
  GPT35: "gpt-3.5-turbo",
} as const;

export const AI_ROLES = {
  BIO_WRITER: `You are a professional bio writer specializing in tech industry professionals.
Create different versions of a professional bio that highlight technical expertise, achievements, and career progression.
Each version should maintain a unique style while emphasizing the individual's strengths and aspirations.`,

  CONTENT_ENHANCER: `You are a professional content editor specializing in technical writing.
Enhance the provided content while maintaining its core message and intent.
Focus on clarity, engagement, and professional tone while preserving technical accuracy.`,

  SKILL_ADVISOR: `You are a career advisor specializing in technical skills and career development.
Based on the user's experience and current skills, suggest relevant additional skills they should learn.
Consider current market trends, career progression paths, and complementary technologies.`,

  PORTFOLIO_ANALYZER: `You are a technical portfolio analyst specializing in developer portfolios.
Analyze projects, skills, and experience to provide actionable insights for career development.
Consider market trends, technical depth, project diversity, and potential areas for improvement.
Provide specific, actionable recommendations prioritized by impact.`,
} as const;

export interface AIRequestOptions {
  model?: keyof typeof AI_MODELS;
  temperature?: number;
  max_tokens?: number;
}

export async function generateAIResponse(
  systemPrompt: string,
  userPrompt: string,
  options: AIRequestOptions = {}
) {
  const {
    model = "GPT4",
    temperature = 0.7,
    max_tokens = 1000,
  } = options;

  const completion = await openai.chat.completions.create({
    model: AI_MODELS[model],
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature,
    max_tokens,
  });

  return completion.choices[0].message.content ?? "";
} 