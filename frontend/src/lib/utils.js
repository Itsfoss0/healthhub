/**
 * combine multiple classnames into a single
 * string of classnames
 */

export function cn (...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate (dateString) {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}
