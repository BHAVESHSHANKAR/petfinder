import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and merges Tailwind CSS classes properly
 * @param {...string} inputs - Class names to combine
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a delay for animations
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after delay
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format number with commas for better readability
 * @param {number} number - Number to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Check if code is running in browser environment
 * @returns {boolean} - True if in browser
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Simple debounce function for performance optimization
 * @param {Function} fn - Function to debounce
 * @param {number} ms - Debounce time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(fn, ms = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
} 