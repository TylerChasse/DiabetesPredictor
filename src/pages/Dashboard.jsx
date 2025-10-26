import React, { useState, useEffect } from 'react';
import { cacheData } from '../utils/DataAnalysis';
import styles from '../styles/Dashboard.module.css';
import MetadataSection from '../components/MetadataSection';
import AnalyticsSection from '../components/analytics/AnalyticsSection';
import VisualizationsSection from '../components/visualizations/VisualizationsSection';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Dashboard: Loading data...');
        setProgress(30);
        await cacheData();
        setProgress(100);
        console.log('Dashboard: Data loaded successfully');
        setLoading(false);
      } catch (err) {
        console.error('Dashboard: Error loading data:', err);
        setError('Failed to load data from database');
        setLoading(false);
      }
    };

    loadData();
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

  return (
    <div className={styles.container}>
      <MetadataSection />
      <AnalyticsSection />
      <VisualizationsSection />
    </div>
  );
};

export default Dashboard;