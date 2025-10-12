import React from 'react';
import styles from '../../styles/Dashboard.module.css';


const PhysActivityImpact = ({ analytics }) => {
  const { physActivityData } = analytics;

  if (!physActivityData) {
    return (
      <div className={styles.analysisCard}>
        <h3 className={styles.analysisTitle}>Physical Activity Impact</h3>
        <p className={styles.analysisSubtitle}>Effect of physical activity on diabetes risk</p>
        <p className={styles.noData}>Calculating physical activity impact...</p>
      </div>
    );
  }

  const { active, inactive, relativeRisk, riskReduction } = physActivityData;

  return (
    <div className={styles.analysisCard}>
      <h3 className={styles.analysisTitle}>Physical Activity Impact</h3>
      <p className={styles.analysisSubtitle}>Effect of physical activity on diabetes risk</p>
      <div className={styles.imbalanceMetrics}>
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Physically Active:</span>
          <span className={styles.metricValue}>
            {active.total.toLocaleString()} people
            <span className={styles.metricPercent}> ({active.diabetesRate.toFixed(2)}% diabetes rate)</span>
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Physically Inactive:</span>
          <span className={styles.metricValue}>
            {inactive.total.toLocaleString()} people
            <span className={styles.metricPercent}> ({inactive.diabetesRate.toFixed(2)}% diabetes rate)</span>
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Risk Reduction:</span>
          <span className={styles.metricValue} style={{ color: '#48bb78', fontWeight: 'bold' }}>
            {riskReduction.toFixed(2)}%
            <span className={styles.metricPercent}> (lower risk with activity)</span>
          </span>
        </div>
        
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Relative Risk:</span>
          <span className={styles.metricValue}>
            {relativeRisk.toFixed(2)}x
            <span className={styles.metricPercent}> (inactive vs active)</span>
          </span>
        </div>
      </div>

      {/* Detailed breakdown table */}
      <div className={styles.ageBinnedTable} style={{ marginTop: '20px' }}>
        <div className={styles.tableHeader}>
          <span>Activity Level</span>
          <span>Total</span>
          <span>Diabetic/<br></br>Prediabetic</span>
          <span>Rate</span>
        </div>
        
        <div className={styles.tableRow}>
          <span className={styles.tableCell}>
            <strong style={{ color: '#48bb78' }}>✓ Active</strong>
          </span>
          <span className={styles.tableCell}>{active.total.toLocaleString()}</span>
          <span className={styles.tableCell}>{active.diabetic.toLocaleString()}</span>
          <span className={styles.tableCell}>
            <strong style={{ color: '#48bb78' }}>{active.diabetesRate.toFixed(2)}%</strong>
          </span>
        </div>
        
        <div className={styles.tableRow}>
          <span className={styles.tableCell}>
            <strong style={{ color: '#f56565' }}>✗ Inactive</strong>
          </span>
          <span className={styles.tableCell}>{inactive.total.toLocaleString()}</span>
          <span className={styles.tableCell}>{inactive.diabetic.toLocaleString()}</span>
          <span className={styles.tableCell}>
            <strong style={{ color: '#f56565' }}>{inactive.diabetesRate.toFixed(2)}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhysActivityImpact;