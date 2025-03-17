import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { generateContentSuggestion } from '@/lib/ai-service';
import { z } from 'zod';

// Schema for content generation request
const contentRequestSchema = z.object({
  profession: z.enum(['technology', 'design', 'legal', 'healthcare', 'education', 'finance', 'other']),
  contentType: z.enum(['bio', 'project', 'experience', 'skill', 'education']),
  experience: z.string().optional().default(''),
  education: z.string().optional().default(''),
  skills: z.array(z.string()).optional().default([]),
});

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    
    try {
      const { profession, contentType, experience, education, skills } = contentRequestSchema.parse(body);
      
      // Generate content using AI service
      const content = await generateContentSuggestion({
        profession,
        contentType,
        experience,
        education,
        skills,
      });
      
      return NextResponse.json({ content });
    } catch (validationError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 