export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = (error) => reject(error);
    reader.onloadend = () => {
      if (reader.result) resolve(reader.result.toString());
      else reject(new Error('File reader has no result'));
    };
  });
}
