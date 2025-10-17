import React, { useState, useEffect } from 'react';
import styles from '../styles/Dashboard.module.css';
import MetadataSection from '../components/MetadataSection';
import AnalyticsSection from '../components/analytics/AnalyticsSection';
import VisualizationsSection from '../components/visualizations/VisualizationsSection';
import { loadData } from '../utils/DataAnalysis';

const Dashboard = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const initData = async () => {
      try {
        setProgress(30);
        await loadData();
        setProgress(90);
        await new Promise(res => setTimeout(res, 500)); // Simulate processing delay
        setDataLoaded(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    setProgress(100);
    initData();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading dataset...</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <p className={styles.progressText}>{progress}%</p>
          <p className={styles.loadingHint}>Processing diabetes health indicators dataset</p>
        </div>
      </div>
    );
  }

  if (!dataLoaded) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>⚠️ Error Loading Data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <MetadataSection />
      <AnalyticsSection />
      <VisualizationsSection />
    </div>
  );
};

export default Dashboard;