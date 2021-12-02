interface TagsInputProps {
  onAddTag: (tag: string) => void;
  validateTag: (tag: string) => boolean;
  [key: string]: any;
}

export function TagsInput(props: TagsInputProps) {
  const { onAddTag, validateTag, onError, ...inputProps } = props;

  function onKeyDown(event: KeyboardEvent) {
    if (!['Enter', ' '].includes(event.key)) return;

    const node = event.target as HTMLInputElement;
    const tag = node.value.trim();

    if (node.value) event.preventDefault();

    if (validateTag(tag)) {
      if (tag) onAddTag(tag);
      node.value = '';
    }
  }

  function onBlur(event: Event) {
    const node = event.target as HTMLInputElement;
    const tag = node.value.trim();

    if (validateTag(tag)) {
      if (tag) onAddTag(tag);
      node.value = '';
    }
  }

  return (
    <input
      {...inputProps}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      type={inputProps.type ?? 'text'}
    />
  );
}
