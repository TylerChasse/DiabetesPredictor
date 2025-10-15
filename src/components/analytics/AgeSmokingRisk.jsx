import React from 'react';
import styles from '../../styles/Dashboard.module.css';

const AgeSmokingRisk = ({ analytics }) => {
  const { mosaicData } = analytics;

  if (!mosaicData || !mosaicData.ageGroups) {
    return (
      <div className={styles.analysisCard}>
        <h3 className={styles.analysisTitle}>Smoking Risk Analysis</h3>
        <p className={styles.analysisSubtitle}>Diabetes risk by smoking status</p>
        <p className={styles.noData}>Calculating insights...</p>
      </div>
    );
  }

  const { ageGroups } = mosaicData;

  // Calculate overall smoking vs non-smoking diabetes rates
  let smokerTotal = 0, smokerDiabetic = 0;
  let nonSmokerTotal = 0, nonSmokerDiabetic = 0;
  
  ageGroups.forEach(group => {
    const smokerData = group.bySmokingStatus['Smoker'];
    const nonSmokerData = group.bySmokingStatus['Non-Smoker'];
    
    smokerTotal += smokerData.total;
    smokerDiabetic += smokerData.byOutcome['Diabetic/Prediabetic'] || 0;
    
    nonSmokerTotal += nonSmokerData.total;
    nonSmokerDiabetic += nonSmokerData.byOutcome['Diabetic/Prediabetic'] || 0;
  });

  const smokerRate = (smokerDiabetic / smokerTotal * 100).toFixed(2);
  const nonSmokerRate = (nonSmokerDiabetic / nonSmokerTotal * 100).toFixed(2);
  const riskIncrease = (smokerRate - nonSmokerRate).toFixed(2);
  const relativeRisk = (smokerRate / nonSmokerRate).toFixed(2);

  // Find age groups with highest/lowest diabetes rates
  const ageGroupRates = ageGroups.map(group => {
    const totalDiabetic = 
      (group.bySmokingStatus['Smoker'].byOutcome['Diabetic/Prediabetic'] || 0) +
      (group.bySmokingStatus['Non-Smoker'].byOutcome['Diabetic/Prediabetic'] || 0);
    const rate = (totalDiabetic / group.total * 100);
    return { label: group.label, rate };
  });

  const highestRiskAge = ageGroupRates.reduce((max, curr) => 
    curr.rate > max.rate ? curr : max
  );
  
  const lowestRiskAge = ageGroupRates.reduce((min, curr) => 
    curr.rate < min.rate ? curr : min
  );

  return (
    <div className={styles.analysisCard}>
      <h3 className={styles.analysisTitle}>Smoking Risk Analysis</h3>
      <p className={styles.analysisSubtitle}>Diabetes risk by smoking status</p>
      
      <div className={styles.imbalanceMetrics}>
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Smokers:</span>
          <span className={styles.metricValue}>
            {smokerTotal.toLocaleString()} people
            <span className={styles.metricPercent}> ({smokerRate}% diabetes rate)</span>
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Non-Smokers:</span>
          <span className={styles.metricValue}>
            {nonSmokerTotal.toLocaleString()} people
            <span className={styles.metricPercent}> ({nonSmokerRate}% diabetes rate)</span>
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Risk Increase (Smoking):</span>
          <span className={styles.metricValue} style={{ color: '#f56565', fontWeight: 'bold' }}>
            +{riskIncrease}%
            <span className={styles.metricPercent}> (absolute increase)</span>
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Relative Risk:</span>
          <span className={styles.metricValue}>
            {relativeRisk}x
            <span className={styles.metricPercent}> (smokers vs non-smokers)</span>
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
          <strong>Key Insight:</strong> Smokers have a {riskIncrease}% higher diabetes rate 
          ({relativeRisk}x relative risk).
        </p>
      </div>
    </div>
  );
};

export default AgeSmokingRisk;