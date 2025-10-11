import React from 'react';
import styles from '../../styles/Dashboard.module.css';
import AnalyticsCard from './AnalyticsCard';

const ClassImbalance = ({ metadata, analytics }) => {
  const { totalRecords, classDistribution } = metadata;
  const { imbalance } = analytics;

  // Calculate ratio if not provided
  const ratio = imbalance?.ratio || 
    (classDistribution.positive > 0 
      ? (classDistribution.negative / classDistribution.positive).toFixed(2)
      : '0');

  const negativePercent = totalRecords > 0
    ? ((classDistribution.negative / totalRecords) * 100).toFixed(2)
    : '0';

  const positivePercent = totalRecords > 0
    ? ((classDistribution.positive / totalRecords) * 100).toFixed(2)
    : '0';

  const isBalanced = parseFloat(ratio) <= 2;

  return (
    <AnalyticsCard title="Class Imbalance Analysis">
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
            {classDistribution.negative.toLocaleString()}
            <span className={styles.metricPercent}> ({negativePercent}%)</span>
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Diabetic or Prediabetic:</span>
          <span className={styles.metricValue}>
            {classDistribution.positive.toLocaleString()}
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
    </AnalyticsCard>
  );
};

export default ClassImbalance;