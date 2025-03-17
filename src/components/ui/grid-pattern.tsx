import React from 'react';

interface GridPatternProps {
  className?: string;
  size?: number;
  opacity?: number;
}

export function GridPattern({
  className = '',
  size = 20,
  opacity = 0.1
}: GridPatternProps) {
  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,${opacity}) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage: 'linear-gradient(to bottom, white, transparent)'
      }}
    />
  );
} 