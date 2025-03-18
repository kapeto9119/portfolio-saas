import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GalleryItem {
  url: string;
  title?: string;
  description?: string;
}

interface GalleryProps {
  items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div key={index} className="group relative overflow-hidden rounded-lg">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={item.url}
              alt={item.title || "Gallery image"}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </AspectRatio>
          {(item.title || item.description) && (
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
              {item.title && (
                <h3 className="font-semibold">{item.title}</h3>
              )}
              {item.description && (
                <p className="text-sm text-white/80">{item.description}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 