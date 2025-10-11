import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import styles from '../styles/Dashboard.module.css';

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
    correlations: []
  });
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const loadAndAnalyzeData = async () => {
      try {
        setProgress(10);
        
        // Fetch CSV
        const response = await fetch('public/data/diabetes_health_indicators_split.csv');
        if (!response.ok) {
          throw new Error('Failed to load dataset. Make sure dataset.csv is in public/data/');
        }
        
        setProgress(30);
        const csvText = await response.text();
        setProgress(50);
        
        console.log('CSV loaded, first 500 characters:', csvText.substring(0, 500));
        
        // Parse CSV with more robust settings
        const results = Papa.parse(csvText, { 
          header: true, 
          dynamicTyping: true,
          skipEmptyLines: true,
          delimitersToGuess: [',', '\t', '|', ';'],
          transformHeader: (header) => header.trim() // Trim whitespace from headers
        });
        
        setProgress(70);
        
        console.log('Parse results:', {
          rows: results.data.length,
          columns: results.meta.fields,
          errors: results.errors,
          firstRow: results.data[0]
        });
        
        // Store debug info
        setDebugInfo({
          totalRows: results.data.length,
          columns: results.meta.fields,
          errors: results.errors,
          firstFewRows: results.data.slice(0, 3)
        });
        
        const data = results.data;
        
        if (data.length === 0) {
          throw new Error('Dataset is empty after parsing');
        }
        
        if (!data[0]) {
          throw new Error('First row is undefined');
        }

        // Get all column names
        const allColumns = results.meta.fields || Object.keys(data[0]);
        console.log('All columns:', allColumns);
        
        // Find the target variable (Diabetes or Diabetes_binary)
        const targetVar = allColumns.find(col => 
          col.toLowerCase().includes('diabetes')
        ) || 'Diabetes';
        
        console.log('Target variable:', targetVar);
        
        // Get feature names (exclude target)
        const featureNames = allColumns.filter(col => col !== targetVar);
        
        // Compute metadata
        const totalRecords = data.length;
        const features = featureNames.length;
        
        setProgress(85);
        
        // Calculate class distribution
        const classDistribution = {
          negative: data.filter(row => row[targetVar] === 0 || row[targetVar] === '0').length,
          positive: data.filter(row => row[targetVar] === 1 || row[targetVar] === '1' || row[targetVar] === 2 || row[targetVar] === '2').length
        };
        
        console.log('Class distribution:', classDistribution);

        // Count missing values (checking for null, undefined, empty string, or NaN)
        let missingCount = 0;
        data.forEach(row => {
          allColumns.forEach(col => {
            const val = row[col];
            if (val === null || val === undefined || val === '' || (typeof val === 'number' && isNaN(val))) {
              missingCount++;
            }
          });
        });

        setProgress(90);
        
        // Calculate correlations for key features
        const keyFeatures = ['HighBP', 'HighChol', 'BMI', 'Age', 'GenHlth'].filter(f => 
          featureNames.includes(f)
        );
        
        const correlations = keyFeatures.map(feature => {
          const corr = calculateCorrelation(data, feature, targetVar);
          return {
            feature: `${feature} → ${targetVar}`,
            value: corr.toFixed(3)
          };
        }).sort((a, b) => Math.abs(parseFloat(b.value)) - Math.abs(parseFloat(a.value)));
        
        setProgress(95);
        
        // Update state
        setMetadata({ 
          totalRecords, 
          features, 
          targetVariable: targetVar,
          classDistribution,
          missingValues: missingCount,
          featureTypes: { numeric: features }
        });
        
        setAnalytics({
          featureNames,
          correlations: correlations.slice(0, 5)
        });
        
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

  // Pearson correlation calculation
  const calculateCorrelation = (data, feature1, feature2) => {
    // Filter out rows with missing values
    const validData = data.filter(row => {
      const val1 = row[feature1];
      const val2 = row[feature2];
      return val1 !== null && val1 !== undefined && val1 !== '' &&
             val2 !== null && val2 !== undefined && val2 !== '' &&
             !isNaN(val1) && !isNaN(val2);
    });
    
    const n = validData.length;
    if (n === 0) return 0;
    
    let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
    
    for (let i = 0; i < n; i++) {
      const val1 = Number(validData[i][feature1]);
      const val2 = Number(validData[i][feature2]);
      
      sum1 += val1;
      sum2 += val2;
      sum1Sq += val1 * val1;
      sum2Sq += val2 * val2;
      pSum += val1 * val2;
    }
    
    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
    
    if (den === 0) return 0;
    return num / den;
  };

  const metadataItems = [
    { label: 'Total Records', value: metadata.totalRecords.toLocaleString() },
    { label: 'Features', value: metadata.features },
    { label: 'Target Variable', value: metadata.targetVariable },
    { label: 'Negative Cases', value: metadata.classDistribution.negative.toLocaleString() },
    { label: 'Positive Cases', value: metadata.classDistribution.positive.toLocaleString() },
    { label: 'Positive Rate', value: metadata.totalRecords > 0 
        ? `${((metadata.classDistribution.positive / metadata.totalRecords) * 100).toFixed(2)}%` 
        : '0%' 
    },
    { label: 'Missing Values', value: metadata.missingValues.toLocaleString() },
    { label: 'Numeric Features', value: metadata.featureTypes.numeric }
  ];

  const visualizations = [
    'BMI Distribution',
    'Age vs Health Status',
    'Risk Factors by Diabetes Status'
  ];

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
          <p className={styles.loadingHint}>
            Processing diabetes health indicators dataset
          </p>
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
          <p className={styles.errorHint}>
            Make sure <code>public/data/dataset.csv</code> exists and is properly formatted.
          </p>
          
          {debugInfo && (
            <details className={styles.errorDetails}>
              <summary>Debug Information (click to expand)</summary>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section>
        <h2 className={styles.sectionTitle}>DATASET METADATA</h2>
        <p className={styles.sectionSubtitle}>
          Diabetes Health Indicators Dataset - Comprehensive Analysis
        </p>
        <div className={styles.metadataGrid}>
          {metadataItems.map((item, idx) => (
            <div key={idx} className={styles.metadataCard}>
              <div className={styles.metadataLabel}>{item.label}</div>
              <div className={styles.metadataValue}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>STATISTICAL ANALYSIS</h2>
        <div className={styles.analysisGrid}>
          <div className={styles.analysisCard}>
            <h3 className={styles.analysisTitle}>Class Distribution Analysis</h3>
            <div className={styles.analysisRatio}>
              {metadata.totalRecords > 0 && metadata.classDistribution.positive > 0
                ? `${(metadata.classDistribution.negative / metadata.classDistribution.positive).toFixed(2)}:1 Ratio`
                : 'Calculating...'
              }
            </div>
            <div className={styles.distributionList}>
              <div className={`${styles.distributionItem} ${styles.distributionNegative}`}>
                <span>No Diabetes (0)</span>
                <strong>
                  {metadata.classDistribution.negative.toLocaleString()} 
                  {metadata.totalRecords > 0 && ` (${((metadata.classDistribution.negative / metadata.totalRecords) * 100).toFixed(2)}%)`}
                </strong>
              </div>
              <div className={`${styles.distributionItem} ${styles.distributionPositive}`}>
                <span>Has Diabetes (1/2)</span>
                <strong>
                  {metadata.classDistribution.positive.toLocaleString()}
                  {metadata.totalRecords > 0 && ` (${((metadata.classDistribution.positive / metadata.totalRecords) * 100).toFixed(2)}%)`}
                </strong>
              </div>
            </div>
          </div>

          <div className={styles.analysisCard}>
            <h3 className={styles.analysisTitle}>Top Feature Correlations</h3>
            <p className={styles.analysisSubtitle}>Pearson correlation with target variable</p>
            <div className={styles.correlationList}>
              {analytics.correlations.length > 0 ? (
                analytics.correlations.map((item, idx) => (
                  <div key={idx} className={styles.correlationItem}>
                    <span>{item.feature}</span>
                    <strong className={Math.abs(parseFloat(item.value)) > 0.3 ? styles.highCorrelation : ''}>
                      {item.value}
                    </strong>
                  </div>
                ))
              ) : (
                <p className={styles.noData}>Calculating correlations...</p>
              )}
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default Dashboard;