import { Result } from '@/stores/results';
import { Source } from '@/stores/sources';

export function sort(array, fn = (a, b) => a - b) {
  array.sort(fn);
  return array;
}

export function sortResults(a: Result, b: Result) {
  return a.width === b.width
    ? a.filename.localeCompare(b.filename)
    : a.width - b.width;
}

export function sortSources(a: Source, b: Source) {
  return a.file.name.localeCompare(b.file.name);
}
