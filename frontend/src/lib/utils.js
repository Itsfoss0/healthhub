/**
 * combine multiple classnames into a single
 * string of classnames
 */

export function cn (...classes) {
  return classes.filter(Boolean).join(' ');
}
