import React from 'react';
import styles from '../../styles/Dashboard.module.css';

const AgeBinnedRisk = ({ analytics }) => {
  const { ageBinnedData } = analytics;

  if (!ageBinnedData || ageBinnedData.length === 0) {
    return (
      <div className={styles.analysisCard}>
        <h3 className={styles.analysisTitle}>Age-Binned Diabetes Risk</h3>
        <p className={styles.analysisSubtitle}>Risk distribution across age groups</p>
        <p className={styles.noData}>Calculating age-binned risk rates...</p>
      </div>
    );
  }

  // Find highest and lowest risk bins
  const highestRisk = ageBinnedData.reduce((max, bin) => 
    bin.positiveRate > max.positiveRate ? bin : max
  , ageBinnedData[0]);
  
  const lowestRisk = ageBinnedData.reduce((min, bin) => 
    bin.positiveRate < min.positiveRate ? bin : min
  , ageBinnedData[0]);

  return (
    <div className={styles.analysisCard}>
      <h3 className={styles.analysisTitle}>Age-Binned Diabetes Risk</h3>
      <p className={styles.analysisSubtitle}>Diabetes prevalence across age categories</p>
      <div className={styles.imbalanceMetrics}>        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Highest Risk Age Group:</span>
          <span className={styles.metricValue}>
            {highestRisk.ageLabel} ({highestRisk.positiveRate.toFixed(2)}%)
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Lowest Risk Age Group:</span>
          <span className={styles.metricValue}>
            {lowestRisk.ageLabel} ({lowestRisk.positiveRate.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Simple table view */}
      <div className={styles.ageBinnedTable}>
        <div className={styles.tableHeader}>
          <span>Age Group</span>
          <span>Total</span>
          <span>Diabetic/<br></br>Prediabetic</span>
          <span>Rate</span>
        </div>
        {ageBinnedData.map((bin, idx) => (
          <div key={idx} className={styles.tableRow}>
            <span className={styles.tableCell}>{bin.ageLabel}</span>
            <span className={styles.tableCell}>{bin.total.toLocaleString()}</span>
            <span className={styles.tableCell}>{bin.positive.toLocaleString()}</span>
            <span className={styles.tableCell}>
              <strong>{bin.positiveRate.toFixed(2)}%</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgeBinnedRisk;