import React, { createContext, useContext, useEffect, useState } from 'react';
import type { FormSchema, FormField } from '../types';
import { nanoid } from 'nanoid';

interface BuilderContextType {
  schema: FormSchema;
  setSchema: React.Dispatch<React.SetStateAction<FormSchema>>;
  addField: (field: Omit<FormField, 'id'>) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (startIndex: number, endIndex: number) => void;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (val: boolean) => void;
  announcement: string;
  announce: (message: string) => void;
}

const defaultSchema: FormSchema = {
  id: nanoid(),
  title: 'Untitled Form',
  description: 'Please describe the purpose of your form here.',
  fields: []
};

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'wcag-form-builder-schema';

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schema, setSchema] = useState<FormSchema>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse schema from localStorage', e);
      }
    }
    return defaultSchema;
  });
  
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Persist to local storage whenever schema changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(schema));
  }, [schema]);

  const addField = (fieldData: Omit<FormField, 'id'>) => {
    const newField = { ...fieldData, id: nanoid() };
    setSchema(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedFieldId(newField.id);
    announce(`Added new ${fieldData.type} field to the form.`);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setSchema(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const removeField = (id: string) => {
    const field = schema.fields.find(f => f.id === id);
    setSchema(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== id)
    }));
    if (selectedFieldId === id) setSelectedFieldId(null);
    if (field) {
      announce(`Removed ${field.type} field from the form.`);
    }
  };

  const reorderFields = (startIndex: number, endIndex: number) => {
    setSchema(prev => {
      const result = Array.from(prev.fields);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, fields: result };
    });
    announce('Form fields reordered.');
  };

  const announce = (message: string) => {
    setAnnouncement(message);
    // Clear after a moment so the same message can be announced again if needed
    setTimeout(() => setAnnouncement(''), 3000);
  };

  return (
    <BuilderContext.Provider value={{
      schema, setSchema, addField, updateField, removeField, reorderFields,
      selectedFieldId, setSelectedFieldId, isPreviewMode, setIsPreviewMode,
      announcement, announce
    }}>
      {children}
      {/* Live region for accessibility announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};
