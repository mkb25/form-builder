import React from 'react';
import { useBuilder } from '../context/BuilderContext';
import { Settings, Plus, Trash2 } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { schema, selectedFieldId, updateField, setSchema } = useBuilder();

  // Handle Form-level properties if no field is selected
  if (!selectedFieldId) {
    return (
      <aside className="properties-panel" aria-label="Form Properties">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Settings size={20} /> Form Details
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="form-title" className="label-base">Form Title</label>
            <input 
              id="form-title"
              type="text" 
              className="input-base"
              value={schema.title}
              onChange={(e) => setSchema(s => ({ ...s, title: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="form-desc" className="label-base">Description</label>
            <textarea 
              id="form-desc"
              className="input-base"
              rows={4}
              value={schema.description}
              onChange={(e) => setSchema(s => ({ ...s, description: e.target.value }))}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </aside>
    );
  }

  const field = schema.fields.find(f => f.id === selectedFieldId);

  if (!field) return null;

  return (
    <aside className="properties-panel" aria-label="Field Properties">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Settings size={20} /> Edit {field.type} Field
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label htmlFor="field-label" className="label-base">Label</label>
          <input 
            id="field-label"
            type="text" 
            className="input-base"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
          />
        </div>

        <div>
           <label htmlFor="field-help" className="label-base">Help Text (Optional)</label>
           <input 
             id="field-help"
             type="text" 
             className="input-base"
             value={field.helpText || ''}
             onChange={(e) => updateField(field.id, { helpText: e.target.value })}
           />
        </div>

        {(field.type === 'text' || field.type === 'number') && (
          <div>
            <label htmlFor="field-placeholder" className="label-base">Placeholder</label>
            <input 
              id="field-placeholder"
              type="text" 
              className="input-base"
              value={field.placeholder || ''}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            id="field-required"
            type="checkbox" 
            checked={field.required}
            onChange={(e) => updateField(field.id, { required: e.target.checked })}
          />
          <label htmlFor="field-required" style={{ fontSize: '0.875rem' }}>Required field</label>
        </div>



        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
          <div>
            <label className="label-base" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              Options
              <button 
                className="btn btn-ghost" 
                style={{ padding: '0.25rem' }}
                onClick={() => {
                  const opts = field.options ? [...field.options] : [];
                  opts.push({ label: `Option ${opts.length + 1}`, value: `opt${opts.length + 1}` });
                  updateField(field.id, { options: opts });
                }}
                aria-label="Add new option"
              >
                <Plus size={16} />
              </button>
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {field.options?.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="input-base" 
                    value={opt.label}
                    onChange={(e) => {
                      const opts = [...field.options!];
                      opts[idx] = { ...opts[idx], label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '-') };
                      updateField(field.id, { options: opts });
                    }}
                    aria-label={`Option ${idx + 1}`}
                  />
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '0.5rem', color: 'var(--danger)' }}
                    onClick={() => {
                      const opts = field.options!.filter((_, i) => i !== idx);
                      updateField(field.id, { options: opts });
                    }}
                    aria-label="Delete option"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {(!field.options || field.options.length === 0) && (
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>No options defined.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
