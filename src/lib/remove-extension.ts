export function removeExtension(name: string): string {
  return name.replace(/\.(png|jpeg|jpg|webp|avif)$/i, '');
}
