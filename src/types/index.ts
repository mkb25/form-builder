export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'radio';

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'email' | 'pattern';
  value?: any;
  message: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string; // nanoid
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: FieldOption[]; // For select, radio, checkbox groups
  validation?: ValidationRule[];
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}
