import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/experience
export async function GET() {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's experiences
    const experiences = await prisma.experience.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("[EXPERIENCE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/experience
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { title, company, location, startDate, endDate, description, current } = json;

    const experience = await prisma.experience.create({
      data: {
        title,
        company,
        location,
        startDate: new Date(startDate),
        endDate: current ? null : new Date(endDate),
        description,
        current,
        userId: session.user.id,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("[EXPERIENCE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PUT /api/experience
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { id, title, company, location, startDate, endDate, description, current } = json;

    const experience = await prisma.experience.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        title,
        company,
        location,
        startDate: new Date(startDate),
        endDate: current ? null : new Date(endDate),
        description,
        current,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("[EXPERIENCE_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/experience
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    await prisma.experience.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EXPERIENCE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 