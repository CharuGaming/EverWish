/**
 * Optimizes Cloudinary video URLs by downscaling, adjusting quality, and auto-detecting codecs.
 */
export function optimizeCloudinaryVideoUrl(url, isMobile = false) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  // Detect if it is video/upload
  const parts = url.split('/video/upload/');
  const isVideoUpload = parts.length >= 2;
  const baseUrl = isVideoUpload ? parts[0] + '/video' : url.split('/upload/')[0];
  const rest = isVideoUpload ? parts[1] : (url.split('/upload/')[1] || '');

  if (!rest) return url;

  // Guard: avoid double-transforming if already optimized
  if (rest.includes('f_auto') || rest.includes('q_auto') || rest.includes('vc_auto')) {
    return url;
  }

  // Downscale and compress heavily on mobile devices (e.g. w_480, q_auto:eco)
  const videoWidth = isMobile ? 480 : 854; // 480p on mobile, 480p/720p on desktop to keep it super lightweight
  const quality = isMobile ? 'q_auto:eco' : 'q_auto';

  return `${baseUrl}/upload/f_auto,${quality},vc_auto,w_${videoWidth}/${rest}`;
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
    const isMobile = typeof window !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent);
    return optimizeCloudinaryVideoUrl(url, isMobile);
  }

  const parts = url.split('/upload/');
  if (parts.length < 2) return url;

  // Guard: avoid double-transforming if already optimized
  if (parts[1].includes('f_auto') || parts[1].includes('q_auto')) {
    return url;
  }

  return `${parts[0]}/upload/f_auto,q_auto,c_scale,w_${width}/${parts[1]}`;
}
