import React from 'react';
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  const metadata = {
    totalRecords: 768,
    features: 8,
    targetVariable: 'Outcome',
    classDistribution: { negative: 500, positive: 268 },
    missingValues: 0,
    featureTypes: { numeric: 8 }
  };

  const metadataItems = [
    { label: 'Total Records', value: metadata.totalRecords },
    { label: 'Features', value: metadata.features },
    { label: 'Target Variable', value: metadata.targetVariable },
    { label: 'Negative Cases', value: metadata.classDistribution.negative },
    { label: 'Positive Cases', value: metadata.classDistribution.positive },
    { label: 'Positive Rate', value: `${((metadata.classDistribution.positive / metadata.totalRecords) * 100).toFixed(1)}%` },
    { label: 'Missing Values', value: metadata.missingValues },
    { label: 'Numeric Features', value: metadata.featureTypes.numeric }
  ];

  const correlations = [
    { feature: 'Glucose → Outcome', value: '0.47' },
    { feature: 'BMI → Outcome', value: '0.29' },
    { feature: 'Age → Outcome', value: '0.24' }
  ];

  const visualizations = [
    'Age Distribution',
    'BMI vs Glucose',
    'Outcome by Age Groups'
  ];

  return (
    <div className={styles.container}>
      <section>
        <h2 className={styles.sectionTitle}>DATASET METADATA</h2>
        <div className={styles.metadataGrid}>
          {metadataItems.map((item, idx) => (
            <div key={idx} className={styles.metadataCard}>
              <div className={styles.metadataLabel}>{item.label}</div>
              <div className={styles.metadataValue}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>STATISTICAL ANALYSIS</h2>
        <div className={styles.analysisGrid}>
          <div className={styles.analysisCard}>
            <h3 className={styles.analysisTitle}>Class Distribution</h3>
            <div className={styles.analysisRatio}>1.87:1 Ratio</div>
            <div className={styles.distributionList}>
              <div className={`${styles.distributionItem} ${styles.distributionNegative}`}>
                <span>Negative</span>
                <strong>65.1%</strong>
              </div>
              <div className={`${styles.distributionItem} ${styles.distributionPositive}`}>
                <span>Positive</span>
                <strong>34.9%</strong>
              </div>
            </div>
          </div>

          <div className={styles.analysisCard}>
            <h3 className={styles.analysisTitle}>Feature Correlations</h3>
            <div className={styles.correlationList}>
              {correlations.map((item, idx) => (
                <div key={idx} className={styles.correlationItem}>
                  <span>{item.feature}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>DATA VISUALIZATIONS</h2>
        <div className={styles.visualizationGrid}>
          {visualizations.map((title, idx) => (
            <div key={idx} className={styles.visualizationCard}>
              <h3 className={styles.visualizationTitle}>{title}</h3>
              <div className={styles.chartPlaceholder}>
                <div className={styles.chartIcon}>📊</div>
                <div className={styles.chartLabel}>CHART PLACEHOLDER</div>
                <div className={styles.chartSubtext}>Replace with Recharts</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;