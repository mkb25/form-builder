import React from 'react';
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
  const { selectedFieldId, setSelectedFieldId, removeField } = useBuilder();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isSelected = selectedFieldId === field.id;

  return (
    <div
      ref={setNodeRef}
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
        ...style,
        marginBottom: '1rem',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        border: isSelected ? '2px solid var(--ring)' : '1px solid var(--border)',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="drag-handle"
        style={{ cursor: 'grab', color: 'var(--text-muted)' }}
        aria-label={`Drag to reorder ${field.label}`}
      >
        <GripVertical size={20} />
      </div>
      
      <div className="field-preview" style={{ flex: 1 }}>
        <FormElement field={field} disabled={true} />
      </div>

      <button 
        className="btn btn-ghost"
        style={{ color: 'var(--danger)', padding: '0.5rem' }}
        onClick={(e) => {
          e.stopPropagation();
          removeField(field.id);
        }}
        aria-label={`Delete ${field.label}`}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
