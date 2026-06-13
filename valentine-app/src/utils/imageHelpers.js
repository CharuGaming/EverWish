/**
 * Injects Cloudinary optimization parameters into the URL.
 * Forces WebP format explicitly (f_webp) for guaranteed next-gen delivery.
 * Converts URL from:
 * https://res.cloudinary.com/.../upload/v1234/folder/img.jpg
 * To:
 * https://res.cloudinary.com/.../upload/c_scale,w_800,f_webp,q_auto/v1234/folder/img.jpg
 */
export function optimizeCloudinaryUrl(url, width = 800) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const parts = url.split('/upload/');
  if (parts.length < 2) return url;

  // Guard: avoid double-transforming if already optimized
  if (parts[1].includes('f_auto') || parts[1].includes('q_auto')) {
    return url;
  }

  return `${parts[0]}/upload/f_auto,q_auto,c_scale,w_${width}/${parts[1]}`;
}
