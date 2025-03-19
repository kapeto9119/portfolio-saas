import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Project schema for validation
const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(10, "Description should be at least 10 characters").max(500, "Description should not exceed 500 characters"),
  technologies: z.array(z.string()),
  liveUrl: z.string().url("Invalid URL").optional().nullable(),
  repoUrl: z.string().url("Invalid URL").optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isFeatured: z.boolean().optional().default(false),
  order: z.number().optional().default(0)
});

/**
 * GET /api/projects - Get all projects for the current user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        { order: 'asc' },
        { updatedAt: 'desc' }
      ]
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects - Create a new project
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    // Validate the request body
    const validationResult = projectSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    // Create the project
    const project = await prisma.project.create({
      data: {
        ...validationResult.data,
        userId: session.user.id,
      },
    });
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects - Update a project
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Validate the request body
    const validationResult = projectSchema.partial().safeParse(data);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    // Check if the project exists and belongs to the user
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { userId: true }
    });
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    if (existingProject.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this project' },
        { status: 403 }
      );
    }
    
    // Update the project
    const project = await prisma.project.update({
      where: { id },
      data: validationResult.data,
    });
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects - Delete a project
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the project exists and belongs to the user
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { userId: true }
    });
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    if (existingProject.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this project' },
        { status: 403 }
      );
    }
    
    // Delete the project
    await prisma.project.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 