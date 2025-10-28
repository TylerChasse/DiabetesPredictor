import React, { useMemo } from 'react';
import { calculateDiabeticRiskProfile } from '../../utils/DataAnalysis';
import styles from '../../styles/AnalyticsSection.module.css';

const LeastRiskFactors = () => {
  const profileData = useMemo(() => calculateDiabeticRiskProfile(), []);

  // Get bottom 5 least influential (smallest difference)
  const leastRelevant = profileData.slice(-5).reverse();

  return (
    <div className={styles.analysisCard}>
      <h3 className={styles.analysisTitle}>Least Relevant Risk Factors for Diabetes</h3>
      <p className={styles.analysisSubtitle}>
        Least influential risk factors (ranked by prevalence difference)
      </p>

      <div className={styles.ageBinnedTable}>
        <div className={styles.tableHeader}>
          <span>Risk Factor</span>
          <span>Diabetic/<br></br>Prediabetic</span>
          <span>Non-Diabetic</span>
          <span>Difference</span>
        </div>

        {leastRelevant.map((item, idx) => {
          const diffValue = parseFloat(item.difference);

          return (
            <div key={idx} className={styles.tableRow}>
              <span className={styles.tableCell}>
                <strong style={{ color: idx === 0 ? '#718096' : '#2d3748' }}>
                  {idx + 1}. {item.factor}
                </strong>
              </span>
              <span className={styles.tableCell} style={{ color: '#f56565', fontWeight: 600 }}>
                {item.Diabetic}%
              </span>
              <span className={styles.tableCell} style={{ color: '#48bb78', fontWeight: 600 }}>
                {item.NonDiabetic}%
              </span>
              <span className={styles.tableCell}>
                <strong style={{ color: diffValue > 0 ? '#f56565' : '#48bb78' }}>
                  {diffValue > 0 ? '+' : ''}{item.difference}%
                </strong>
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.imbalanceMetrics} style={{ marginTop: '16px' }}>
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Least Influential Factor:</span>
          <span className={styles.metricValue} style={{ color: '#718096' }}>
            {leastRelevant[0].factor}
          </span>
        </div>

        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Prevalence in Diabetics:</span>
          <span className={styles.metricValue}>
            {leastRelevant[0].Diabetic}%
            <span className={styles.metricPercent}> vs {leastRelevant[0].NonDiabetic}% in non-diabetics</span>
          </span>
        </div>
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        borderLeft: '4px solid #718096'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#2d3748' }}>
          <strong>Key Insight:</strong> {leastRelevant[0].factor} shows only {leastRelevant[0].difference}%
          difference between groups, making it the weakest indicator.
        </p>
      </div>
    </div>
  );
};

export default LeastRiskFactors;
