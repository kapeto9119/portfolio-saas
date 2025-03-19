import { format, parseISO } from 'date-fns';

export function formatDate(date: Date | string) {
  // Ensure we're working with a Date object
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  // Use a consistent format that won't change based on locale
  return format(dateObj, 'dd/MM/yyyy');
}

export function formatDateWithMonth(date: Date | string) {
  // Ensure we're working with a Date object
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  // Format with month name
  return format(dateObj, 'MMM d, yyyy');
}

export function formatDateRange(startDate: Date | string, endDate?: Date | string | null) {
  const start = formatDateWithMonth(startDate);
  if (!endDate) {
    return `${start} - Present`;
  }
  return `${start} - ${formatDateWithMonth(endDate)}`;
}

export function formatRelativeDate(date: Date | string) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  
  // Calculate difference in days
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} days ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
} 