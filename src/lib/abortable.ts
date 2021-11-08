export async function abortable<T>(
  signal: AbortSignal,
  promise: Promise<T>
): Promise<T> {
  if (signal.aborted) {
    throw new DOMException('AbortError', 'AbortError');
  }

  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      signal.addEventListener('abort', () =>
        reject(new DOMException('AbortError', 'AbortError'))
      );
    }),
  ]);
}
