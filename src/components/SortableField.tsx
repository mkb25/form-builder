import React, { useRef, useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FormField } from '../types';
import { useBuilder } from '../context/BuilderContext';
import { FormElement } from './fields/FormElement';
import { GripVertical, Trash2 } from 'lucide-react';

interface SortableFieldProps {
  field: FormField;
}

export const SortableField: React.FC<SortableFieldProps> = ({ field }) => {
  const { selectedFieldId, setSelectedFieldId, removeField, updateField } = useBuilder();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  // Live width during drag (null = use persisted field.width)
  const [liveWidth, setLiveWidth] = useState<number | null>(null);
  const isResizing = useRef(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const isSelected = selectedFieldId === field.id;
  const displayWidth = liveWidth ?? (field.width ?? 100);

  // Merge dnd-kit ref + our own ref
  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      wrapperRef.current = el;
      setNodeRef(el);
    },
    [setNodeRef]
  );

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const parent = wrapper.parentElement;
    if (!parent) return;

    // Capture rects at drag start (they won't change mid-drag)
    const wrapperLeft = wrapper.getBoundingClientRect().left;
    const parentWidth = parent.getBoundingClientRect().width;

    isResizing.current = true;
    // Prevent text selection while resizing
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidthPx = e.clientX - wrapperLeft;
      const newWidthPct = Math.min(100, Math.max(15, (newWidthPx / parentWidth) * 100));
      setLiveWidth(newWidthPct);
    };

    const onMouseUp = (e: MouseEvent) => {
      isResizing.current = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';

      const newWidthPx = e.clientX - wrapperLeft;
      const finalWidth = Math.min(100, Math.max(15, (newWidthPx / parentWidth) * 100));
      updateField(field.id, { width: finalWidth });
      setLiveWidth(null);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    // Outer wrapper: owns the percentage width & dnd-kit transform
    <div
      ref={setRefs}
      className="field-wrapper"
      style={{
        width: `${displayWidth}%`,
        transform: CSS.Transform.toString(transform),
        transition: isResizing.current ? undefined : transition,
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
        boxSizing: 'border-box',
        padding: '0.4rem',
        flexShrink: 0,
      }}
    >
      {/* Inner card */}
      <div
        className={`glass-panel field-container ${isSelected ? 'selected' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedFieldId(field.id);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedFieldId(field.id);
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
        aria-label={`Edit ${field.label} (${field.type} field)`}
        style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          border: isSelected ? '2px solid var(--ring)' : '1px solid var(--border)',
          cursor: 'pointer',
          background: 'var(--bg-surface)',
          boxShadow: 'var(--glass-shadow)',
          minWidth: 0,
          transition: 'border 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="drag-handle"
          style={{ cursor: 'grab', color: 'var(--text-muted)', flexShrink: 0 }}
          aria-label={`Drag to reorder ${field.label}`}
        >
          <GripVertical size={20} />
        </div>

        {/* Field preview */}
        <div className="field-preview" style={{ flex: 1, minWidth: 0 }}>
          <FormElement field={field} disabled={true} />
        </div>

        {/* Width badge + Delete */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0, alignItems: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="width-badge"
            title="Drag right edge to resize"
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              background: 'var(--bg-surface-hover)',
              borderRadius: '4px',
              padding: '0.1rem 0.35rem',
              letterSpacing: '0.03em',
              userSelect: 'none',
            }}
          >
            {Math.round(displayWidth)}%
          </span>
          <button
            className="btn btn-ghost"
            style={{ color: 'var(--danger)', padding: '0.4rem' }}
            onClick={() => removeField(field.id)}
            aria-label={`Delete ${field.label}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ── Resize handle (right edge of wrapper) ── */}
      <div
        className="resize-handle"
        onMouseDown={handleResizeStart}
        title="Drag to resize"
        style={{
          position: 'absolute',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          width: '10px',
          height: '60%',
          minHeight: '36px',
          cursor: 'col-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
        }}
      >
        {/* Visual grip dots */}
        <div
          className="resize-grip"
          style={{
            width: '4px',
            height: '100%',
            borderRadius: '4px',
            background: isSelected ? 'var(--ring)' : 'var(--border)',
            transition: 'background 0.15s, opacity 0.15s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: 'currentColor',
                color: isSelected ? 'var(--ring)' : 'var(--text-muted)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
