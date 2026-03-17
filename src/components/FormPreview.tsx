import React from 'react';
import { useBuilder } from '../context/BuilderContext';
import { FormElement } from './fields/FormElement';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateZodSchema } from '../utils/schemaGenerator';

export const FormPreview: React.FC = () => {
  const { schema } = useBuilder();
  
  // Basic react-hook-form wrapper to demonstrate accessibility of the Form Elements
  const validationSchema = generateZodSchema(schema);

  const { handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit' // Validate when submit is pressed to replicate real-world forms
  });
  
  const onSubmit = (data: any) => {
    alert('Form evaluated successfully. Check console for output.');
    console.log('Form Submit Data', data);
  };

  if (schema.fields.length === 0) {
    return <p className="text-muted">Add some fields to the builder first.</p>;
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}
      aria-label={`${schema.title} Form Preview`}
    >
      {schema.fields.map(field => {
        return (
          <FormElement 
            key={field.id}
            field={field} 
            value={watch(field.id)}
            onChange={(val) => setValue(field.id, val, { shouldValidate: true })}
            error={errors[field.id] ? (errors[field.id]?.message as string) : undefined}
          />
        );
      })}
      
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary">
          Submit Preview
        </button>
      </div>
    </form>
  );
};
