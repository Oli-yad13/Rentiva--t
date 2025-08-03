/**
 * Image caching utility for better performance
 * Handles image preloading, caching, and optimization
 */

interface CacheEntry {
  url: string;
  blob: Blob;
  timestamp: number;
  accessCount: number;
}

class ImageCache {
  private cache = new Map<string, CacheEntry>();
  private readonly maxCacheSize = 50; // Maximum number of images to cache
  private readonly maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  /**
   * Preload an image and store it in cache
   */
  async preloadImage(url: string): Promise<string> {
    // Check if already cached and valid
    const cached = this.cache.get(url);
    if (cached && this.isValidCacheEntry(cached)) {
      cached.accessCount++;
      return URL.createObjectURL(cached.blob);
    }

    try {
      // Fetch the image
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Store in cache
      this.cache.set(url, {
        url,
        blob,
        timestamp: Date.now(),
        accessCount: 1,
      });

      // Clean up old entries if cache is full
      this.cleanupCache();

      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn(`Failed to cache image ${url}:`, error);
      return url; // Return original URL as fallback
    }
  }

  /**
   * Get cached image URL or return original if not cached
   */
  getCachedImageUrl(url: string): string {
    const cached = this.cache.get(url);
    if (cached && this.isValidCacheEntry(cached)) {
      cached.accessCount++;
      return URL.createObjectURL(cached.blob);
    }
    return url;
  }

  /**
   * Preload multiple images concurrently
   */
  async preloadImages(urls: string[]): Promise<string[]> {
    const promises = urls.map(url => this.preloadImage(url));
    return Promise.all(promises);
  }

  /**
   * Check if a cache entry is still valid
   */
  private isValidCacheEntry(entry: CacheEntry): boolean {
    const age = Date.now() - entry.timestamp;
    return age < this.maxAge;
  }

  /**
   * Clean up old or least accessed cache entries
   */
  private cleanupCache(): void {
    if (this.cache.size <= this.maxCacheSize) {
      return;
    }

    // Convert to array and sort by access count and age
    const entries = Array.from(this.cache.entries()).map(([url, entry]) => ({
      url,
      entry,
      score: entry.accessCount - (Date.now() - entry.timestamp) / (60 * 60 * 1000), // Favor recent and frequently accessed
    }));

    entries.sort((a, b) => a.score - b.score);

    // Remove the least valuable entries
    const toRemove = entries.slice(0, entries.length - this.maxCacheSize + 10); // Remove extra to avoid frequent cleanup
    
    toRemove.forEach(({ url, entry }) => {
      // Revoke the blob URL to free memory
      URL.revokeObjectURL(URL.createObjectURL(entry.blob));
      this.cache.delete(url);
    });
  }

  /**
   * Clear all cached images
   */
  clearCache(): void {
    // Revoke all blob URLs
    this.cache.forEach(entry => {
      URL.revokeObjectURL(URL.createObjectURL(entry.blob));
    });
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    totalAccessCount: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    if (this.cache.size === 0) {
      return {
        size: 0,
        totalAccessCount: 0,
        oldestEntry: 0,
        newestEntry: 0,
      };
    }

    const entries = Array.from(this.cache.values());
    const totalAccessCount = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const timestamps = entries.map(entry => entry.timestamp);

    return {
      size: this.cache.size,
      totalAccessCount,
      oldestEntry: Math.min(...timestamps),
      newestEntry: Math.max(...timestamps),
    };
  }

  /**
   * Remove expired entries
   */
  removeExpiredEntries(): void {
    const now = Date.now();
    const toRemove: string[] = [];

    this.cache.forEach((entry, url) => {
      if (!this.isValidCacheEntry(entry)) {
        toRemove.push(url);
        URL.revokeObjectURL(URL.createObjectURL(entry.blob));
      }
    });

    toRemove.forEach(url => this.cache.delete(url));
  }
}

// Create a singleton instance
export const imageCache = new ImageCache();

// Utility functions for easy use
export const preloadImage = (url: string) => imageCache.preloadImage(url);
export const preloadImages = (urls: string[]) => imageCache.preloadImages(urls);
export const getCachedImageUrl = (url: string) => imageCache.getCachedImageUrl(url);
export const clearImageCache = () => imageCache.clearCache();
export const getImageCacheStats = () => imageCache.getCacheStats();

// Auto cleanup expired entries every 30 minutes
setInterval(() => {
  imageCache.removeExpiredEntries();
}, 30 * 60 * 1000);

export default imageCache;
