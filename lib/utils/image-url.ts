/**
 * Builds a Cloudinary image URL with optional transformations.
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  const { width, height, quality = 80, format = 'auto' } = options;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) return publicId; // Fallback to raw URL

  const transformations: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(',')}/${publicId}`;
}

/**
 * Returns an avatar URL from a path or a fallback initials-based DiceBear avatar.
 */
export function getAvatarUrl(avatarUrl: string | null | undefined, name: string): string {
  if (avatarUrl) return avatarUrl;
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=1e293b&textColor=f8fafc`;
}
