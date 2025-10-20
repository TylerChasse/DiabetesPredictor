import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import styles from '../../styles/VisualizationsSection.module.css';
import { calculateAgeBinnedRisk } from '../../utils/DataAnalysis';

const AgeBinnedChart = () => {
  const ageBinnedData = useMemo(() => calculateAgeBinnedRisk(), []);

  if (!ageBinnedData || ageBinnedData.length === 0) {
    return (
      <div className={styles.visualizationCardWide}>
        <h3 className={styles.visualizationTitle}>Diabetes Risk by Age Group</h3>
        <div className={styles.chartPlaceholder}>
          <div className={styles.chartIcon}>📊</div>
          <div className={styles.chartLabel}>LOADING DATA</div>
          <div className={styles.chartSubtext}>Calculating age-binned statistics...</div>
        </div>
      </div>
    );
  }

  // Prepare data for stacked bar chart
  const chartData = ageBinnedData.map(bin => ({
    ageGroup: bin.ageLabel,
    'Non-Diabetic': bin.negative,
    'Diabetic/Prediabetic': bin.positive,
    positiveRate: bin.positiveRate
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = data['Non-Diabetic'] + data['Diabetic/Prediabetic'];
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>{data.ageGroup}</p>
          <p style={{ color: '#48bb78', margin: '4px 0' }}>
            Non-Diabetic: {data['Non-Diabetic'].toLocaleString()} ({((data['Non-Diabetic'] / total) * 100).toFixed(1)}%)
          </p>
          <p style={{ color: '#f56565', margin: '4px 0' }}>
            Diabetic: {data['Diabetic/Prediabetic'].toLocaleString()} ({data.positiveRate.toFixed(1)}%)
          </p>
          <p style={{ fontWeight: '600', marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
            Total: {total.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.visualizationCardWide}>
      <h3 className={styles.visualizationTitle}>Diabetes Risk by Age Group</h3>
      <p className={styles.chartSubtitle}>Stacked bar chart showing diabetes prevalence across age categories</p>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="ageGroup" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Number of People', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          <Bar dataKey="Non-Diabetic" stackId="a" fill="#48bb78" />
          <Bar dataKey="Diabetic/Prediabetic" stackId="a" fill="#f56565" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgeBinnedChart;