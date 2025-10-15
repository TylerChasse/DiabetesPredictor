import React from 'react';
import styles from '../../styles/Dashboard.module.css';
import AgeBinnedChart from './AgeBinnedChart';
import PhysActivityChart from './PhysActivityChart';
import AgeSmokingMosaic from './AgeSmokingMosaic';

const VisualizationsSection = ({ analytics }) => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>DATA VISUALIZATIONS</h2>
      <div className={styles.visualizationGrid}>
        <AgeBinnedChart analytics={analytics} />
        <PhysActivityChart analytics={analytics} />
        <AgeSmokingMosaic analytics={analytics} />
        {/* Add more visualizations here*/}
      </div>
    </section>
  );
};

export default VisualizationsSection;