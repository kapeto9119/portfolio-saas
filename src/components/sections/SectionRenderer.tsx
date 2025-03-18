import { PortableText } from "@portabletext/react";
import { CustomSection } from "@prisma/client";
import { Gallery } from "@/components/sections/Gallery";
import { Timeline } from "@/components/sections/Timeline";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { SectionType, SectionContent, isTextContent, isGalleryContent, isTimelineContent, isSkillsContent, isCustomContent } from "@/types/sections";
import { parseSectionContent } from "@/lib/validation";

interface SectionRendererProps {
  section: CustomSection;
}

function renderContent(content: SectionContent) {
  if (isTextContent(content)) {
    return <PortableText value={content.content} />;
  }
  
  if (isGalleryContent(content)) {
    return <Gallery items={content.content} />;
  }
  
  if (isTimelineContent(content)) {
    return <Timeline items={content.content} />;
  }
  
  if (isSkillsContent(content)) {
    return <SkillsGrid skills={content.content} />;
  }
  
  if (isCustomContent(content)) {
    return <div dangerouslySetInnerHTML={{ __html: content.content }} />;
  }
  
  return <p>Unknown section type: {(content as SectionContent).type}</p>;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  if (!section.isPublished) {
    return null;
  }

  const validatedContent = parseSectionContent(section.content, section.type as SectionType);
  
  if (!validatedContent) {
    return (
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
        <p>Invalid content for section type: {section.type}</p>
      </section>
    );
  }

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
      {renderContent(validatedContent)}
    </section>
  );
} 