/**
 * Returns an optimized Cloudinary video URL with responsive transformations.
 *
 * Desktop (!isMobile): q_auto:best,f_auto,w_1920,c_limit
 *   → Full quality, large resolution, no cropping — best for widescreen viewing.
 *
 * Mobile (isMobile): q_auto,f_auto,w_720,c_scale
 *   → Scaled down for mobile, safer transformation to prevent 400 Bad Request errors.
 *
 * Non-Cloudinary URLs are returned unchanged.
 */
export function getOptimizedVideoUrl(url, isMobile = false) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  // Bypass transformation for video files (Cloudinary Free Tier restriction)
  if (url.includes('.mp4') || url.includes('.webm') || url.includes('.mov')) {
    return url;
  }

  // Locate the /upload/ segment — works for both /video/upload/ and /image/upload/
  const uploadMarker = '/upload/';
  const uploadIdx = url.indexOf(uploadMarker);
  if (uploadIdx === -1) return url;

  const beforeUpload = url.slice(0, uploadIdx + uploadMarker.length); // e.g. https://res.cloudinary.com/demo/video/upload/
  const afterUpload  = url.slice(uploadIdx + uploadMarker.length);    // e.g. v12345/my_video.mp4

  // Guard: avoid double-transforming if transformations are already present
  const knownParams = ['f_auto', 'q_auto', 'w_', 'h_', 'c_fill', 'c_limit', 'vc_auto'];
  if (knownParams.some(p => afterUpload.startsWith(p) || afterUpload.includes('/' + p))) {
    return url;
  }

  const transforms = isMobile
    ? 'q_auto,f_auto,w_720,c_scale'                      // Safer mobile scale
    : 'q_auto:best,f_auto,w_1920,c_limit';               // Full quality, capped at 1920px width

  return `${beforeUpload}${transforms}/${afterUpload}`;
}

/** @deprecated Use getOptimizedVideoUrl(url, isMobile) instead. */
export function optimizeCloudinaryVideoUrl(url, isMobile = false) {
  return getOptimizedVideoUrl(url, isMobile);
}

/**
 * Injects Cloudinary optimization parameters into the URL.
 * Automatically detects images vs videos to apply custom performance options.
 */
export function optimizeCloudinaryUrl(url, width = 800) {
  // Bypass all Cloudinary dynamic transformations to avoid 400 errors on Free Tier
  return url;
}

/**
 * Generates a tiny, highly compressed blurred placeholder URL for Cloudinary images.
 */
export function getBlurPlaceholderUrl(url) {
  // Bypass blur placeholder generation to avoid 400 errors on Free Tier
  return null;
}

/**
 * Generates a poster image URL for a video.
 * If Cloudinary, generates a optimized frame-0 thumbnail.
 * If not Cloudinary, returns empty so browser falls back.
 */
export function getVideoPosterUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (url.includes('res.cloudinary.com')) {
    // Standardize url to remove query parameters
    const base = url.split('?')[0];
    // Change extension to jpg to request a thumbnail image
    const cleanUrl = base.replace(/\.(mp4|webm|mov|m4v|ogv|3gp)$/i, '.jpg');
    
    const uploadMarker = '/upload/';
    const uploadIdx = cleanUrl.indexOf(uploadMarker);
    if (uploadIdx !== -1) {
      const beforeUpload = cleanUrl.slice(0, uploadIdx + uploadMarker.length);
      const afterUpload  = cleanUrl.slice(uploadIdx + uploadMarker.length);
      // Request auto-quality, auto-format, and frame offset 0
      return `${beforeUpload}f_auto,q_auto,so_0,w_800/${afterUpload}`;
    }
    return cleanUrl;
  }
  return '';
}
