import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/education - Get all education entries for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const educations = await prisma.education.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return NextResponse.json(educations);
  } catch (error) {
    console.error('Error fetching education:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/education - Create a new education entry
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const education = await prisma.education.create({
      data: {
        degree: json.degree,
        school: json.school,
        location: json.location,
        startDate: new Date(json.startDate),
        endDate: json.endDate ? new Date(json.endDate) : null,
        description: json.description,
        userId: user.id,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Error creating education:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT /api/education - Update an existing education entry
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { id, ...data } = json;

    // Verify ownership
    const existingEducation = await prisma.education.findFirst({
      where: {
        id,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!existingEducation) {
      return new NextResponse("Education not found or unauthorized", { status: 404 });
    }

    const education = await prisma.education.update({
      where: { id },
      data: {
        degree: data.degree,
        school: data.school,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Error updating education:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/education - Delete an education entry
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse("Education ID is required", { status: 400 });
    }

    // Verify ownership
    const existingEducation = await prisma.education.findFirst({
      where: {
        id,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!existingEducation) {
      return new NextResponse("Education not found or unauthorized", { status: 404 });
    }

    await prisma.education.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting education:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 