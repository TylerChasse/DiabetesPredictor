import React from 'react';
import styles from '../../styles/Dashboard.module.css';
import ClassImbalance from './ClassImbalance';
import AgeBinnedRisk from './AgeBinnedRisk';

const AnalyticsSection = ({ metadata, analytics }) => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>STATISTICAL ANALYSIS</h2>
      <div className={styles.analysisGrid}>
        <ClassImbalance metadata={metadata} analytics={analytics} />
        <AgeBinnedRisk analytics={analytics} />
        {/* Add more analytics here */}
      </div>
    </section>
  );
};

export default AnalyticsSection;