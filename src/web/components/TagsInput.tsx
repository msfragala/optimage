import { splitProps } from 'solid-js';

interface TagsInputProps {
  onAddTag: (tag: string) => void;
  validateTag: (tag: string) => boolean;
  [key: string]: any;
}

export function TagsInput(props: TagsInputProps) {
  const [localProps, inputProps] = splitProps(props, [
    'onAddTag',
    'validateTag',
    'onError',
  ]);

  function onKeyDown(event: KeyboardEvent) {
    if (!['Enter', ' '].includes(event.key)) return;
    event.preventDefault();

    const node = event.target as HTMLInputElement;
    const tag = node.value.trim();

    if (localProps.validateTag(tag)) {
      if (tag) localProps.onAddTag(tag);
      node.value = '';
    }
  }

  function onChange(event: Event) {
    const node = event.target as HTMLInputElement;
    const tag = node.value.trim();

    if (localProps.validateTag(tag)) {
      if (tag) localProps.onAddTag(tag);
      node.value = '';
    }
  }

  return (
    <input
      {...inputProps}
      onChange={onChange}
      onKeyDown={onKeyDown}
      type={inputProps.type ?? 'text'}
    />
  );
}
