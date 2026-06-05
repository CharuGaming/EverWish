/**
 * colorHelpers.js
 * Smart color utility functions for EverWish templates.
 * Ensures dynamic admin-selected colors always render with accessible contrast.
 */

/**
 * Parses a hex color string (with or without #) to RGB components.
 * Returns null if the input is invalid.
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number } | null}
 */
function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;
  const clean = hex.replace('#', '').trim();

  // Support shorthand #abc → #aabbcc
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;

  if (full.length !== 6) return null;

  const n = parseInt(full, 16);
  if (isNaN(n)) return null;

  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

/**
 * Returns '#000000' or '#FFFFFF' — whichever gives better readability
 * against the given background hex color. Uses the YIQ luminance formula.
 *
 * @param {string} hexColor - Background color as a hex string (e.g. '#8b5cf6')
 * @param {string} [fallback='#FFFFFF'] - Value to return when hexColor is invalid
 * @returns {'#000000' | '#FFFFFF'}
 */
export function getContrastYIQ(hexColor, fallback = '#FFFFFF') {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return fallback;
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}

/**
 * Returns a lightened version of the hex color.
 * Useful for hover states, backgrounds, and tints.
 *
 * @param {string} hex
 * @param {number} amount - Amount to add to each channel (0–255)
 * @returns {string} hex color
 */
export function lightenColor(hex, amount = 40) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const clamp = v => Math.min(255, Math.max(0, v));
  const toHex = v => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r + amount)}${toHex(rgb.g + amount)}${toHex(rgb.b + amount)}`;
}

/**
 * Returns a darkened version of the hex color.
 * Useful for borders, shadows, and pressed states.
 *
 * @param {string} hex
 * @param {number} amount - Amount to subtract from each channel (0–255)
 * @returns {string} hex color
 */
export function darkenColor(hex, amount = 30) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const clamp = v => Math.min(255, Math.max(0, v));
  const toHex = v => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r - amount)}${toHex(rgb.g - amount)}${toHex(rgb.b - amount)}`;
}

/**
 * Returns a hex color with a given opacity as an rgba() string.
 * Safe fallback for backgrounds and overlay tints.
 *
 * @param {string} hex
 * @param {number} opacity - 0 to 1
 * @returns {string} rgba() string
 */
export function hexWithOpacity(hex, opacity = 0.15) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${opacity})`;
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;
}
