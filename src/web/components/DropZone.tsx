import { createSignal, onCleanup, onMount, PropsWithChildren } from 'solid-js';

interface DropZoneProps {
  dragClass?: string;
  onDrop?: (event: DragEvent, files: File[]) => void;
  global?: boolean;
  allowTypes?: string[];
  class?: string;
}

export function DropZone(props: PropsWithChildren<DropZoneProps>) {
  let div: HTMLDivElement;
  const [dragging, setDragging] = createSignal(false);

  function onDragStart(event: DragEvent) {
    event.preventDefault();
    setDragging(true);
  }

  function onDragEnd(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    if (!event.dataTransfer) return;
    let files = Array.from(event.dataTransfer.files);

    if (props.allowTypes) {
      files = files.filter(file => props.allowTypes?.includes(file.type));
    }

    props.onDrop?.(event, files);
  }

  onMount(() => {
    const node = props.global ? globalThis.document.body : div;
    node?.addEventListener('dragenter', onDragStart);
    node?.addEventListener('dragover', onDragStart);
    node?.addEventListener('dragleave', onDragEnd);
    node?.addEventListener('dragend', onDragEnd);
    node?.addEventListener('drop', onDrop);
  });

  onCleanup(() => {
    const node = props.global ? globalThis.document.body : div;
    node?.removeEventListener('dragenter', onDragStart);
    node?.removeEventListener('dragover', onDragStart);
    node?.removeEventListener('dragleave', onDragEnd);
    node?.removeEventListener('dragend', onDragEnd);
    node?.removeEventListener('drop', onDrop);
  });

  return (
    <div
      classList={{
        [props.class ?? '']: !!props.class,
        [props.dragClass ?? '']: !!props.dragClass && dragging(),
      }}
      ref={node => (div = node)}
    >
      {props.children}
    </div>
  );
}
