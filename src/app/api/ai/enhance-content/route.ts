import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { enhanceContent } from '@/lib/ai-service';
import { z } from 'zod';

// Schema for content enhancement request
const enhanceRequestSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
  profession: z.enum(['technology', 'design', 'legal', 'healthcare', 'education', 'finance', 'other']),
  tone: z.enum(['formal', 'conversational', 'technical', 'creative']).default('formal'),
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
      const { content, profession, tone } = enhanceRequestSchema.parse(body);
      
      // Enhance content using AI service
      const enhancedContent = await enhanceContent(
        content,
        profession,
        tone
      );
      
      return NextResponse.json({ content: enhancedContent });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error enhancing content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 