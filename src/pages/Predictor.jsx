import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import Results from '../components/Results';
import styles from '../styles/Predictor.module.css';

const Predictor = () => {
  const [showResults, setShowResults] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handlePredict = (formData) => {
    const mockPrediction = {
      class: Math.random() > 0.5 ? 1 : 0,
      probabilities: [0.35, 0.65]
    };
    setPrediction(mockPrediction);
    setShowResults(true);
  };

  const handleBackToForm = () => {
    setShowResults(false);
    setPrediction(null);
  };

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