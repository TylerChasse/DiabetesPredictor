import React, { useState } from 'react';
import styles from '../styles/InputForm.module.css';

const InputForm = ({ onPredict }) => {
  const [formData, setFormData] = useState({
    // Numeric fields
    BMI: '',
    MentHlth: '',
    PhysHlth: '',
    Age: '',
    // Categorical fields (binary 0/1)
    HeartDiseaseorAttack: '',
    HighBP: '',
    HighChol: '',
    CholCheck: '',
    Smoker: '',
    Stroke: '',
    PhysActivity: '',
    Fruits: '',
    Veggies: '',
    HvyAlcoholConsump: '',
    AnyHealthcare: '',
    NoDocbcCost: '',
    GenHlth: '',
    DiffWalk: '',
    Sex: '',
    Education: '',
    Income: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRules = {
    BMI: { min: 12, max: 95, required: true, type: 'number' },
    MentHlth: { min: 0, max: 30, required: true, type: 'number' },
    PhysHlth: { min: 0, max: 30, required: true, type: 'number' },
    Age: { required: true, type: 'select' },
    HeartDiseaseorAttack: { required: true, type: 'select' },
    HighBP: { required: true, type: 'select' },
    HighChol: { required: true, type: 'select' },
    CholCheck: { required: true, type: 'select' },
    Smoker: { required: true, type: 'select' },
    Stroke: { required: true, type: 'select' },
    PhysActivity: { required: true, type: 'select' },
    Fruits: { required: true, type: 'select' },
    Veggies: { required: true, type: 'select' },
    HvyAlcoholConsump: { required: true, type: 'select' },
    AnyHealthcare: { required: true, type: 'select' },
    NoDocbcCost: { required: true, type: 'select' },
    GenHlth: { required: true, type: 'select' },
    DiffWalk: { required: true, type: 'select' },
    Sex: { required: true, type: 'select' },
    Education: { required: true, type: 'select' },
    Income: { required: true, type: 'select' }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (rules.required && (value === '' || value === null || value === undefined)) {
      return 'Required';
    }
    if (rules.type === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return 'Invalid number';
      if (rules.min !== undefined && numValue < rules.min) return `Min: ${rules.min}`;
      if (rules.max !== undefined && numValue > rules.max) return `Max: ${rules.max}`;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (validationRules[name]?.type === 'number') {
      processedValue = value.replace(/[^\d.-]/g, '');
    } else if (validationRules[name]?.type === 'select') {
      processedValue = value === '' ? '' : parseInt(value);
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

  const handleSubmit = async () => {
    // Validate all fields
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
    
    if (isValid) {
      setIsSubmitting(true);
      try {
        await onPredict(formData);
      } catch (error) {
        console.error('Prediction error:', error);
        alert('Error making prediction. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const handleReset = () => {
    setFormData({
      BMI: '', MentHlth: '', PhysHlth: '', Age: '',
      HeartDiseaseorAttack: '', HighBP: '', HighChol: '', CholCheck: '',
      Smoker: '', Stroke: '', PhysActivity: '', Fruits: '', Veggies: '',
      HvyAlcoholConsump: '', AnyHealthcare: '', NoDocbcCost: '',
      GenHlth: '', DiffWalk: '', Sex: '', Education: '', Income: ''
    });
    setErrors({});
    setTouched({});
  };

  const renderInput = (field) => (
    <div key={field.name} className={styles.formField}>
      <label className={styles.label}>
        {field.label} 
        {field.unit && <span className={styles.labelUnit}> ({field.unit})</span>}
        <span className={styles.required}>*</span>
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
      {field.help && <span className={styles.helpText}>{field.help}</span>}
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
      {field.help && <span className={styles.helpText}>{field.help}</span>}
      {errors[field.name] && touched[field.name] && (
        <span className={styles.errorText}>{errors[field.name]}</span>
      )}
    </div>
  );

  // DEMOGRAPHICS SECTION
  const demographicFields = [
    { name: 'Sex', label: 'Sex', options: [{ value: 0, label: 'Female' }, { value: 1, label: 'Male' }] },
    { 
      name: 'Age', 
      label: 'Age Range', 
      options: [
        { value: 1, label: '18-24 years' },
        { value: 2, label: '25-29 years' },
        { value: 3, label: '30-34 years' },
        { value: 4, label: '35-39 years' },
        { value: 5, label: '40-44 years' },
        { value: 6, label: '45-49 years' },
        { value: 7, label: '50-54 years' },
        { value: 8, label: '55-59 years' },
        { value: 9, label: '60-64 years' },
        { value: 10, label: '65-69 years' },
        { value: 11, label: '70-74 years' },
        { value: 12, label: '75-79 years' },
        { value: 13, label: '80+ years' }
      ]
    },
    { 
      name: 'Education', 
      label: 'Education Level', 
      options: [
        { value: 1, label: 'Never attended/Kindergarten' },
        { value: 2, label: 'Elementary' },
        { value: 3, label: 'Some High School' },
        { value: 4, label: 'High School Graduate' },
        { value: 5, label: 'Some College' },
        { value: 6, label: 'College Graduate' }
      ]
    },
    { 
      name: 'Income', 
      label: 'Annual Household Income', 
      options: [
        { value: 1, label: 'Less than $10,000' },
        { value: 2, label: '$10,000 - $15,000' },
        { value: 3, label: '$15,000 - $20,000' },
        { value: 4, label: '$20,000 - $25,000' },
        { value: 5, label: '$25,000 - $35,000' },
        { value: 6, label: '$35,000 - $50,000' },
        { value: 7, label: '$50,000 - $75,000' },
        { value: 8, label: '$75,000 or more' }
      ]
    }
  ];

  // HEALTH & MEDICAL INFORMATION SECTION
  const healthNumericFields = [
    { name: 'BMI', label: 'BMI', unit: 'kg/m²', placeholder: 'e.g., 27.5', help: 'Body Mass Index (Range: 12-95)' },
    { name: 'MentHlth', label: 'Poor Mental Health Days', unit: 'days', placeholder: 'e.g., 5', help: 'Poor mental health days in past 30 days (0-30)' },
    { name: 'PhysHlth', label: 'Poor Physical Health Days', unit: 'days', placeholder: 'e.g., 3', help: 'Poor physical health days in past 30 days (0-30)' }
  ];

  const healthSelectFields = [
    { 
      name: 'GenHlth', 
      label: 'General Health', 
      options: [
        { value: 1, label: 'Excellent' },
        { value: 2, label: 'Very Good' },
        { value: 3, label: 'Good' },
        { value: 4, label: 'Fair' },
        { value: 5, label: 'Poor' }
      ]
    },
    { name: 'HighBP', label: 'High Blood Pressure', help: '*Diagnosed by a health professional', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'HighChol', label: 'High Cholesterol', help: '*Diagnosed by a health professional', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'CholCheck', label: 'Cholesterol Check (Past 5 Years)', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'Stroke', label: 'History of Stroke', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'HeartDiseaseorAttack', label: 'Heart Disease/Attack', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'DiffWalk', label: 'Difficulty Walking/Climbing Stairs', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'Smoker', label: 'Smoker (100+ Cigarettes in Lifetime)', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'PhysActivity', label: 'Daily Physical Activity', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'Fruits', label: 'Consume Fruits Daily', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'Veggies', label: 'Consume Vegetables Daily', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'HvyAlcoholConsump', label: 'Heavy Alcohol Consumption', help: 'More than 14 drinks per week', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'AnyHealthcare', label: 'Have Healthcare Coverage', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] },
    { name: 'NoDocbcCost', label: 'Could Not See Doctor Due to Cost', help: 'In past year', options: [{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }] }
];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Diabetes Risk Assessment Form</h2>
          <p className={styles.headerSubtitle}>Complete all fields for personalized risk prediction</p>
        </div>
        
        <div className={styles.formContent}>
          {/* SECTION 1: DEMOGRAPHICS */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Demographics</h3>
            <div className={styles.formGrid}>
              {demographicFields.map(renderSelect)}
            </div>
          </div>

          {/* SECTION 2: HEALTH & MEDICAL INFORMATION */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Health & Medical Information</h3>
            <div className={styles.formGrid}>
              {healthNumericFields.map(renderInput)}
              {healthSelectFields.map(renderSelect)}
            </div>
          </div>
             
          <div className={styles.buttonContainer}>
            <button onClick={handleReset} className={styles.buttonReset} disabled={isSubmitting}>
              Clear Form
            </button>
            <button onClick={handleSubmit} className={styles.buttonSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Analyzing...' : 'Generate Risk Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;