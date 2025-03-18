import type { PortfolioTheme } from "@prisma/client";

export type ThemeVariables = {
  [key: string]: string;
};

// Supported font families with their fallbacks
export const SUPPORTED_FONTS = {
  Inter: "Inter, system-ui, sans-serif",
  Roboto: "Roboto, system-ui, sans-serif",
  "Open Sans": "'Open Sans', system-ui, sans-serif",
  Poppins: "Poppins, system-ui, sans-serif",
  Montserrat: "Montserrat, system-ui, sans-serif",
};

// Valid layout types
export type LayoutType = "grid" | "timeline" | "cards";

/**
 * Validates color format
 */
function isValidColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Validates and generates CSS variables from theme settings
 */
export function generateThemeVariables(theme: Partial<PortfolioTheme>): ThemeVariables {
  const variables: ThemeVariables = {};

  // Validate and set primary color
  if (theme.primaryColor && isValidColor(theme.primaryColor)) {
    variables["--primary-color"] = theme.primaryColor;
  } else {
    variables["--primary-color"] = "#3b82f6"; // Default blue
  }

  // Validate and set secondary color
  if (theme.secondaryColor && isValidColor(theme.secondaryColor)) {
    variables["--secondary-color"] = theme.secondaryColor;
  } else {
    variables["--secondary-color"] = "#10b981"; // Default green
  }

  // Validate and set background color
  if (theme.backgroundColor && isValidColor(theme.backgroundColor)) {
    variables["--background-color"] = theme.backgroundColor;
  } else {
    variables["--background-color"] = "#ffffff"; // Default white
  }

  // Validate and set font family
  if (theme.fontFamily && theme.fontFamily in SUPPORTED_FONTS) {
    variables["--font-family"] = SUPPORTED_FONTS[theme.fontFamily as keyof typeof SUPPORTED_FONTS];
  } else {
    variables["--font-family"] = SUPPORTED_FONTS.Inter; // Default font
  }

  return variables;
}

/**
 * Generates sanitized CSS styles from theme settings
 */
export function generateThemeStyles(theme: Partial<PortfolioTheme>): string {
  const variables = generateThemeVariables(theme);
  let styles = `
    :root {
      ${Object.entries(variables)
        .map(([key, value]) => `${key}: ${value};`)
        .join("\n      ")}
    }

    body {
      font-family: var(--font-family);
      background-color: var(--background-color);
      ${theme.backgroundImage ? `background-image: url(${theme.backgroundImage});` : ""}
      ${theme.backgroundImage ? "background-size: cover;" : ""}
      ${theme.backgroundImage ? "background-position: center;" : ""}
    }

    .theme-primary {
      color: var(--primary-color);
    }

    .theme-secondary {
      color: var(--secondary-color);
    }

    .theme-bg-primary {
      background-color: var(--primary-color);
    }

    .theme-bg-secondary {
      background-color: var(--secondary-color);
    }

    .theme-border-primary {
      border-color: var(--primary-color);
    }

    .theme-border-secondary {
      border-color: var(--secondary-color);
    }
  `;

  // Sanitize and add custom CSS if provided
  if (theme.customCss) {
    const sanitizedCss = theme.customCss
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/@import/gi, "") // Remove @import statements
      .replace(/url\(/gi, ""); // Remove url() functions
    styles += `\n${sanitizedCss}`;
  }

  return styles;
}

/**
 * Applies theme to the document and loads required fonts
 */
export async function applyTheme(theme: Partial<PortfolioTheme>) {
  // Remove existing theme style tag if it exists
  const existingStyle = document.getElementById("portfolio-theme");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Load font if needed
  if (theme.fontFamily && theme.fontFamily in SUPPORTED_FONTS) {
    try {
      await document.fonts.load(`1em ${theme.fontFamily}`);
    } catch (error) {
      console.warn(`Failed to load font: ${theme.fontFamily}`, error);
    }
  }

  // Create and append new style tag
  const style = document.createElement("style");
  style.id = "portfolio-theme";
  style.textContent = generateThemeStyles(theme);
  document.head.appendChild(style);

  // Apply theme variables to root element
  const variables = generateThemeVariables(theme);
  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

/**
 * Gets layout class based on theme layout setting
 */
export function getLayoutClass(layout: LayoutType | string): string {
  switch (layout) {
    case "grid":
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
    case "timeline":
      return "space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent";
    case "cards":
      return "grid grid-cols-1 gap-6";
    default:
      console.warn(`Invalid layout type: ${layout}, falling back to grid`);
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  }
} 