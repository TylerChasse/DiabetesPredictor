import React, { useMemo } from 'react';
import styles from '../styles/MetadataSection.module.css';
import { getMetadata } from '../utils/DataAnalysis';

const MetadataSection = () => {
  const metadata = useMemo(() => getMetadata(), []);

  const negativePercent = metadata.totalRecords > 0 
    ? ((metadata.classDistribution.negative / metadata.totalRecords) * 100).toFixed(2)
    : '0';
  
  const positivePercent = metadata.totalRecords > 0 
    ? ((metadata.classDistribution.positive / metadata.totalRecords) * 100).toFixed(2)
    : '0';

  const metadataItems = [
    { label: 'Total Records', value: metadata.totalRecords.toLocaleString() },
    { label: 'Features', value: metadata.features },
    { label: 'Target Variable', value: metadata.targetVariable },
    { 
      label: 'Negative Cases', 
      value: metadata.classDistribution.negative.toLocaleString(),
      subValue: `(${negativePercent}%)`
    },
    { 
      label: 'Positive Cases', 
      value: metadata.classDistribution.positive.toLocaleString(),
      subValue: `(${positivePercent}%)`
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
            <div className={styles.metadataValue}>
              {item.value}
              {item.subValue && (
                <span style={{ 
                  fontSize: '22px', 
                  fontWeight: '400', 
                  marginLeft: '8px',
                  color: '#718096'
                }}>
                  {item.subValue}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MetadataSection;