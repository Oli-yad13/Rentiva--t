/**
 * Vehicle placeholder utilities for loading states and fallback images
 */

export interface PlaceholderConfig {
  width: number;
  height: number;
  backgroundColor?: string;
  textColor?: string;
  text?: string;
  vehicleType?: VehicleType;
}

export type VehicleType = 
  | 'sedan' 
  | 'suv' 
  | 'hatchback' 
  | 'convertible' 
  | 'truck' 
  | 'van' 
  | 'luxury' 
  | 'electric'
  | 'hybrid';

// Default placeholder configurations for different vehicle types
const defaultPlaceholderConfigs: Record<VehicleType, Partial<PlaceholderConfig>> = {
  sedan: {
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    text: 'Sedan',
  },
  suv: {
    backgroundColor: '#059669',
    textColor: '#FFFFFF',
    text: 'SUV',
  },
  hatchback: {
    backgroundColor: '#DC2626',
    textColor: '#FFFFFF',
    text: 'Hatchback',
  },
  convertible: {
    backgroundColor: '#7C3AED',
    textColor: '#FFFFFF',
    text: 'Convertible',
  },
  truck: {
    backgroundColor: '#92400E',
    textColor: '#FFFFFF',
    text: 'Truck',
  },
  van: {
    backgroundColor: '#1F2937',
    textColor: '#FFFFFF',
    text: 'Van',
  },
  luxury: {
    backgroundColor: '#111827',
    textColor: '#F59E0B',
    text: 'Luxury',
  },
  electric: {
    backgroundColor: '#10B981',
    textColor: '#FFFFFF',
    text: 'Electric',
  },
  hybrid: {
    backgroundColor: '#06B6D4',
    textColor: '#FFFFFF',
    text: 'Hybrid',
  },
};

/**
 * Generate a placeholder image URL using a service like placeholder.com
 */
export function generatePlaceholderUrl(config: PlaceholderConfig): string {
  const {
    width,
    height,
    backgroundColor = '6B7280',
    textColor = 'FFFFFF',
    text = 'Vehicle',
  } = config;

  // Remove # from color codes if present
  const bgColor = backgroundColor.replace('#', '');
  const txtColor = textColor.replace('#', '');

  // Using placeholder.com service
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${txtColor}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a vehicle-specific placeholder
 */
export function generateVehiclePlaceholder(
  vehicleType: VehicleType,
  width: number = 400,
  height: number = 300
): string {
  const defaultConfig = defaultPlaceholderConfigs[vehicleType];
  
  return generatePlaceholderUrl({
    width,
    height,
    ...defaultConfig,
    vehicleType,
  });
}

/**
 * Create a loading skeleton placeholder as SVG data URL
 */
export function createLoadingSkeleton(
  width: number = 400,
  height: number = 300,
  backgroundColor: string = '#F3F4F6'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="50%" style="stop-color:#E5E7EB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="-100 0;100 0;-100 0"
            dur="2s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shimmer)" rx="8" />
      <rect x="20" y="20" width="60" height="20" fill="#D1D5DB" rx="4" opacity="0.7" />
      <rect x="20" y="50" width="40" height="16" fill="#D1D5DB" rx="4" opacity="0.5" />
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Create a simple colored placeholder as SVG data URL
 */
export function createColorPlaceholder(
  width: number = 400,
  height: number = 300,
  backgroundColor: string = '#6B7280',
  text: string = 'Loading...',
  textColor: string = '#FFFFFF'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" rx="8" />
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="16" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Get fallback image for failed loads
 */
export function getFallbackImage(vehicleType?: VehicleType): string {
  if (vehicleType) {
    return generateVehiclePlaceholder(vehicleType);
  }
  
  return createColorPlaceholder(400, 300, '#9CA3AF', 'Image not available', '#FFFFFF');
}

/**
 * Vehicle type detection from vehicle name/model
 */
export function detectVehicleType(vehicleName: string): VehicleType {
  const name = vehicleName.toLowerCase();
  
  if (name.includes('tesla') || name.includes('electric') || name.includes('ev')) {
    return 'electric';
  }
  if (name.includes('hybrid') || name.includes('prius')) {
    return 'hybrid';
  }
  if (name.includes('suv') || name.includes('explorer') || name.includes('tahoe') || name.includes('suburban')) {
    return 'suv';
  }
  if (name.includes('truck') || name.includes('f-150') || name.includes('silverado') || name.includes('ram')) {
    return 'truck';
  }
  if (name.includes('van') || name.includes('transit') || name.includes('sprinter')) {
    return 'van';
  }
  if (name.includes('convertible') || name.includes('cabrio') || name.includes('roadster')) {
    return 'convertible';
  }
  if (name.includes('luxury') || name.includes('mercedes') || name.includes('bmw') || name.includes('audi') || name.includes('lexus')) {
    return 'luxury';
  }
  if (name.includes('hatchback') || name.includes('golf') || name.includes('civic hatch')) {
    return 'hatchback';
  }
  
  // Default to sedan
  return 'sedan';
}

/**
 * Preload placeholder images for better performance
 */
export function preloadPlaceholders(vehicleTypes: VehicleType[]): Promise<void[]> {
  const promises = vehicleTypes.map(type => {
    const img = new Image();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve even on error to not block
      img.src = generateVehiclePlaceholder(type);
    });
  });
  
  return Promise.all(promises);
}

/**
 * Utility class for managing vehicle image states
 */
export class VehicleImageManager {
  private loadingStates = new Map<string, boolean>();
  private errorStates = new Map<string, boolean>();

  setLoading(imageId: string, isLoading: boolean): void {
    this.loadingStates.set(imageId, isLoading);
  }

  setError(imageId: string, hasError: boolean): void {
    this.errorStates.set(imageId, hasError);
  }

  isLoading(imageId: string): boolean {
    return this.loadingStates.get(imageId) || false;
  }

  hasError(imageId: string): boolean {
    return this.errorStates.get(imageId) || false;
  }

  getImageSrc(
    imageId: string,
    originalSrc: string,
    vehicleType?: VehicleType,
    width: number = 400,
    height: number = 300
  ): string {
    if (this.isLoading(imageId)) {
      return createLoadingSkeleton(width, height);
    }
    
    if (this.hasError(imageId)) {
      return getFallbackImage(vehicleType);
    }
    
    return originalSrc;
  }

  reset(imageId: string): void {
    this.loadingStates.delete(imageId);
    this.errorStates.delete(imageId);
  }

  resetAll(): void {
    this.loadingStates.clear();
    this.errorStates.clear();
  }
}

// Export a singleton instance
export const vehicleImageManager = new VehicleImageManager();

// Common placeholder dimensions
export const PLACEHOLDER_SIZES = {
  thumbnail: { width: 150, height: 100 },
  card: { width: 300, height: 200 },
  detail: { width: 600, height: 400 },
  hero: { width: 1200, height: 600 },
} as const;

export default {
  generatePlaceholderUrl,
  generateVehiclePlaceholder,
  createLoadingSkeleton,
  createColorPlaceholder,
  getFallbackImage,
  detectVehicleType,
  preloadPlaceholders,
  VehicleImageManager,
  vehicleImageManager,
  PLACEHOLDER_SIZES,
};
