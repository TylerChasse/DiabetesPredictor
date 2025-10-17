import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer
} from 'recharts';
import styles from '../../styles/VisualizationsSection.module.css';
import { calculatePhysActivityImpact } from '../../utils/DataAnalysis';

const PhysActivityChart = () => {
  const physActivityData = useMemo(() => calculatePhysActivityImpact(), []);

  if (!physActivityData) {
    return (
      <div className={styles.visualizationCard}>
        <h3 className={styles.visualizationTitle}>Physical Activity Impact on Diabetes</h3>
        <div className={styles.chartPlaceholder}>
          <div className={styles.chartIcon}>📊</div>
          <div className={styles.chartLabel}>LOADING DATA</div>
          <div className={styles.chartSubtext}>Calculating physical activity statistics...</div>
        </div>
      </div>
    );
  }

  const { active, inactive } = physActivityData;

  // Prepare data for comparison bar chart
  const comparisonData = [
    {
      activity: 'Active',
      'Diabetic/Prediabetic': active.diabetesRate,
      'Non-Diabetic': ((active.total - active.diabetic) / active.total) * 100,
      totalPeople: active.total,
      diabeticCount: active.diabetic
    },
    {
      activity: 'Inactive',
      'Diabetic/Prediabetic': inactive.diabetesRate,
      'Non-Diabetic': ((inactive.total - inactive.diabetic) / inactive.total) * 100,
      totalPeople: inactive.total,
      diabeticCount: inactive.diabetic
    }
  ];

  // Custom tooltip for comparison chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>{data.activity}</p>
          <p style={{ color: '#f56565', margin: '4px 0' }}>
            Diabetic/Prediabetic: {data['Diabetic/Prediabetic'].toFixed(2)}%
          </p>
          <p style={{ color: '#48bb78', margin: '4px 0' }}>
            Non-Diabetic: {data['Non-Diabetic'].toFixed(2)}%
          </p>
          <p style={{ fontWeight: '600', marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
            Total: {data.totalPeople.toLocaleString()} people
          </p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            {data.diabeticCount.toLocaleString()} with diabetes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.visualizationCard}>
      <h3 className={styles.visualizationTitle}>Physical Activity Impact on Diabetes</h3>
      <p className={styles.chartSubtitle}>Comparison of diabetes rates between active and inactive individuals</p>
      
      {/* Percentage Comparison Chart */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '16px' }}>
          Diabetes Rate Comparison
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={comparisonData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="activity" 
              tick={{ fontSize: 13, fontWeight: '500' }}
            />
            <YAxis 
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="square"
            />
            <Bar dataKey="Diabetic/Prediabetic" fill="#f56565" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Non-Diabetic" fill="#48bb78" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PhysActivityChart;