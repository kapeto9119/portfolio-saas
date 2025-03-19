import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new NextResponse('Invalid file type. Only images are allowed.', { status: 400 });
    }

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return new NextResponse('File too large. Maximum size is 5MB.', { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a data URL for the image to be used as the src attribute
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:${file.type};base64,${base64Image}`;

    // Update user profile in database with both the data URL and binary data
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        image: imageUrl,      // Store the data URL for direct display
        imageData: buffer,    // Store the binary data
      },
    });

    return NextResponse.json({ url: imageUrl });
  } catch (error: any) {
    console.error('Upload error:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
} 