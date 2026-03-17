import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBuilder } from '../context/BuilderContext';
import { SortableField } from './SortableField';

export const BuilderCanvas: React.FC = () => {
  const { schema, setSelectedFieldId } = useBuilder();
  
  const { setNodeRef, isOver } = useDroppable({
    id: 'builder-canvas',
  });

  return (
    <section 
      className="canvas-area" 
      aria-label="Form Builder Canvas"
      onClick={() => setSelectedFieldId(null)}
    >
      <div 
        ref={setNodeRef}
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '800px', 
          minHeight: '600px', 
          padding: '2rem', 
          borderRadius: 'var(--radius-lg)',
          border: isOver ? '2px dashed var(--ring)' : '1px solid var(--border)',
          transition: 'border 0.2s ease',
          backgroundColor: isOver ? 'var(--bg-surface-hover)' : 'var(--bg-surface)'
        }}
        data-testid="builder-canvas"
      >
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2>{schema.title}</h2>
          <p className="text-muted">{schema.description}</p>
        </div>

        {schema.fields.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '300px',
            color: 'var(--text-muted)'
          }}>
            <p>Drag and drop elements here to start building your form.</p>
          </div>
        ) : (
          <SortableContext 
            items={schema.fields.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="fields-list">
              {schema.fields.map(field => (
                <SortableField key={field.id} field={field} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </section>
  );
};
