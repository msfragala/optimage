import Piscina from 'piscina';

export function runParallel<T, S>(pool: Piscina, payloads: T[]): Promise<S[]> {
  function run(payload: T): Promise<S> {
    return pool.run(payload);
  }

  return Promise.all(payloads.map(run)).catch(error => {
    throw error;
  });
}
