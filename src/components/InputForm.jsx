import React, { useState } from 'react';
import styles from '../styles/InputForm.module.css';

const InputForm = ({ onPredict }) => {
  const [formData, setFormData] = useState({
    age: '', sex: '', bmi: '', highBP: '', highChol: '', cholCheck: '',
    smoker: '', stroke: '', physActivity: '', fruits: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validationRules = {
    age: { min: 1, max: 120, required: true, type: 'number' },
    sex: { required: true, type: 'select' },
    bmi: { min: 10, max: 100, required: true, type: 'number' },
    highBP: { required: true, type: 'select' },
    highChol: { required: true, type: 'select' },
    cholCheck: { required: true, type: 'select' },
    smoker: { required: true, type: 'select' },
    stroke: { required: true, type: 'select' },
    physActivity: { required: true, type: 'select' },
    fruits: { required: true, type: 'select' }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (rules.required && !value) return 'Required';
    if (rules.type === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return 'Invalid';
      if (rules.min !== undefined && numValue < rules.min) return `Min: ${rules.min}`;
      if (rules.max !== undefined && numValue > rules.max) return `Max: ${rules.max}`;
    }
    if (rules.type === 'select' && !value) return 'Select';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (validationRules[name]?.type === 'number') {
      processedValue = value.replace(/[^\d.-]/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, processedValue) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    if (isValid) onPredict(formData);
  };

  const handleReset = () => {
    setFormData({
      age: '', sex: '', bmi: '', highBP: '', highChol: '', cholCheck: '',
      smoker: '', stroke: '', physActivity: '', fruits: ''
    });
    setErrors({});
    setTouched({});
  };

  const renderInput = (field) => (
    <div key={field.name} className={styles.formField}>
      <label className={styles.label}>
        {field.label} {field.unit && <span className={styles.labelUnit}>({field.unit})</span>} <span className={styles.required}>*</span>
      </label>
      <input
        type="text"
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={field.placeholder}
        className={`${styles.input} ${errors[field.name] && touched[field.name] ? styles.inputError : ''}`}
      />
      {errors[field.name] && touched[field.name] && (
        <span className={styles.errorText}>{errors[field.name]}</span>
      )}
    </div>
  );

  const renderSelect = (field) => (
    <div key={field.name} className={styles.formField}>
      <label className={styles.label}>
        {field.label} <span className={styles.required}>*</span>
      </label>
      <select
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`${styles.select} ${errors[field.name] && touched[field.name] ? styles.selectError : ''}`}
      >
        <option value="">Select...</option>
        {field.options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {errors[field.name] && touched[field.name] && (
        <span className={styles.errorText}>{errors[field.name]}</span>
      )}
    </div>
  );

  const numericFields = [
    { name: 'age', label: 'Age', unit: 'years' },
    { name: 'bmi', label: 'BMI', unit: 'kg/m²' },
  ];

  const selectFields = [
    { name: 'sex', label: 'Sex', options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]},
    { name: 'highBP', label: 'High Blood Pressure', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]},
    { name: 'highChol', label: 'High Cholesterol', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]},
    { name: 'cholCheck', label: 'Cholesterol Check In Past 5 Years', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]},
    { name: 'smoker', label: 'Smoked 100 Cigarettes In Life', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]},
    { name: 'stroke', label: 'Stroke', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]},
    { name: 'physActivity', label: 'Physical Activity in Past 30 Days', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]},
    { name: 'fruits', label: 'Consuming Fruits Each Day', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]},
  ];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Data Entry Form</h2>
          <p className={styles.headerSubtitle}>Enter information to generate risk assessment</p>
        </div>
        
        <div className={styles.formContent}>
          <div className={styles.formGrid}>
            {numericFields.map(renderInput)}
            {selectFields.map(renderSelect)}
          </div>
             
          <div className={styles.buttonContainer}>
            <button onClick={handleReset} className={styles.buttonReset}>
              Clear Form
            </button>
            <button onClick={handleSubmit} className={styles.buttonSubmit}>
              Generate Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;