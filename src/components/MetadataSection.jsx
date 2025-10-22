import React, { useMemo } from 'react';
import { 
  getMetadata, 
  getAverageAge,
  getAverageBMI,
  getAverageIncome 
} from '../utils/DataAnalysis';
import styles from '../styles/MetadataSection.module.css';

const MetadataSection = () => {
  const metadata = useMemo(() => getMetadata(), []);
  const averageAge = useMemo(() => getAverageAge(), []);
  const averageBMI = useMemo(() => getAverageBMI(), []);
  const averageIncome = useMemo(() => getAverageIncome(), []);

  const negativePercent = ((metadata.classDistribution.negative / metadata.totalRecords) * 100).toFixed(2);
  const positivePercent = ((metadata.classDistribution.positive / metadata.totalRecords) * 100).toFixed(2);

  const metadataItems = [
    { label: 'Total Records', value: metadata.totalRecords.toLocaleString() },
    { label: 'Collection Year', value: '2015'},
    { label: 'Features', value: metadata.features },
    { label: 'Target Variable', value: metadata.targetVariable },
    { label: 'Missing Values', value: metadata.missingValues.toLocaleString() },
    { 
      label: 'Positive Cases', 
      value: metadata.classDistribution.positive.toLocaleString(),
      subValue: `(${positivePercent}%)`
    },
    { 
      label: 'Negative Cases', 
      value: metadata.classDistribution.negative.toLocaleString(),
      subValue: `(${negativePercent}%)`
    },
    { label: 'Average Age', value: averageAge.ageRange },
    { label: 'Average BMI', value: averageBMI, subValue: 'kg/m²' },
    { label: 'Average Household Income', value: averageIncome.incomeRange }
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
                  fontSize: '16px', 
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