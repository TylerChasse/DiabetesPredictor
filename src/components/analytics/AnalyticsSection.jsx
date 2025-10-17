import React from 'react';
import styles from '../../styles/AnalyticsSection.module.css';
import ClassImbalance from './ClassImbalance';
import AgeBinnedRisk from './AgeBinnedRisk';
import PhysActivityImpact from './PhysActivityRisk';
import AgeSmokingRisk from './AgeSmokingRisk';

const AnalyticsSection = () => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>STATISTICAL ANALYSIS</h2>
      <div className={styles.analysisGrid}>
        <ClassImbalance />
        <AgeBinnedRisk />
        <PhysActivityImpact />
        <AgeSmokingRisk />
        {/* Add more analytics here */}
      </div>
    </section>
  );
};

export default AnalyticsSection;