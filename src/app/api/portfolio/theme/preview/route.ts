import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { generateThemeStyles } from "@/lib/theme";

// Theme schema for validation (same as main theme schema)
const themeSchema = z.object({
  layout: z.enum(["grid", "timeline", "cards"]),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  fontFamily: z.string(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  backgroundImage: z.string().optional().nullable(),
  customCss: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    // Validate theme data
    const validatedData = themeSchema.parse(body);

    // Sanitize custom CSS if present
    if (validatedData.customCss) {
      // Basic CSS sanitization - remove potentially harmful content
      validatedData.customCss = validatedData.customCss
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/@import/gi, "") // Remove @import statements
        .replace(/url\(/gi, ""); // Remove url() functions
    }

    // Generate preview styles
    const styles = generateThemeStyles(validatedData);

    return new NextResponse(styles, {
      headers: { "Content-Type": "text/css" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid theme data", { status: 400 });
    }

    console.error("[THEME_PREVIEW]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 