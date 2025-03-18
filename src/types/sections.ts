import { PortableTextBlock } from "@portabletext/react";

// Section type discriminator
export type SectionType = "text" | "gallery" | "timeline" | "skills" | "custom";

// Content type definitions
export interface GalleryItem {
  title: string;
  description?: string;
  url: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Skill {
  name: string;
  level: number;
  description?: string;
  category: string;
}

// Discriminated union for section content
export type SectionContent = 
  | { type: "text"; content: PortableTextBlock[] }
  | { type: "gallery"; content: GalleryItem[] }
  | { type: "timeline"; content: TimelineItem[] }
  | { type: "skills"; content: Skill[] }
  | { type: "custom"; content: string };

// Type guard functions
export function isTextContent(content: SectionContent): content is { type: "text"; content: PortableTextBlock[] } {
  return content.type === "text";
}

export function isGalleryContent(content: SectionContent): content is { type: "gallery"; content: GalleryItem[] } {
  return content.type === "gallery";
}

export function isTimelineContent(content: SectionContent): content is { type: "timeline"; content: TimelineItem[] } {
  return content.type === "timeline";
}

export function isSkillsContent(content: SectionContent): content is { type: "skills"; content: Skill[] } {
  return content.type === "skills";
}

export function isCustomContent(content: SectionContent): content is { type: "custom"; content: string } {
  return content.type === "custom";
}

// Helper type to get content type for a specific section type
export type ContentForType<T extends SectionType> = Extract<SectionContent, { type: T }>["content"]; 