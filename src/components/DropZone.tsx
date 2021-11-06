import { useEffect, useRef, useState } from 'preact/hooks';
import cx from 'clsx';
import { ComponentChildren } from 'preact';

interface DropZoneProps {
  children: ComponentChildren;
  dragClass?: string;
  onDrop?: (event: DragEvent, files: File[]) => void;
  global?: boolean;
  allowTypes?: string[];
  class?: string;
}

export function DropZone(props: DropZoneProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const { dragClass, onDrop, global, allowTypes } = props;

  useEffect(() => {
    const node = global ? globalThis.document.body : nodeRef.current;

    function ondragstart(event: DragEvent) {
      event.preventDefault();
      setDragging(true);
    }

    function ondragend(event: DragEvent) {
      event.preventDefault();
      setDragging(false);
    }

    function ondrop(event: DragEvent) {
      event.preventDefault();
      setDragging(false);
      if (!event.dataTransfer) return;
      let files = Array.from(event.dataTransfer.files);

      if (allowTypes) {
        files = files.filter(file => allowTypes?.includes(file.type));
      }

      onDrop?.(event, files);
    }

    node?.addEventListener('dragenter', ondragstart);
    node?.addEventListener('dragover', ondragstart);
    node?.addEventListener('dragleave', ondragend);
    node?.addEventListener('dragend', ondragend);
    node?.addEventListener('drop', ondrop);

    return () => {
      node?.removeEventListener('dragenter', ondragstart);
      node?.removeEventListener('dragover', ondragstart);
      node?.removeEventListener('dragleave', ondragend);
      node?.removeEventListener('dragend', ondragend);
      node?.removeEventListener('drop', ondrop);
    };
  }, [global, allowTypes, onDrop]);

  return (
    <div class={cx(props.class, dragging && dragClass)} ref={nodeRef}>
      {props.children}
    </div>
  );
}
