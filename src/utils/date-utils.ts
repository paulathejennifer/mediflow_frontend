/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Formats a date string or Date object into a user-friendly format
 * @param date - Date string (ISO format) or Date object
 * @param options - Formatting options
 * @returns Formatted date string (e.g., "May 11, 2026")
 */
export function formatDate(
  date: string | Date, 
  options: {
    includeTime?: boolean;
    format?: 'long' | 'short' | 'medium';
  } = {}
): string {
  const { includeTime = false, format = 'long' } = options;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : format === 'medium' ? 'short' : 'long',
    day: 'numeric',
  };
  
  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
    formatOptions.hour12 = true;
  }
  
  return dateObj.toLocaleDateString('en-US', formatOptions);
}

/**
 * Formats a date string into a relative time format (e.g., "2 days ago", "Yesterday")
 * @param date - Date string (ISO format) or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays === 0) {
    if (diffHours === 0) {
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

/**
 * Formats a date string into a short format suitable for tables (e.g., "May 11, 2026")
 * @param date - Date string (ISO format) or Date object
 * @returns Short formatted date string
 */
export function formatTableDate(date: string | Date): string {
  return formatDate(date, { format: 'medium' });
}

/**
 * Checks if a date is today
 * @param date - Date string (ISO format) or Date object
 * @returns True if the date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is within the last N days
 * @param date - Date string (ISO format) or Date object
 * @param days - Number of days to check
 * @returns True if the date is within the last N days
 */
export function isWithinLastNDays(date: string | Date, days: number): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= days;
}
