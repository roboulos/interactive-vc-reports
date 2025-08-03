import React from 'react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'date';
  value?: any;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface FormTemplateProps {
  title: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  onSubmit?: (data: Record<string, any>) => void;
}

export const FormTemplate: React.FC<FormTemplateProps> = ({ 
  title, 
  description, 
  fields, 
  submitLabel = 'Submit' 
}) => {
  return (
    <div className="form-template">
      <div className="template-header">
        <h3 className="template-title">{title}</h3>
        {description && <p className="template-description">{description}</p>}
      </div>
      
      <form className="template-form">
        {fields.map((field) => (
          <div key={field.name} className="form-field">
            <label className="field-label">{field.label}</label>
            
            {field.type === 'select' && (
              <select className="field-input field-select" defaultValue={field.value}>
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {field.type === 'multiselect' && (
              <div className="field-multiselect">
                {field.options?.map((option) => (
                  <label key={option.value} className="multiselect-option">
                    <input 
                      type="checkbox" 
                      value={option.value}
                      defaultChecked={field.value?.includes(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            )}
            
            {['text', 'number', 'date'].includes(field.type) && (
              <input
                type={field.type}
                className="field-input"
                defaultValue={field.value}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
        
        <div className="form-actions">
          <button type="button" className="form-submit-button">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormTemplate;