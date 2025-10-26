import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import Results from '../components/Results';
import { predictDiabetes } from '../utils/ModelPrediction';
import { supabase } from '../utils/supabaseClient';
import styles from '../styles/Predictor.module.css';

const Predictor = () => {
  const [showResults, setShowResults] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Make prediction using the real model
      const result = await predictDiabetes(formData);
      setPrediction(result);
      setShowResults(true);

      // Save to Supabase database
      try {
        const { data, error: dbError } = await supabase
          .from('diabetes_health')
          .insert([{
            // Set diabetes based on prediction result
            Diabetes: result.class, // 0 = no diabetes, 1 = diabetes/prediabetes
            
            // User input data
            BMI: formData.BMI,
            MentHlth: formData.MentHlth,
            PhysHlth: formData.PhysHlth,
            Age: formData.Age,
            HeartDiseaseorAttack: formData.HeartDiseaseorAttack,
            HighBP: formData.HighBP,
            HighChol: formData.HighChol,
            CholCheck: formData.CholCheck,
            Smoker: formData.Smoker,
            Stroke: formData.Stroke,
            PhysActivity: formData.PhysActivity,
            Fruits: formData.Fruits,
            Veggies: formData.Veggies,
            HvyAlcoholConsump: formData.HvyAlcoholConsump,
            AnyHealthcare: formData.AnyHealthcare,
            NoDocbcCost: formData.NoDocbcCost,
            GenHlth: formData.GenHlth,
            DiffWalk: formData.DiffWalk,
            Sex: formData.Sex,
            Education: formData.Education,
            Income: formData.Income,
            
            // Mark as predicted record
            predicted: 1
          }])
          .select();

        if (dbError) {
          console.error('Database error:', dbError);
          // Don't fail the prediction if database save fails
        } else {
          console.log('Prediction saved successfully:', data);
        }
      } catch (dbError) {
        console.error('Failed to save to database (non-fatal):', dbError);
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to generate prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setShowResults(false);
    setPrediction(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <h2>Analyzing Your Data...</h2>
          <p>Running prediction model</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleBackToForm} className={styles.button}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {showResults && prediction ? (
          <Results prediction={prediction} onBackToForm={handleBackToForm} />
        ) : (
          <InputForm onPredict={handlePredict} />
        )}
      </main>
    </div>
  );
};

export default Predictor;