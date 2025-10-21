import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import Results from '../components/Results';
import { predictDiabetes } from '../utils/ModelPrediction';
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