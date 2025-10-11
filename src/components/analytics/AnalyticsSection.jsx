import React from 'react';
import styles from '../../styles/Dashboard.module.css';
import ClassImbalance from './ClassImbalance';

const AnalyticsSection = ({ metadata, analytics }) => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>STATISTICAL ANALYSIS</h2>
      <div className={styles.analysisGrid}>
        <ClassImbalance metadata={metadata} analytics={analytics} />
      </div>
    </section>
  );
};

export default AnalyticsSection;