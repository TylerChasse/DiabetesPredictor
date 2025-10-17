import React, { useMemo } from 'react';
import styles from '../../styles/AnalyticsSection.module.css';
import { calculateClassImbalanceData } from '../../utils/DataAnalysis';

const ClassImbalance = () => {
  const imbalanceData = useMemo(() => calculateClassImbalanceData(), []);
  const totalRecords = imbalanceData.negativeCount + imbalanceData.positiveCount;

  // Calculate ratio if not provided
  const ratio = imbalanceData.ratio

  const negativePercent = totalRecords > 0
    ? ((imbalanceData.negativeCount / totalRecords) * 100).toFixed(2)
    : '0';

  const positivePercent = totalRecords > 0
    ? ((imbalanceData.positiveCount / totalRecords) * 100).toFixed(2)
    : '0';

  return (
    <div className={styles.analysisCard}>
      <h3 className={styles.analysisTitle}>Class Imbalance Analysis</h3>
      <div className={styles.imbalanceMetrics}>
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Imbalance Ratio:</span>
          <span className={styles.metricValue}>
            {ratio}:1
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Non-Diabetic:</span>
          <span className={styles.metricValue}>
            {imbalanceData.negativeCount.toLocaleString()}
            <span className={styles.metricPercent}> ({negativePercent}%)</span>
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Diabetic or Prediabetic:</span>
          <span className={styles.metricValue}>
            {imbalanceData.positiveCount.toLocaleString()}
            <span className={styles.metricPercent}> ({positivePercent}%)</span>
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Deviation from Balance:</span>
          <span className={styles.metricValue}>
            {Math.abs(50 - parseFloat(positivePercent)).toFixed(2)}%
          </span>
        </div>
      </div>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#fffbeb', 
        borderRadius: '8px',
        borderLeft: '4px solid #f59e0b'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
          <strong>Key Insight:</strong> The dataset shows a {ratio}:1 imbalance with {negativePercent}% 
          non-diabetic cases. This inbalance should be considered when analyzing findings.
        </p>
      </div>
    </div>
  );
};

export default ClassImbalance;