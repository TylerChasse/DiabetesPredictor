import React, { useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ZAxis
} from 'recharts';
import styles from '../../styles/VisualizationsSection.module.css';
import { calculateIncomeBmiHexbinData } from '../../utils/DataAnalysis';


const IncomeBmiHexbin = () => {
  const scatterData = useMemo(() => {
    try {
      return calculateIncomeBmiHexbinData();
    } catch (error) {
      console.error('Error calculating hexbin data:', error);
      return null;
    }
  }, []);

  if (!scatterData) {
    return (
      <div className={styles.visualizationCard}>
        <h3 className={styles.visualizationTitle}>IncomeBmiHexbin</h3>
        <div className={styles.chartPlaceholder}>
          <div className={styles.chartIcon}>📊</div>
          <div className={styles.chartLabel}>LOADING DATA</div>
          <div className={styles.chartSubtext}>Aggregating data into bins...</div>
        </div>
      </div>
    );
  }

  const { bins, maxCount, minDiabeticPercent, maxDiabeticPercent, stats, incomeLabels } = scatterData;

  // Color interpolation function: green (low risk) to yellow to red (high risk)
  // Transition at 50%
  const getColorFromPercentage = (percent) => {
    // Green (#48bb78) at 0% to Red (#f56565) at 100%
    // Yellow transition at 50%
    const normalized = percent / 100;

    if (normalized <= 0.5) {
      // Green to Yellow (0% to 50%)
      const factor = normalized * 2;
      const r = Math.round(72 + (234 - 72) * factor);   // 72 to 234
      const g = Math.round(187 + (179 - 187) * factor); // 187 to 179
      const b = Math.round(120 + (26 - 120) * factor);  // 120 to 26
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Yellow to Red (50% to 100%)
      const factor = (normalized - 0.5) * 2;
      const r = Math.round(234 + (245 - 234) * factor); // 234 to 245
      const g = Math.round(179 + (101 - 179) * factor); // 179 to 101
      const b = Math.round(26 + (101 - 26) * factor);   // 26 to 101
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  // Custom X-Axis Tick Component for Income Labels
  const CustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={8}
          textAnchor="end"
          fill="#4a5568"
          fontSize={11}
          fontWeight={500}
          transform="rotate(-45)"
        >
          {incomeLabels[payload.value] || payload.value}
        </text>
      </g>
    );
  };

  // Enhanced tooltip showing bin information with gradient color
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const color = getColorFromPercentage(data.diabeticPercentRaw);

      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          padding: '14px 16px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '13px',
          minWidth: '240px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            gap: '8px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: color,
              border: '2px solid white',
              boxShadow: '0 0 0 1px #e2e8f0'
            }} />
            <p style={{ fontWeight: '600', color: '#2d3748', fontSize: '14px', margin: 0 }}>
              {data.diabeticPercent}% Diabetic/Prediabetic
            </p>
          </div>
          <p style={{ margin: '4px 0', color: '#4a5568' }}>
            <strong>BMI Range:</strong> {(data.bmi - 1.25).toFixed(1)} - {(data.bmi + 1.25).toFixed(1)}
          </p>
          <p style={{ margin: '4px 0', color: '#4a5568' }}>
            <strong>Income:</strong> {data.incomeLabel}
          </p>
          <div style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <p style={{ margin: '0 0 6px 0', color: '#2d3748', fontWeight: '600', fontSize: '12px' }}>
              Population Breakdown:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#48bb78', fontSize: '12px' }}>● No Diabetes:</span>
                <span style={{ fontWeight: '600', fontSize: '12px' }}>
                  {data.noDiabetesCount.toLocaleString()} ({data.noDiabetesPercent}%)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#f56565', fontSize: '12px' }}>● Diabetic/Prediabetic:</span>
                <span style={{ fontWeight: '600', fontSize: '12px' }}>
                  {data.diabeticCount.toLocaleString()} ({data.diabeticPercent}%)
                </span>
              </div>
              <div style={{
                marginTop: '6px',
                paddingTop: '6px',
                borderTop: '1px solid #f7fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#4a5568', fontSize: '12px', fontWeight: '600' }}>Total:</span>
                <span style={{ fontWeight: '700', fontSize: '12px', color: '#2d3748' }}>
                  {data.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom shape renderer for scatter points with gradient colors
  const CustomShape = (props) => {
    const { cx, cy, payload } = props;
    const color = getColorFromPercentage(payload.diabeticPercentRaw);

    // Calculate radius based on population (z value)
    const minRadius = 3;
    const maxRadius = 25;
    const radius = minRadius + (maxRadius - minRadius) * (payload.z / maxCount);

    return (
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={color}
        fillOpacity={0.7}
        stroke="white"
        strokeWidth={1}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  // Color legend component
  const ColorLegend = () => {
    const gradientStops = [];
    for (let i = 0; i <= 100; i += 10) {
      gradientStops.push(
        <stop key={i} offset={`${i}%`} stopColor={getColorFromPercentage(i)} />
      );
    }

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f7fafc',
        borderRadius: '8px'
      }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#4a5568' }}>
          Non-Diabetic
        </span>
        <svg width="200" height="20">
          <defs>
            <linearGradient id="diabetesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {gradientStops}
            </linearGradient>
          </defs>
          <rect width="200" height="20" fill="url(#diabetesGradient)" rx="4" />
        </svg>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#4a5568' }}>
          Diabetic/Prediabetic
        </span>
      </div>
    );
  };

  return (
    <div className={styles.visualizationCard}>
      <h3 className={styles.visualizationTitle}>Impact of BMI and Income on Diabetes</h3>
      <p className={styles.chartSubtitle}>
        A hexbin aggregation of BMI and Income data. Each data point is a bin separated by 2.5 on the BMI scale, with each bin becoming larger the more people are in the bin.
      </p>

      {/* Color Legend */}
      <ColorLegend />

      {/* Main Scatter Chart */}
      <div style={{ marginBottom: '30px' }}>
        <ResponsiveContainer width="100%" height={600}>
          <ScatterChart
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="income"
              name="Income"
              domain={[0.5, 8.5]}
              ticks={[1, 2, 3, 4, 5, 6, 7, 8]}
              tick={<CustomXAxisTick />}
              label={{
                value: 'Income Category',
                position: 'bottom',
                offset: 60,
                style: { fontSize: '13px', fontWeight: '600', fill: '#2d3748' }
              }}
            />
            <YAxis
              type="number"
              dataKey="bmi"
              name="BMI"
              label={{
                value: 'Body Mass Index (BMI)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: '13px', fontWeight: '600', fill: '#2d3748' }
              }}
              tick={{ fontSize: 12 }}
            />
            <ZAxis
              type="number"
              dataKey="z"
              range={[50, 1000]}
              name="Population"
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              name="Diabetes Risk"
              data={bins}
              shape={<CustomShape />}
              isAnimationActive={false}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default IncomeBmiHexbin;
