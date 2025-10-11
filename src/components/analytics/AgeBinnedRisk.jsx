import React from 'react';
import styles from '../../styles/Dashboard.module.css';
import AnalyticsCard from './AnalyticsCard';

const AgeBinnedRisk = ({ analytics }) => {
  const { ageBinnedData } = analytics;

  if (!ageBinnedData || ageBinnedData.length === 0) {
    return (
      <AnalyticsCard title="Age-Binned Diabetes Risk" subtitle="Risk distribution across age groups">
        <p className={styles.noData}>Calculating age-binned risk rates...</p>
      </AnalyticsCard>
    );
  }

  // Find highest and lowest risk bins
  const highestRisk = ageBinnedData.reduce((max, bin) => 
    bin.positiveRate > max.positiveRate ? bin : max
  , ageBinnedData[0]);
  
  const lowestRisk = ageBinnedData.reduce((min, bin) => 
    bin.positiveRate < min.positiveRate ? bin : min
  , ageBinnedData[0]);

  // Calculate average risk
  const avgRisk = (ageBinnedData.reduce((sum, bin) => sum + bin.positiveRate, 0) / ageBinnedData.length).toFixed(2);

  // Calculate risk trend (increasing/decreasing)
  const firstHalfAvg = ageBinnedData.slice(0, Math.floor(ageBinnedData.length / 2))
    .reduce((sum, bin) => sum + bin.positiveRate, 0) / Math.floor(ageBinnedData.length / 2);
  const secondHalfAvg = ageBinnedData.slice(Math.floor(ageBinnedData.length / 2))
    .reduce((sum, bin) => sum + bin.positiveRate, 0) / Math.ceil(ageBinnedData.length / 2);
  const trend = secondHalfAvg > firstHalfAvg ? 'increases' : 'decreases';
  const trendPercent = Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(1);

  return (
    <AnalyticsCard 
      title="Age-Binned Diabetes Risk" 
      subtitle="Diabetes prevalence across age categories"
    >
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
          <span>Diabetic/Prediabetic</span>
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
    </AnalyticsCard>
  );
};

export default AgeBinnedRisk;