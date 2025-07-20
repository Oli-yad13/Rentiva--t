// Image caching utility for better performance
class ImageCache {
  private cache = new Map<string, string>();
  private preloadQueue = new Set<string>();

  // Preload image and store in cache
  async preloadImage(url: string): Promise<string> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    if (this.preloadQueue.has(url)) {
      // Already being preloaded, wait for it
      return new Promise((resolve) => {
        const checkCache = () => {
          if (this.cache.has(url)) {
            resolve(this.cache.get(url)!);
          } else {
            setTimeout(checkCache, 100);
          }
        };
        checkCache();
      });
    }

    this.preloadQueue.add(url);

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        // Create object URL for better caching
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            this.cache.set(url, objectUrl);
            this.preloadQueue.delete(url);
            resolve(objectUrl);
          })
          .catch(() => {
            // Fallback to original URL
            this.cache.set(url, url);
            this.preloadQueue.delete(url);
            resolve(url);
          });
      };

      img.onerror = () => {
        this.preloadQueue.delete(url);
        reject(new Error(`Failed to load image: ${url}`));
      };

      img.src = url;
    });
  }

  // Get cached image URL
  getCachedUrl(url: string): string | null {
    return this.cache.get(url) || null;
  }

  // Preload multiple images
  async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => 
      this.preloadImage(url).catch(() => url) // Ignore errors
    );
    await Promise.all(promises);
  }

  // Clear cache and revoke object URLs
  clearCache(): void {
    this.cache.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.cache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const imageCache = new ImageCache();

// Preload critical images on app start
export const preloadCriticalImages = async () => {
  const criticalImages = [
    '/car-logo.svg',
    '/gear-shift-1--1.svg',
    '/g1593-3.svg',
    // Add more critical images here
  ];

  try {
    await imageCache.preloadImages(criticalImages);
    console.log('✅ Critical images preloaded');
  } catch (error) {
    console.warn('⚠️ Some critical images failed to preload:', error);
  }
};