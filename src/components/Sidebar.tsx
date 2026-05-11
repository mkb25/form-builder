import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { FieldType } from '../types';
import {
  Type, Hash, List, CheckSquare, CircleDot,
  User, Users, Mail, Phone, Lock,
  AlignLeft, Link, Calendar, Clock,
  Upload, Star, ToggleLeft
} from 'lucide-react';

const FIELD_TYPES: { type: FieldType; label: string; icon: React.ReactNode; group: string }[] = [
  // Personal Information
  { type: 'firstName', label: 'First Name',  icon: <User size={18} />,       group: 'Personal Info' },
  { type: 'lastName',  label: 'Last Name',   icon: <User size={18} />,       group: 'Personal Info' },
  { type: 'fullName',  label: 'Full Name',   icon: <Users size={18} />,      group: 'Personal Info' },
  { type: 'email',     label: 'Email',       icon: <Mail size={18} />,       group: 'Personal Info' },
  { type: 'tel',       label: 'Phone',       icon: <Phone size={18} />,      group: 'Personal Info' },
  { type: 'password',  label: 'Password',    icon: <Lock size={18} />,       group: 'Personal Info' },
  // Basic Inputs
  { type: 'text',      label: 'Short Text',  icon: <Type size={18} />,       group: 'Basic Inputs' },
  { type: 'textarea',  label: 'Long Text',   icon: <AlignLeft size={18} />,  group: 'Basic Inputs' },
  { type: 'number',    label: 'Number',      icon: <Hash size={18} />,       group: 'Basic Inputs' },
  { type: 'url',       label: 'URL',         icon: <Link size={18} />,       group: 'Basic Inputs' },
  { type: 'date',      label: 'Date',        icon: <Calendar size={18} />,   group: 'Basic Inputs' },
  { type: 'time',      label: 'Time',        icon: <Clock size={18} />,      group: 'Basic Inputs' },
  // Choice Fields
  { type: 'select',    label: 'Dropdown',    icon: <List size={18} />,       group: 'Choice Fields' },
  { type: 'checkbox',  label: 'Checkboxes',  icon: <CheckSquare size={18} />,group: 'Choice Fields' },
  { type: 'radio',     label: 'Radio Buttons',icon: <CircleDot size={18} />, group: 'Choice Fields' },
  // Advanced
  { type: 'file',      label: 'File Upload', icon: <Upload size={18} />,     group: 'Advanced' },
  { type: 'rating',    label: 'Rating',      icon: <Star size={18} />,       group: 'Advanced' },
  { type: 'toggle',    label: 'Toggle',      icon: <ToggleLeft size={18} />, group: 'Advanced' },
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
  // Derive unique ordered group names
  const groups = Array.from(new Set(FIELD_TYPES.map(f => f.group)));

  return (
    <aside className="sidebar" aria-label="Form Elements Palette">
      <h2>Elements</h2>
      <p className="text-muted" style={{ fontSize: '0.875rem' }}>Drag elements to the canvas</p>

      {groups.map(group => (
        <div key={group} className="palette-group">
          <p className="palette-group-label">{group}</p>
          <div className="palette-grid">
            {FIELD_TYPES.filter(f => f.group === group).map(field => (
              <DraggableButton
                key={field.type}
                type={field.type}
                label={field.label}
                icon={field.icon}
              />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};
