import React from 'react';

interface HeroPreviewProps {
  className?: string;
}

export function HeroPreview({ className = '' }: HeroPreviewProps) {
  return (
    <div className={`relative w-full h-full bg-background rounded-lg shadow-2xl ${className}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-card border-b flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </div>
      
      {/* Content */}
      <div className="absolute top-12 left-0 right-0 bottom-0 p-6">
        <div className="flex gap-6 h-full">
          {/* Sidebar */}
          <div className="w-64 bg-muted rounded-lg p-4 flex flex-col gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto" />
            <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-primary/10 rounded" />
              ))}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="h-8 bg-primary/20 rounded w-1/2" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-4 bg-primary/10 rounded" />
              ))}
            </div>
            
            {/* Projects Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-video bg-primary/10 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 