export function getImageDimensions(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onerror = error => {
      URL.revokeObjectURL(url);
      reject(error);
    };

    img.onload = () => {
      const h = img.naturalHeight;
      const w = img.naturalWidth;
      if (!h && !w) resolve('');
      else resolve(`${w}×${h}`);
      console.log('revoking');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}
