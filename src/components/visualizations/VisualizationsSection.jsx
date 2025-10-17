import React from 'react';
import styles from '../../styles/VisualizationsSection.module.css';
import AgeBinnedChart from './AgeBinnedChart';
import PhysActivityChart from './PhysActivityChart';
import AgeSmokingMosaic from './AgeSmokingMosaic';

const VisualizationsSection = () => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>DATA VISUALIZATIONS</h2>
      <div className={styles.visualizationGrid}>
        <AgeBinnedChart />
        <PhysActivityChart />
        <AgeSmokingMosaic />
        {/* Add more visualizations here*/}
      </div>
    </section>
  );
};

export default VisualizationsSection;