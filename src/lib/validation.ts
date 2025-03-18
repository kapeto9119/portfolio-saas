import { PortableTextBlock } from "@portabletext/react";
import {
  SectionType,
  SectionContent,
  GalleryItem,
  TimelineItem,
  Skill
} from "@/types/sections";

function isPortableTextBlock(value: unknown): value is PortableTextBlock[] {
  if (!Array.isArray(value)) return false;
  return value.every(block => 
    typeof block === "object" && 
    block !== null && 
    "_type" in block && 
    "children" in block
  );
}

function isGalleryItems(value: unknown): value is GalleryItem[] {
  if (!Array.isArray(value)) return false;
  return value.every(item => 
    typeof item === "object" && 
    item !== null && 
    "title" in item && 
    "url" in item
  );
}

function isTimelineItems(value: unknown): value is TimelineItem[] {
  if (!Array.isArray(value)) return false;
  return value.every(item => 
    typeof item === "object" && 
    item !== null && 
    "date" in item && 
    "title" in item && 
    "description" in item
  );
}

function isSkillItems(value: unknown): value is Skill[] {
  if (!Array.isArray(value)) return false;
  return value.every(item => 
    typeof item === "object" && 
    item !== null && 
    "name" in item && 
    "level" in item && 
    "category" in item
  );
}

export function parseSectionContent(rawContent: unknown, type: SectionType): SectionContent | null {
  try {
    const content = typeof rawContent === "string" ? JSON.parse(rawContent) : rawContent;

    switch (type) {
      case "text":
        return isPortableTextBlock(content) 
          ? { type, content } 
          : null;
      case "gallery":
        return isGalleryItems(content) 
          ? { type, content }
          : null;
      case "timeline":
        return isTimelineItems(content)
          ? { type, content }
          : null;
      case "skills":
        return isSkillItems(content)
          ? { type, content }
          : null;
      case "custom":
        return typeof content === "string"
          ? { type, content }
          : null;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error validating content for section type ${type}:`, error);
    return null;
  }
} 