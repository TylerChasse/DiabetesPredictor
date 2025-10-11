import React from 'react';
import styles from '../../styles/Dashboard.module.css';

const AnalyticsCard = ({ title, subtitle, children }) => {
  return (
    <div className={styles.analysisCard}>
      <h3 className={styles.analysisTitle}>{title}</h3>
      {subtitle && <p className={styles.analysisSubtitle}>{subtitle}</p>}
      {children}
    </div>
  );
};

export default AnalyticsCard;