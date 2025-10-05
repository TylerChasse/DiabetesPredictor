import React from 'react';
import styles from '../styles/Results.module.css';

const Results = ({ prediction, onBackToForm }) => {
  const isHighRisk = prediction.class === 1;
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Risk Assessment Results</h2>
          <p className={styles.headerSubtitle}>Model prediction based on clinical input data</p>
        </div>
        
        <div className={styles.content}>
          {/* Risk Alert */}
          <div className={`${styles.riskAlert} ${isHighRisk ? styles.riskAlertHigh : styles.riskAlertLow}`}>
            <div className={styles.riskAlertContent}>
              <div className={`${styles.riskIcon} ${isHighRisk ? styles.riskIconHigh : styles.riskIconLow}`}>
                {isHighRisk ? '⚠️' : '✓'}
              </div>
              <div className={styles.riskTextContainer}>
                <h3 className={`${styles.riskTitle} ${isHighRisk ? styles.riskTitleHigh : styles.riskTitleLow}`}>
                  {isHighRisk ? 'POSITIVE RISK DETECTED' : 'NEGATIVE RISK ASSESSMENT'}
                </h3>
                <p className={styles.riskDescription}>
                  {isHighRisk 
                    ? 'The predictive model indicates an elevated risk classification. Clinical review recommended.' 
                    : 'The predictive model indicates a lower risk classification. Continue standard monitoring.'}
                </p>
              </div>
            </div>
          </div>

          {/* Confidence Scores */}
          <div className={styles.scoresSection}>
            <h3 className={styles.scoresTitle}>
              MODEL CONFIDENCE SCORES
            </h3>
            <div className={styles.scoresList}>
              <div className={styles.scoreItem}>
                <div className={styles.scoreHeader}>
                  <span className={styles.scoreLabel}>Class 0 (Negative)</span>
                  <span className={styles.scoreValue}>
                    {(prediction.probabilities[0] * 100).toFixed(1)}%
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={`${styles.progressFill} ${styles.progressFillNegative}`}
                    style={{ width: `${prediction.probabilities[0] * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className={styles.scoreItem}>
                <div className={styles.scoreHeader}>
                  <span className={styles.scoreLabel}>Class 1 (Positive)</span>
                  <span className={styles.scoreValue}>
                    {(prediction.probabilities[1] * 100).toFixed(1)}%
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={`${styles.progressFill} ${styles.progressFillPositive}`}
                    style={{ width: `${prediction.probabilities[1] * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Disclaimer */}
          <div className={styles.disclaimer}>
            <h4 className={styles.disclaimerTitle}>⚕️ CLINICAL DISCLAIMER</h4>
            <p className={styles.disclaimerText}>
              This assessment is for educational purposes only. <strong>This is not a medical diagnosis</strong> and must not substitute professional medical judgment.
            </p>
          </div>

          {/* Action Button */}
          <button onClick={onBackToForm} className={styles.button}>
            Perform New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;