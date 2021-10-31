export function getImageDimensions(file: File): Promise<string> {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const h = img.naturalHeight;
      const w = img.naturalWidth;
      if (!h && !w) resolve('');
      else resolve(`${w}×${h}`);
    };
  });
}
