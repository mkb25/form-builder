import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { FieldType } from '../types';
import { Type, Hash, List, CheckSquare, CircleDot } from 'lucide-react';

const FIELD_TYPES: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Short Text', icon: <Type size={18} /> },
  { type: 'number', label: 'Number', icon: <Hash size={18} /> },
  { type: 'select', label: 'Dropdown', icon: <List size={18} /> },
  { type: 'checkbox', label: 'Checkboxes', icon: <CheckSquare size={18} /> },
  { type: 'radio', label: 'Radio Buttons', icon: <CircleDot size={18} /> },
];

interface DraggableButtonProps {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

const DraggableButton: React.FC<DraggableButtonProps> = ({ type, label, icon }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `paletteItem-${type}`,
    data: {
      isPaletteItem: true,
      fieldType: type,
    },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`btn btn-outline ${isDragging ? 'is-dragging' : ''}`}
      style={{
        width: '100%',
        justifyContent: 'flex-start',
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '0.5rem',
        cursor: 'grab'
      }}
      aria-label={`Add ${label} field`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar" aria-label="Form Elements Palette">
      <h2>Elements</h2>
      <p className="text-muted" style={{ fontSize: '0.875rem' }}>Drag elements to the canvas</p>
      <div className="palette-grid">
        {FIELD_TYPES.map(field => (
          <DraggableButton 
            key={field.type} 
            type={field.type} 
            label={field.label} 
            icon={field.icon} 
          />
        ))}
      </div>
    </aside>
  );
};
