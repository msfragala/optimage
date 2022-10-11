import { Type } from '@/constants/types';
import { results$ } from '@/stores/results';
import { Source } from '@/stores/sources';
import { widths$ } from '@/stores/widths';
import { get } from 'svelte/store';
import { dashify } from './dashify';
import { squoll } from './squoll';

export async function processSource(source: Source) {
  const sizes = get(widths$);
  const decoded = await squoll.decode(source.file);

  if (!decoded) return;

  const name = dashify(
    source.file.name.replace(/\.{avif|jpeg|jpg|png|webp}$/, '')
  );

  const types: Type[] = /jpe?g$/.test(source.file.type)
    ? ['image/avif', 'image/webp', 'image/jpeg']
    : ['image/avif', 'image/webp', 'image/png'];

  const combinations: { type: Type; width: number }[] = [];

  types.forEach(type => {
    sizes.forEach(width => {
      combinations.push({ type, width });
    });
  });

  const items = results$.add(
    combinations.map(({ type, width }) => ({
      source: source.id,
      filename: `${name}.${width}.${type.slice(6)}`,
      type,
      width,
    }))
  );

  items.forEach(({ width, type, id }) => {
    squoll
      .resize({ source: decoded, width })
      .then(data => squoll.encode({ source: data, type }))
      .then(blob => {
        results$.updateResult(id, {
          blob,
          status: 'success',
        });
      })
      .catch(error => {
        console.error(error);
        results$.updateResult(id, {
          status: 'error',
        });
      });
  });
}
