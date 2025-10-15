import React from 'react';
import styles from '../../styles/Dashboard.module.css';
import AgeBinnedChart from './AgeBinnedChart';
import PhysActivityChart from './PhysActivityChart';
import MosaicPlot from './MosaicPlot';

const VisualizationsSection = ({ analytics }) => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>DATA VISUALIZATIONS</h2>
      <div className={styles.visualizationGrid}>
        <AgeBinnedChart analytics={analytics} />
        <PhysActivityChart analytics={analytics} />
        <MosaicPlot analytics={analytics} />
        {/* Add more visualizations here*/}
      </div>
    </section>
  );
};

export default VisualizationsSection;