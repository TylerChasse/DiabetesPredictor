import React, { useMemo } from 'react';
import styles from '../../styles/AnalyticsSection.module.css';
import { calculateBmiRiskAnalysis } from '../../utils/DataAnalysis';

const BmiRiskAnalysis = () => {
  const bmiData = useMemo(() => {
    try {
      return calculateBmiRiskAnalysis();
    } catch (error) {
      console.error('Error calculating BMI risk analysis:', error);
      return null;
    }
  }, []);

  if (!bmiData) {
    return (
      <div className={styles.analysisCard}>
        <h3 className={styles.analysisTitle}>BMI Risk Analysis</h3>
        <p className={styles.analysisSubtitle}>Diabetes risk by body mass index</p>
        <p className={styles.noData}>Calculating insights...</p>
      </div>
    );
  }

  const {
    bmiStats,
    highestBMI,
    lowestBMI,
    avgBMIDiabetic,
    avgBMINonDiabetic,
    bmiDifference
  } = bmiData;

  return (
    <div className={styles.analysisCard}>
      <h3 className={styles.analysisTitle}>BMI Risk Analysis</h3>
      <p className={styles.analysisSubtitle}>Diabetes risk by body mass index</p>

      {/* BMI Category Analysis */}
      <div style={{ marginBottom: '24px' }}>
        <div className={styles.imbalanceMetrics}>
          {Object.entries(bmiStats).map(([category, stats]) => (
            <div key={category} className={styles.metricRow}>
              <span className={styles.metricLabel}>{category}:</span>
              <span className={styles.metricValue}>
                {stats.total.toLocaleString()} people
                <span className={styles.metricPercent}> ({stats.rate.toFixed(2)}% diabetes rate)</span>
              </span>
            </div>
          ))}

          <div className={styles.metricRow} style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <span className={styles.metricLabel}>Avg BMI (Diabetic):</span>
            <span className={styles.metricValue} style={{ color: '#f56565', fontWeight: 'bold' }}>
              {avgBMIDiabetic}
            </span>
          </div>

          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Avg BMI (Non-Diabetic):</span>
            <span className={styles.metricValue} style={{ color: '#48bb78', fontWeight: 'bold' }}>
              {avgBMINonDiabetic}
            </span>
          </div>
        </div>
      </div>

      {/* Key Insight 1 */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        borderLeft: '4px solid #f56565'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>
          <strong>Key Insight:</strong> {highestBMI.category} individuals have the highest diabetes risk at {highestBMI.rate.toFixed(2)}%.
        </p>
      </div>

      {/* Key Insight 2 */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        borderLeft: '4px solid #f56565'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>
          <strong>Key Insight:</strong> People with diabetes have an average BMI of {avgBMIDiabetic}, which is {bmiDifference} points higher than non-diabetic individuals.
        </p>
      </div>

      {/* Key Insight 3 */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        borderLeft: '4px solid #f56565'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>
          <strong>Key Insight:</strong> There is a {(highestBMI.rate - lowestBMI.rate).toFixed(2)}% difference in diabetes rates between the highest and lowest BMI categories.
        </p>
      </div>
    </div>
  );
};

export default BmiRiskAnalysis;
