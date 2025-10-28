import React, { useState, useEffect } from 'react';
import styles from '../../styles/VisualizationsSection.module.css';

const ModelComparison = () => {
  const [models, setModels] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const [dtResponse, knnResponse] = await Promise.all([
          fetch('/dt_model_v1.json'),
          fetch('/knn_model_v2.json')
        ]);
        
        const dtModel = await dtResponse.json();
        const knnModel = await knnResponse.json();
        
        setModels({ dt: dtModel, knn: knnModel });
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };
    
    loadModels();
  }, []);

  if (!models) {
    return (
      <div className={styles.visualizationCardWider}>
        <h3 className={styles.visualizationTitle}>Model Performance Comparison</h3>
        <div className={styles.chartPlaceholder}>
          <div className={styles.chartIcon}>📊</div>
          <div className={styles.chartLabel}>LOADING MODELS</div>
        </div>
      </div>
    );
  }

  const { dt, knn } = models;

  // Calculate confusion matrix percentages
  const calculateCMPercentages = (cm) => {
    const total = cm.tn + cm.fp + cm.fn + cm.tp;
    return {
      tn: ((cm.tn / total) * 100).toFixed(1),
      fp: ((cm.fp / total) * 100).toFixed(1),
      fn: ((cm.fn / total) * 100).toFixed(1),
      tp: ((cm.tp / total) * 100).toFixed(1),
      total
    };
  };

  const dtCM = calculateCMPercentages(dt.metrics.confusion_matrix);
  const knnCM = calculateCMPercentages(knn.metrics.confusion_matrix);

  return (
    <div className={styles.visualizationCardWider}>
      <h3 className={styles.visualizationTitle}>Model Performance Comparison</h3>
      <p className={styles.chartSubtitle}>
        Decision Tree vs K-Nearest Neighbors - Metrics & Confusion Matrix Analysis
      </p>
      {/* Confusion Matrix Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
        {/* Decision Tree Confusion Matrix */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', color: '#2d3748' }}>
            Decision Tree Confusion Matrix
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ 
              backgroundColor: '#c6f6d5', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '2px solid #48bb78'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#22543d', marginBottom: '4px' }}>
                True Negative (TN)
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#22543d' }}>
                {dt.metrics.confusion_matrix.tn.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#22543d' }}>
                {dtCM.tn}%
              </div>
            </div>
            <div style={{ 
              backgroundColor: '#fed7d7', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '2px solid #fc8181'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#742a2a', marginBottom: '4px' }}>
                False Positive (FP)
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#742a2a' }}>
                {dt.metrics.confusion_matrix.fp.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#742a2a' }}>
                {dtCM.fp}%
              </div>
            </div>
            <div style={{ 
              backgroundColor: '#fed7d7', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '2px solid #fc8181'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#742a2a', marginBottom: '4px' }}>
                False Negative (FN)
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#742a2a' }}>
                {dt.metrics.confusion_matrix.fn.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#742a2a' }}>
                {dtCM.fn}%
              </div>
            </div>
            <div style={{ 
              backgroundColor: '#c6f6d5', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '2px solid #48bb78'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#22543d', marginBottom: '4px' }}>
                True Positive (TP)
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#22543d' }}>
                {dt.metrics.confusion_matrix.tp.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#22543d' }}>
                {dtCM.tp}%
              </div>
            </div>
          </div>
          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>
            Recall: {(dt.metrics.recall * 100).toFixed(1)}% | Precision: {(dt.metrics.precision * 100).toFixed(1)}%
          </div>
        </div>

        {/* KNN Confusion Matrix */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', color: '#2d3748' }}>
            K-Nearest Neighbors Confusion Matrix
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ 
              backgroundColor: '#c6f6d5', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '2px solid #48bb78'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#22543d', marginBottom: '4px' }}>
                True Negative (TN)
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#22543d' }}>
                {knn.metrics.confusion_matrix.tn.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#22543d' }}>
                {knnCM.tn}%
              </div>
            </div>
            <div style={{ 
              backgroundColor: '#fed7d7', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '2px solid #fc8181'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#742a2a', marginBottom: '4px' }}>
                False Positive (FP)
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#742a2a' }}>
                {knn.metrics.confusion_matrix.fp.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#742a2a' }}>
                {knnCM.fp}%
              </div>
            </div>
            <div style={{ 
              backgroundColor: '#fed7d7', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '2px solid #fc8181'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#742a2a', marginBottom: '4px' }}>
                False Negative (FN)
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#742a2a' }}>
                {knn.metrics.confusion_matrix.fn.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#742a2a' }}>
                {knnCM.fn}%
              </div>
            </div>
            <div style={{ 
              backgroundColor: '#c6f6d5', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '2px solid #48bb78'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#22543d', marginBottom: '4px' }}>
                True Positive (TP)
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#22543d' }}>
                {knn.metrics.confusion_matrix.tp.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#22543d' }}>
                {knnCM.tp}%
              </div>
            </div>
          </div>
          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#4a5568' }}>
            Recall: {(knn.metrics.recall * 100).toFixed(1)}% | Precision: {(knn.metrics.precision * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;