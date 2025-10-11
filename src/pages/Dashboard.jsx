import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import styles from '../styles/Dashboard.module.css';
import MetadataSection from '../components/MetadataSection';
import AnalyticsSection from '../components/analytics/AnalyticsSection';
import VisualizationsSection from '../components/visualizations/VisualizationsSection';

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
        
        const response = await fetch('/data/diabetes_health_indicators_split.csv');
        if (!response.ok) {
          throw new Error('Failed to load dataset.');
        }
        
        setProgress(30);
        const csvText = await response.text();
        setProgress(50);
        
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

        const allColumns = results.meta.fields || Object.keys(data[0]);
        const targetVar = allColumns.find(col => 
          col.toLowerCase().includes('diabetes')
        ) || 'Diabetic';
        
        const featureNames = allColumns.filter(col => col !== targetVar);
        const totalRecords = data.length;
        const features = featureNames.length;
        
        setProgress(85);
        
        const classDistribution = {
          negative: data.filter(row => row[targetVar] === 0 || row[targetVar] === '0').length,
          positive: data.filter(row => row[targetVar] === 1 || row[targetVar] === '1' || row[targetVar] === 2 || row[targetVar] === '2').length
        };

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
        
        // Calculate correlations
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

        // Calculate age-binned positive rates
        const calculateAgeBinnedRisk = () => {
          // Age mapping (based on CDC BRFSS codebook)
          const ageLabels = {
            1: '18-24',
            2: '25-29',
            3: '30-34',
            4: '35-39',
            5: '40-44',
            6: '45-49',
            7: '50-54',
            8: '55-59',
            9: '60-64',
            10: '65-69',
            11: '70-74',
            12: '75-79',
            13: '80+'
          };

          const ageBins = {};
          
          // Initialize bins
          for (let i = 1; i <= 13; i++) {
            ageBins[i] = {
              ageLabel: ageLabels[i],
              total: 0,
              positive: 0,
              negative: 0
            };
          }

          // Count data points in each bin
          data.forEach(row => {
            const age = row.Age;
            const outcome = row[targetVar];
            
            if (age >= 1 && age <= 13 && (outcome === 0 || outcome === 1 || outcome === 2)) {
              ageBins[age].total++;
              if (outcome === 1 || outcome === 2) {
                ageBins[age].positive++;
              } else {
                ageBins[age].negative++;
              }
            }
          });

          // Calculate positive rates
          const ageBinnedData = Object.values(ageBins)
            .filter(bin => bin.total > 0) // Only include bins with data
            .map(bin => ({
              ...bin,
              positiveRate: (bin.positive / bin.total) * 100
            }));

          return ageBinnedData;
        };

        const ageBinnedData = calculateAgeBinnedRisk();
        
        // Calculate imbalance metrics
        const imbalanceRatio = classDistribution.positive > 0 
          ? (classDistribution.negative / classDistribution.positive).toFixed(2)
          : '0';

        setProgress(95);
        
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
          correlations: correlations.slice(0, 5),
          imbalance: {
            ratio: imbalanceRatio,
            negativeCount: classDistribution.negative,
            positiveCount: classDistribution.positive
          },
          ageBinnedData
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

  const calculateCorrelation = (data, feature1, feature2) => {
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