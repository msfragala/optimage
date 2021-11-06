export type ImageType =
  | 'image/avif'
  | 'image/webp'
  | 'image/png'
  | 'image/jpeg'
  | 'image/jpg';

export const SupportedTypes: ImageType[] = [
  'image/avif',
  'image/webp',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

export type Extension = '.avif' | '.webp' | '.png' | '.jpeg' | '.jpg';

export const extensionMap: Record<ImageType, Extension> = {
  'image/avif': '.avif',
  'image/webp': '.webp',
  'image/png': '.png',
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpg',
};

export const targetTypesMap: Record<string, ImageType[]> = {
  'image/avif': ['image/avif', 'image/webp', 'image/png'],
  'image/webp': ['image/avif', 'image/webp', 'image/png'],
  'image/png': ['image/avif', 'image/webp', 'image/png'],
  'image/jpeg': ['image/avif', 'image/webp', 'image/jpeg'],
  'image/jpg': ['image/avif', 'image/webp', 'image/jpg'],
};
