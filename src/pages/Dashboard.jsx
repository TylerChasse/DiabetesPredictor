import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import styles from '../styles/Dashboard.module.css';
import MetadataSection from '../components/MetadataSection';
import AnalyticsSection from '../components/analytics/AnalyticsSection';
import VisualizationsSection from '../components/visualizations/VisualizationsSection';
import { analyzeData } from '../utils/DataAnalysis';

const Dashboard = () => {
  const [metadata, setMetadata] = useState({
    totalRecords: 0,
    features: 0,
    targetVariable: 'Diabetes',
    classDistribution: { negative: 0, positive: 0 },
    missingValues: 0,
    featureTypes: { numeric: 22 }
  });
  
  const [analytics, setAnalytics] = useState({
    featureNames: [],
    correlations: [],
    imbalance: null
  });
  
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAndAnalyzeData = async () => {
      try {
        setProgress(10);
        
        // Fetch CSV file
        const response = await fetch('/diabetes_health.csv');
        if (!response.ok) {
          throw new Error('Failed to load dataset.');
        }
        
        setProgress(30);
        const csvText = await response.text();
        setProgress(50);
        
        // Parse CSV
        const results = Papa.parse(csvText, { 
          header: true, 
          dynamicTyping: true,
          skipEmptyLines: true,
          delimitersToGuess: [',', '\t', '|', ';'],
          transformHeader: (header) => header.trim()
        });
        
        setProgress(70);
        
        const data = results.data;
        
        if (data.length === 0) {
          throw new Error('Dataset is empty after parsing');
        }

        // Extract columns and identify target variable
        const allColumns = results.meta.fields || Object.keys(data[0]);
        const targetVar = allColumns.find(col => 
          col.toLowerCase().includes('diabetes')
        ) || 'Diabetic';
        
        const featureNames = allColumns.filter(col => col !== targetVar);
        
        setProgress(85);
        
        // Run all analyses using utility function
        const { metadata: calculatedMetadata, analytics: calculatedAnalytics } = analyzeData(
          data,
          allColumns,
          targetVar,
          featureNames
        );
        
        setProgress(95);
        
        // Update state with results
        setMetadata(calculatedMetadata);
        setAnalytics(calculatedAnalytics);
        
        setProgress(100);
        setTimeout(() => setLoading(false), 500);
        
      } catch (err) {
        console.error('Error loading dataset:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadAndAnalyzeData();
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

  if (error) {
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
      <MetadataSection metadata={metadata} />
      <AnalyticsSection metadata={metadata} analytics={analytics} />
      <VisualizationsSection analytics={analytics} />
    </div>
  );
};

export default Dashboard;