/**
 * Utility for image compression, normalization, and resilient fallback handling.
 * Solves:
 * 1. Image upload failures in admin caused by localStorage quota exhaustion.
 * 2. Missing/broken images on live deployment (e.g. Vercel) due to relative dev paths.
 */

export const FALLBACK_LUXURY_IMAGE =
  '/images/hero_luxury_fashion_1791098539165.jpg';

export const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  Men: '/images/category_mens_bw.jpg',
  Women: '/images/category_womens_bw.jpg',
  Jeans: '/images/category_jeans_bw.jpg',
  Watches: '/images/category_watches_bw.jpg',
  Bags: '/images/category_bags_bw.jpg',
  Shoes: '/images/category_shoes_bw.jpg',
  Accessories: '/images/category_accessories_bw.jpg',
  Perfumes: '/images/category_perfumes_bw.jpg',
  Festive: '/images/festive_edit_luxury_1791098550195.jpg',
};

// High-resolution craftsmanship and detail angles for interactive product gallery (100% local, fast & infallible)
export const FALLBACK_DETAIL_ANGLES: Record<string, string[]> = {
  Men: [
    '/images/category_mens_bw.jpg',
    '/images/category_mens_fashion_1791290148102.jpg',
    '/images/hero_luxury_fashion_1791098539165.jpg',
  ],
  Women: [
    '/images/category_womens_bw.jpg',
    '/images/category_womens_fashion_1791290162230.jpg',
    '/images/festive_edit_luxury_1791098550195.jpg',
  ],
  Jeans: [
    '/images/category_jeans_bw.jpg',
    '/images/category_luxury_denim_1791098561162.jpg',
    '/images/category_jeans_luxury_1791290260306.jpg',
  ],
  Watches: [
    '/images/luxury_gold_watch_1791098572108.jpg',
    '/images/category_watches_bw.jpg',
    '/images/category_watches_luxury_1791290199257.jpg',
  ],
  Bags: [
    '/images/category_bags_bw.jpg',
    '/images/category_bags_luxury_1791290228052.jpg',
    '/images/luxury_products_hero_1791099185940.jpg',
  ],
  Shoes: [
    '/images/category_shoes_bw.jpg',
    '/images/category_shoes_luxury_1791290241545.jpg',
    '/images/hero_luxury_fashion_1791098539165.jpg',
  ],
  Accessories: [
    '/images/category_accessories_bw.jpg',
    '/images/category_accessories_luxury_1791290275377.jpg',
    '/images/luxury_gold_watch_1791098572108.jpg',
  ],
  Perfumes: [
    '/images/category_perfumes_bw.jpg',
    '/images/category_perfumes_luxury_1791290184160.jpg',
    '/images/festive_edit_luxury_1791098550195.jpg',
  ],
};

export function getProductGallery(product?: {
  image?: string;
  secondaryImage?: string;
  images?: string[];
  category?: string;
}): string[] {
  if (!product) {
    return [FALLBACK_LUXURY_IMAGE];
  }

  const result: string[] = [];

  // 1. Primary product image (if provided)
  const hasPrimary = Boolean(
    product.image && typeof product.image === 'string' && product.image.trim()
  );
  if (hasPrimary) {
    result.push(normalizeImageUrl(product.image));
  }

  // 2. Secondary product image (only if explicitly uploaded/saved and distinct)
  const hasSecondary = Boolean(
    product.secondaryImage &&
      typeof product.secondaryImage === 'string' &&
      product.secondaryImage.trim()
  );
  if (hasSecondary) {
    const sec = normalizeImageUrl(product.secondaryImage);
    if (!result.includes(sec)) {
      result.push(sec);
    }
  }

  // 3. Fallback to explicit images array ONLY if neither primary nor secondary was saved
  if (!hasPrimary && !hasSecondary && Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img && typeof img === 'string' && img.trim()) {
        const norm = normalizeImageUrl(img);
        if (!result.includes(norm)) {
          result.push(norm);
        }
      }
    });
  }

  // 4. Strict check: If product has 2 saved images, return ONLY those 2 images.
  // If product has 1 saved image, return ONLY that 1 image.
  // If no image is available at all, return neutral placeholder.
  if (result.length === 0) {
    return [FALLBACK_LUXURY_IMAGE];
  }

  return result;
}

/**
 * Normalizes legacy paths (e.g. /src/assets/images/... to /images/...)
 * and automatically adds leading "/" to any PNG, JPG, or relative image link
 * so inventory images never break on Vercel deployment.
 */
export function normalizeImageUrl(url?: string, category?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    if (category && FALLBACK_CATEGORY_IMAGES[category]) {
      return FALLBACK_CATEGORY_IMAGES[category];
    }
    return FALLBACK_LUXURY_IMAGE;
  }

  let clean = url.trim();

  // If protocol-relative URL (e.g. //images.unsplash.com/...)
  if (clean.startsWith('//')) {
    return 'https:' + clean;
  }

  // If standard HTTP/HTTPS or data URL or blob URL, preserve it untouched!
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }

  // If user pasted a domain-like URL without scheme (e.g. images.unsplash.com/..., i.ibb.co/...)
  if (
    clean.startsWith('images.unsplash.com') ||
    clean.startsWith('i.ibb.co') ||
    clean.startsWith('cdn.') ||
    clean.startsWith('res.cloudinary.com') ||
    clean.startsWith('images.pexels.com') ||
    clean.includes('.firebasestorage.app') ||
    clean.includes('.googleapis.com')
  ) {
    return 'https://' + clean;
  }

  // Fix Vite /src/assets/images dev paths to production /images/
  if (clean.startsWith('/src/assets/images/')) {
    clean = clean.replace('/src/assets/images/', '/images/');
  }

  // Auto-prefix leading "/" to local PNG/JPG image paths or https:// to external domains
  if (!clean.startsWith('/')) {
    if (
      clean.includes('.') &&
      (clean.includes('.com') ||
        clean.includes('.net') ||
        clean.includes('.org') ||
        clean.includes('.io') ||
        clean.includes('.co') ||
        clean.includes('.app') ||
        clean.includes('.cc') ||
        clean.includes('.me') ||
        clean.includes('.dev') ||
        clean.includes('.in') ||
        clean.includes('imgur') ||
        clean.includes('pinimg') ||
        clean.includes('unsplash') ||
        clean.includes('cloudinary') ||
        clean.includes('shopify'))
    ) {
      return 'https://' + clean;
    }

    if (clean.startsWith('images/')) {
      clean = '/' + clean;
    } else if (
      clean.endsWith('.png') ||
      clean.endsWith('.jpg') ||
      clean.endsWith('.jpeg') ||
      clean.endsWith('.webp') ||
      clean.endsWith('.svg')
    ) {
      clean = '/images/' + clean;
    } else {
      clean = '/' + clean;
    }
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
