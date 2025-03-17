import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names using clsx and tailwind-merge
 * This allows for conditional classes and deduplication of Tailwind classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
} 