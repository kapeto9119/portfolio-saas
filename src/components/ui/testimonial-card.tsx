import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  imageSrc: string;
}

export function TestimonialCard({
  name,
  role,
  company,
  content,
  imageSrc
}: TestimonialCardProps) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-muted-foreground">
            {role} at {company}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground">{content}</p>
      <div className="flex gap-1 mt-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>
    </div>
  );
} 