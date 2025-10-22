import React, { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateDiabeticRiskProfile } from '../../utils/DataAnalysis';
import styles from '../../styles/VisualizationsSection.module.css';

const DiabeticRiskProfileRadar = () => {
  const profileData = useMemo(() => calculateDiabeticRiskProfile(), []);

  return (
    <div className={styles.visualizationCard}>
      <h3 className={styles.visualizationTitle}>Diabetes Risk Factor Profile</h3>
      <p className={styles.chartSubtitle}>Prevalence comparison: Diabetic vs Non-Diabetic</p>
      
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={profileData} >
          <PolarGrid stroke="#cbd5e0" />
          <PolarAngleAxis 
            dataKey="factor" 
            tick={{ fill: '#4a5568', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: '#718096', fontSize: 9 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Radar 
            name="Diabetic/Prediabetic" 
            dataKey="Diabetic" 
            stroke="#f56565" 
            fill="#f56565" 
            fillOpacity={0.6}
            strokeWidth={2}
          />
          <Radar 
            name="Non-Diabetic" 
            dataKey="NonDiabetic" 
            stroke="#48bb78" 
            fill="#48bb78" 
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
          />
          <Tooltip 
            formatter={(value, name) => [`${value}%`, name]}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '8px 12px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiabeticRiskProfileRadar;