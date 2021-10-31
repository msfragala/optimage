const noop = <T>(n: T): string => String(n);

type Selector<T> = (item: T) => string;
export function sortAlphabetical<T>(
  array: T[],
  selector: Selector<T> = noop
): T[] {
  return Array.from(array).sort((a, b) => {});
}
