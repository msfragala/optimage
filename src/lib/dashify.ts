export function dashify(input: string) {
  return input
    .normalize()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^\p{L}\d]+/gu, '-')
    .replace(/\-+$/, '')
    .toLocaleLowerCase();
}
