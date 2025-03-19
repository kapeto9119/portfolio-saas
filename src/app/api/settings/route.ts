import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import rateLimit from "@/lib/rate-limit";

// Initialize rate limiter
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

// Settings schema for validation
const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  theme: z.enum(["light", "dark", "system"]).optional(),
});

// Password update schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Apply rate limiting
    try {
      await limiter.check(10, session.user.email);
    } catch {
      return new NextResponse("Too many requests", { status: 429 });
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
    });

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          emailNotifications: true,
          marketingEmails: false,
          theme: "system",
        },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Apply rate limiting
    try {
      await limiter.check(5, session.user.email);
    } catch {
      return new NextResponse("Too many requests", { status: 429 });
    }

    const body = await req.json();
    
    // Validate settings data
    try {
      const validatedData = settingsSchema.parse(body);

      const settings = await prisma.userSettings.upsert({
        where: { userId: session.user.id },
        create: {
          ...validatedData,
          userId: session.user.id,
        },
        update: validatedData,
      });

      return NextResponse.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({ errors: error.errors }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("[SETTINGS_PUT]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
}

// Special endpoint for password updates
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Apply rate limiting
    try {
      await limiter.check(3, session.user.email); // Stricter limit for password changes
    } catch {
      return new NextResponse("Too many requests", { status: 429 });
    }

    const body = await req.json();
    
    try {
      const { currentPassword, newPassword } = passwordSchema.parse(body);

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { password: true },
      });

      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }

      // Verify current password (implement your password verification logic here)
      const isValidPassword = await verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        return new NextResponse("Invalid current password", { status: 400 });
      }

      // Hash new password and update
      const hashedPassword = await hashPassword(newPassword);
      await prisma.user.update({
        where: { email: session.user.email },
        data: { password: hashedPassword },
      });

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({ errors: error.errors }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("[SETTINGS_PATCH]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
}

// Helper functions for password management
async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  // Implement your password verification logic here
  // Example: return await bcrypt.compare(plain, hashed);
  return true; // Placeholder
}

async function hashPassword(password: string): Promise<string> {
  // Implement your password hashing logic here
  // Example: return await bcrypt.hash(password, 10);
  return password; // Placeholder
} 