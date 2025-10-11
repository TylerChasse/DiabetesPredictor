import React from 'react';
import styles from '../../styles/Dashboard.module.css';

const VisualizationsSection = ({ analytics }) => {
  const visualizations = [
    'BMI Distribution',
    'Age vs Health Status',
    'Risk Factors by Diabetes Status'
  ];

  return (
    <section>
      <h2 className={styles.sectionTitle}>DATA VISUALIZATIONS</h2>
      <div className={styles.visualizationGrid}>
        {visualizations.map((title, idx) => (
          <div key={idx} className={styles.visualizationCard}>
            <h3 className={styles.visualizationTitle}>{title}</h3>
            <div className={styles.chartPlaceholder}>
              <div className={styles.chartIcon}>📊</div>
              <div className={styles.chartLabel}>CHART PLACEHOLDER</div>
              <div className={styles.chartSubtext}>Replace with Recharts visualization</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VisualizationsSection;