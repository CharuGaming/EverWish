/**
 * Injects Cloudinary optimization parameters into the URL.
 * Converts URL from:
 * https://res.cloudinary.com/.../upload/v1234/folder/img.jpg
 * To:
 * https://res.cloudinary.com/.../upload/c_scale,w_800,f_auto,q_auto/v1234/folder/img.jpg
 */
export function optimizeCloudinaryUrl(url, width = 800) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const parts = url.split('/upload/');
  if (parts.length < 2) return url;

  return `${parts[0]}/upload/c_scale,w_${width},f_auto,q_auto/${parts[1]}`;
}
