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
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  // Detect if it is a video URL
  const isVideo = url.includes('/video/') || /\.(mp4|webm|mov|m4v|ogv|3gp)($|\?)/i.test(url.split('?')[0]);
  if (isVideo) {
    // Fallback UA sniff only — prefer passing isMobile from a React hook in components.
    const isMobile = typeof window !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent);
    return getOptimizedVideoUrl(url, isMobile);
  }

  const parts = url.split('/upload/');
  if (parts.length < 2) return url;

  // Guard: Cloudinary dynamic transformations fail if the public ID contains dots (.)
  if (parts[1].split('.').length > 2) {
    return url;
  }

  // Guard: avoid double-transforming if already optimized
  if (parts[1].includes('f_auto') || parts[1].includes('q_auto')) {
    return url;
  }

  return `${parts[0]}/upload/f_auto,q_auto,c_scale,w_${width}/${parts[1]}`;
}
