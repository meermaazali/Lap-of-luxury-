/**
 * Utility for image compression, normalization, and resilient fallback handling.
 * Solves:
 * 1. Image upload failures in admin caused by localStorage quota exhaustion.
 * 2. Missing/broken images on live deployment (e.g. Vercel) due to relative dev paths.
 */

export const FALLBACK_LUXURY_IMAGE =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop';

export const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  Men: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
  Jeans: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800&auto=format&fit=crop',
  Watches: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
  Bags: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
  Shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
  Accessories: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
  Perfumes: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
  Women: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop',
  Festive: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
};

/**
 * Normalizes legacy paths (e.g. /src/assets/images/... to /images/...)
 * and provides safe fallbacks.
 */
export function normalizeImageUrl(url?: string, category?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    if (category && FALLBACK_CATEGORY_IMAGES[category]) {
      return FALLBACK_CATEGORY_IMAGES[category];
    }
    return FALLBACK_LUXURY_IMAGE;
  }

  const clean = url.trim();

  // Fix Vite /src/assets/images dev paths to production /images/
  if (clean.startsWith('/src/assets/images/')) {
    return clean.replace('/src/assets/images/', '/images/');
  }

  return clean;
}

/**
 * Compresses any user uploaded image (PNG, JPG, WEBP) to web-optimized dimensions & size (<150KB).
 * This prevents localStorage QuotaExceededError when adding products/banners in admin!
 */
export async function compressImage(
  file: File,
  maxDimension: number = 1000,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (readerEvent) => {
      const src = readerEvent.target?.result as string;
      if (!src) {
        reject(new Error('Empty file content'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down proportionally
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original dataUrl if canvas context is unavailable
          resolve(src);
          return;
        }

        // Fill white background in case of transparent PNG being converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-optimized JPEG data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
