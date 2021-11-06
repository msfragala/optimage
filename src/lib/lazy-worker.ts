import { Remote, wrap } from 'comlink';

export function createLazyWorker<T>(
  importer: () => Promise<typeof import('*?worker')>
): () => Promise<Remote<T>> {
  let promise: Promise<Remote<T>>;
  let cache: Remote<T>;

  return async () => {
    if (cache) return cache;
    if (promise) return promise;
    promise = importer().then(worker => {
      const proxy = wrap(new worker.default()) as Remote<T>;
      cache = proxy;
      return cache;
    });

    return promise;
  };
}
