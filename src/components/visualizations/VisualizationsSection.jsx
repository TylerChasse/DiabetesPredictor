import React from 'react';
import styles from '../../styles/VisualizationsSection.module.css';
import AgeBinnedChart from './AgeBinnedChart';
import PhysActivityChart from './PhysActivityChart';
import AgeSmokingMosaic from './AgeSmokingMosaic';
import RiskProfileRadar from './RiskProfileRadar';

const VisualizationsSection = () => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>DATA VISUALIZATIONS</h2>
      <div className={styles.visualizationGrid}>
        <AgeBinnedChart />
        <RiskProfileRadar />
        <AgeSmokingMosaic />
        <PhysActivityChart />
        {/* Add more visualizations here*/}
      </div>
    </section>
  );
};

export default VisualizationsSection;