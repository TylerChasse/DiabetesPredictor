import React, { useMemo } from 'react';
import { calculateDiabeticRiskProfile } from '../../utils/DataAnalysis';
import styles from '../../styles/AnalyticsSection.module.css';

const DiabeticRiskFactors = () => {
  const profileData = useMemo(() => calculateDiabeticRiskProfile(), []);

  // Get top 5 most influential
  const topRisks = profileData.slice(0, 5);

  return (
    <div className={styles.analysisCard}>
      <h3 className={styles.analysisTitle}>Top Risk Factors for Diabetes</h3>
      <p className={styles.analysisSubtitle}>
        Most influential risk factors (ranked by prevalence difference)
      </p>
      
      <div className={styles.ageBinnedTable}>
        <div className={styles.tableHeader}>
          <span>Risk Factor</span>
          <span>Diabetic/<br></br>Prediabetic</span>
          <span>Non-Diabetic</span>
          <span>Difference</span>
        </div>
        
        {topRisks.map((item, idx) => {
          const diffValue = parseFloat(item.difference);
          
          return (
            <div key={idx} className={styles.tableRow}>
              <span className={styles.tableCell}>
                <strong style={{ color: idx === 0 ? '#f56565' : '#2d3748' }}>
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
          <span className={styles.metricLabel}>Most Influential Factor:</span>
          <span className={styles.metricValue} style={{ color: '#f56565' }}>
            {topRisks[0].factor}
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Prevalence in Diabetics:</span>
          <span className={styles.metricValue}>
            {topRisks[0].Diabetic}%
            <span className={styles.metricPercent}> vs {topRisks[0].NonDiabetic}% in non-diabetics</span>
          </span>
        </div>
      </div>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#fef2f2', 
        borderRadius: '8px',
        borderLeft: '4px solid #f56565'
      }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>
          <strong>Key Insight:</strong> {topRisks[0].factor} is {topRisks[0].difference}% more 
          common in people with diabetes, making it the strongest indicator.
        </p>
      </div>
    </div>
  );
};

export default DiabeticRiskFactors;