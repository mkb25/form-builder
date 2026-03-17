import { useState } from 'react';
import './App.css';
import { useBuilder } from './context/BuilderContext';
import { Layout, Eye, Code, PenTool } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { BuilderCanvas } from './components/BuilderCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { FormPreview } from './components/FormPreview';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { FieldType } from './types';

function AppContent() {
  const { 
    isPreviewMode, setIsPreviewMode, schema, 
    addField, reorderFields, announce 
  } = useBuilder();
  const [showExport, setShowExport] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeFieldType, setActiveFieldType] = useState<FieldType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    if (active.data.current?.isPaletteItem) {
      setActiveFieldType(active.data.current.fieldType);
      announce(`Started dragging new ${active.data.current.fieldType} field`);
    } else {
      const field = schema.fields.find(f => f.id === active.id);
      if (field) {
        announce(`Started dragging ${field.label}`);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveFieldType(null);
      announce('Drag canceled');
      return;
    }

    if (active.data.current?.isPaletteItem) {
      // Create new field
      if (over.id === 'builder-canvas' || schema.fields.find(f => f.id === over.id)) {
        addField({
          type: active.data.current.fieldType,
          label: `New ${active.data.current.fieldType}`,
          required: false,
          options: active.data.current.fieldType === 'select' || active.data.current.fieldType === 'radio' || active.data.current.fieldType === 'checkbox'
            ? [{ label: 'Option 1', value: 'opt1' }]
            : undefined
        });
      }
    } else {
      // Reorder existing field
      if (active.id !== over.id) {
        const oldIndex = schema.fields.findIndex(f => f.id === active.id);
        const newIndex = schema.fields.findIndex(f => f.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderFields(oldIndex, newIndex);
        }
      }
    }
    
    setActiveId(null);
    setActiveFieldType(null);
  };

  return (
    <div className={`app-container ${isPreviewMode ? 'preview-mode' : ''}`}>
      <header className="header">
        <h1><Layout className="icon" /> WCAG Form Builder</h1>
        <div className="header-actions">
          <button 
            className="btn btn-outline"
            onClick={() => setShowExport(true)}
            aria-label="Export Form JSON"
          >
            <Code size={18} /> Export
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            aria-pressed={isPreviewMode}
          >
            {isPreviewMode ? (
              <><PenTool size={18} /> Back to Builder</>
            ) : (
              <><Eye size={18} /> Preview Form</>
            )}
          </button>
        </div>
      </header>

      <main className="main-content">
        {!isPreviewMode && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Sidebar />

            <BuilderCanvas />

            <PropertiesPanel />

            <DragOverlay dropAnimation={{
              duration: 250,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
              {activeId ? (
                activeFieldType ? (
                  <div className="btn btn-outline" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    {activeFieldType} item
                  </div>
                ) : (
                  <div className="glass-panel" style={{ padding: '1rem', border: '1px solid var(--ring)' }}>
                    Moving {schema.fields.find(f => f.id === activeId)?.label}
                  </div>
                )
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {isPreviewMode && (
          <section className="canvas-area">
             <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <h2>{schema.title}</h2>
              <p className="text-muted">{schema.description}</p>
              {schema.fields.length === 0 ? (
                <p>No fields added yet.</p>
              ) : (
                <FormPreview />
              )}
            </div>
          </section>
        )}
      </main>

      {showExport && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="glass-panel" style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '2rem', borderRadius: 'var(--radius-lg)' }} role="dialog" aria-modal="true" aria-labelledby="export-title">
            <h2 id="export-title" style={{ marginBottom: '1rem' }}>Export Form Schema</h2>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <pre style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', overflowX: 'auto', fontSize: '0.875rem' }}>
                {JSON.stringify(schema, null, 2)}
              </pre>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-primary" onClick={() => setShowExport(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppContent;
