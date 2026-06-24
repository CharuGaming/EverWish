import React, { useState, useEffect, useRef } from 'react';
import { optimizeCloudinaryUrl, getBlurPlaceholderUrl } from '../utils/imageHelpers';

/**
 * A highly optimized progressive image loader component.
 * Features:
 * 1. Cloudinary width optimization.
 * 2. Low Quality Image Placeholder (LQIP) with blur-up effect for Cloudinary URLs.
 * 3. Animated skeleton loader fallback for non-Cloudinary URLs or as a secondary guard.
 * 4. Smooth CSS fade-in when the high-resolution image completes loading.
 */
export default function OptimizedImage({
  src,
  alt = '',
  width = 800,
  className = '',
  style = {},
  loading = 'lazy',
  onClick,
  draggable = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // Reset loading state if src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  if (!src) {
    return (
      <div 
        className={`bg-white/5 animate-pulse rounded-md flex items-center justify-center ${className}`}
        style={{ aspectRatio: '16/9', ...style }}
      >
        <span className="text-white/20 text-xs">No Image</span>
      </div>
    );
  }

  const optimizedSrc = optimizeCloudinaryUrl(src, width);
  const blurSrc = getBlurPlaceholderUrl(src);

  // Check if the image is already cached/complete
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [optimizedSrc]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ ...style }}
      onClick={onClick}
    >
      {/* 1. Low-Quality Image Placeholder (LQIP) or Skeleton Loader */}
      {!isLoaded && !error && (
        <>
          {blurSrc ? (
            <img
              src={blurSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-105"
              style={{ filter: 'blur(10px)', transition: 'opacity 0.4s ease' }}
              draggable={false}
            />
          ) : (
            <div 
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse"
              style={{
                backgroundSize: '200% 100%',
                animation: 'pulse 1.8s ease-in-out infinite'
              }}
            />
          )}
        </>
      )}

      {/* 2. Main High-Resolution Image */}
      {!error ? (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          loading={loading}
          draggable={draggable}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full transition-opacity duration-500 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectFit: style.objectFit || 'cover',
          }}
          {...props}
        />
      ) : (
        /* Fallback if image fails to load */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white/40 p-4 text-center">
          <span className="text-xl mb-1">⚠️</span>
          <span className="text-[10px] font-sans">Failed to load memory</span>
        </div>
      )}

      {/* Inline styles for pulse animation keyframes if not defined globally */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
    </div>
  );
}
