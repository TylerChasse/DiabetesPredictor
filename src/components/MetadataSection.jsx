import React from 'react';
import styles from '../styles/Dashboard.module.css';

const MetadataSection = ({ metadata }) => {
  const metadataItems = [
    { label: 'Total Records', value: metadata.totalRecords.toLocaleString() },
    { label: 'Features', value: metadata.features },
    { label: 'Target Variable', value: metadata.targetVariable },
    { label: 'Negative Cases', value: metadata.classDistribution.negative.toLocaleString() },
    { label: 'Positive Cases', value: metadata.classDistribution.positive.toLocaleString() },
    { 
      label: 'Positive Rate', 
      value: metadata.totalRecords > 0 
        ? `${((metadata.classDistribution.positive / metadata.totalRecords) * 100).toFixed(2)}%` 
        : '0%' 
    },
    { label: 'Missing Values', value: metadata.missingValues.toLocaleString() },
  ];

  return (
    <section>
      <h2 className={styles.sectionTitle}>DATASET METADATA</h2>
      <p className={styles.sectionSubtitle}>
        Diabetes Health Indicators Dataset - Comprehensive Analysis
      </p>
      <div className={styles.metadataGrid}>
        {metadataItems.map((item, idx) => (
          <div key={idx} className={styles.metadataCard}>
            <div className={styles.metadataLabel}>{item.label}</div>
            <div className={styles.metadataValue}>{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MetadataSection;