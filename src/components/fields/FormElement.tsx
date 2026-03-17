import React, { useId } from 'react';
import type { FormField } from '../../types';

interface FormElementProps {
  field: FormField;
  error?: string;
  value?: any;
  onChange?: (val: any) => void;
  disabled?: boolean;
}

export const FormElement: React.FC<FormElementProps> = ({ 
  field, 
  error, 
  value, 
  onChange,
  disabled = false 
}) => {
  const inputId = useId();
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;

  const ariaDescribedBy = [
    field.helpText ? helpId : null,
    error ? errorId : null,
  ].filter(Boolean).join(' ') || undefined;

  const commonProps = {
    id: inputId,
    disabled,
    'aria-invalid': !!error,
    'aria-describedby': ariaDescribedBy,
    'aria-required': field.required,
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            {...commonProps}
            type="text"
            className="input-base"
            placeholder={field.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            className="input-base"
            placeholder={field.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );
      case 'select':
        return (
          <select
            {...commonProps}
            className="input-base"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
          >
            <option value="">Select an option...</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="radio-group" role="radiogroup" aria-labelledby={`${inputId}-label`} aria-invalid={!!error}>
            {field.options?.map((opt, i) => {
              const optId = `${inputId}-opt-${i}`;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <input
                    type="radio"
                    id={optId}
                    name={inputId}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={() => onChange?.(opt.value)}
                    disabled={disabled}
                  />
                  <label htmlFor={optId} style={{ fontSize: '0.875rem' }}>{opt.label}</label>
                </div>
              );
            })}
          </div>
        );
      case 'checkbox':
        return (
          <div className="checkbox-group" role="group" aria-labelledby={`${inputId}-label`} aria-invalid={!!error}>
            {field.options?.map((opt, i) => {
              const optId = `${inputId}-opt-${i}`;
              const valArray = Array.isArray(value) ? value : [];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <input
                    type="checkbox"
                    id={optId}
                    value={opt.value}
                    checked={valArray.includes(opt.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange?.([...valArray, opt.value]);
                      } else {
                        onChange?.(valArray.filter((v: string) => v !== opt.value));
                      }
                    }}
                    disabled={disabled}
                  />
                  <label htmlFor={optId} style={{ fontSize: '0.875rem' }}>{opt.label}</label>
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-element-wrapper" style={{ marginBottom: '1.5rem' }}>
      <label id={`${inputId}-label`} htmlFor={field.type === 'radio' || field.type === 'checkbox' ? undefined : inputId} className="label-base">
        {field.label} {field.required && <span style={{ color: 'var(--danger)' }} aria-hidden="true">*</span>}
        {field.required && <span className="sr-only">Required</span>}
      </label>

      {field.helpText && (
        <p id={helpId} className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          {field.helpText}
        </p>
      )}

      {renderInput()}

      {error && (
        <div id={errorId} className="error-msg" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};
