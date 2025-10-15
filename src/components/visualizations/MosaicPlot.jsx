import React from 'react';
import styles from '../../styles/Dashboard.module.css';

const MosaicPlot = ({ analytics }) => {
  const { mosaicData } = analytics;

  if (!mosaicData || !mosaicData.ageGroups || mosaicData.ageGroups.length === 0) {
    return (
      <div className={styles.visualizationCardWide}>
        <h3 className={styles.visualizationTitle}>Age & Smoking Status Distribution</h3>
        <div className={styles.chartPlaceholder}>
          <div className={styles.chartIcon}>📊</div>
          <div className={styles.chartLabel}>LOADING DATA</div>
          <div className={styles.chartSubtext}>Calculating mosaic plot data...</div>
        </div>
      </div>
    );
  }

  const { ageGroups, smokingCategories, totalRecords } = mosaicData;

  // Calculate proportions for mosaic layout
  const width = 1100;
  const height = 420;
  const margin = { top: 30, right: 150, bottom: 60, left: 100 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Colors for diabetes status
  const colors = {
    'Non-Diabetic': '#48bb78',
    'Prediabetic': '#f6ad55',
    'Diabetic': '#f56565'
  };

  // Calculate column widths (based on age group proportions)
  let currentX = 0;
  const columns = ageGroups.map(group => {
    const proportion = group.total / totalRecords;
    const colWidth = proportion * plotWidth;
    const colX = currentX;
    currentX += colWidth;
    return { ...group, x: colX, width: colWidth };
  });

  // Create rectangles for each segment
  const rectangles = [];
  columns.forEach(col => {
    let currentY = 0;
    
    smokingCategories.forEach(smokingStatus => {
      const categoryData = col.bySmokingStatus[smokingStatus];
      if (!categoryData) return;

      const categoryHeight = (categoryData.total / col.total) * plotHeight;

      // Stack diabetes outcomes within each smoking category
      let segmentY = currentY;
      ['Non-Diabetic', 'Prediabetic', 'Diabetic'].forEach(outcome => {
        const count = categoryData.byOutcome[outcome] || 0;
        const segmentHeight = (count / categoryData.total) * categoryHeight;
        
        if (segmentHeight > 0) {
          rectangles.push({
            x: col.x,
            y: segmentY,
            width: col.width,
            height: segmentHeight,
            ageGroup: col.label,
            smokingStatus,
            outcome,
            count,
            totalInCategory: categoryData.total,
            totalInColumn: col.total,
            percentage: ((count / col.total) * 100).toFixed(1)
          });
          segmentY += segmentHeight;
        }
      });

      currentY += categoryHeight;
    });
  });

  // Handle mouse events for tooltips
  const [tooltip, setTooltip] = React.useState(null);

  const handleMouseEnter = (rect, event) => {
    const svgRect = event.currentTarget.ownerSVGElement.getBoundingClientRect();
    setTooltip({
      ...rect,
      x: event.clientX - svgRect.left,
      y: event.clientY - svgRect.top
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className={styles.visualizationCardWide}>
      <h3 className={styles.visualizationTitle} style={{ textAlign: 'center' }}>
        Age & Smoking Status Distribution
      </h3>
      <p className={styles.chartSubtitle} style={{ textAlign: 'center' }}>
        Mosaic plot showing diabetes outcomes by age group and smoking status
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <svg width={width} height={height} style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          {/* Main plot group */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Draw rectangles */}
            {rectangles.map((rect, idx) => (
              <g key={idx}>
                <rect
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill={colors[rect.outcome]}
                  stroke="white"
                  strokeWidth={1.5}
                  opacity={0.85}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => handleMouseEnter(rect, e)}
                  onMouseLeave={handleMouseLeave}
                />
              </g>
            ))}

            {/* X-axis labels (age groups) */}
            {columns.map((col, idx) => (
              <text
                key={`age-${idx}`}
                x={col.x + col.width / 2}
                y={plotHeight + 20}
                textAnchor="middle"
                style={{ fontSize: '10px', fill: '#4a5568' }}
              >
                {col.label}
              </text>
            ))}

            {/* X-axis title */}
            <text
              x={plotWidth / 2}
              y={plotHeight + 45}
              textAnchor="middle"
              style={{ fontSize: '12px', fontWeight: '600', fill: '#2d3748' }}
            >
              Age Group
            </text>

            {/* Y-axis title */}
            <text
              x={-plotHeight / 2}
              y={-40}
              textAnchor="middle"
              transform={`rotate(-90, ${-plotHeight / 2}, -40)`}
              style={{ fontSize: '12px', fontWeight: '600', fill: '#2d3748' }}
            >
              Smoking Status
            </text>

            {/* Y-axis smoking status labels (vertical) */}
            {(() => {
              let y = 0;
              return columns[0] ? smokingCategories.map((status, idx) => {
                const categoryData = columns[0].bySmokingStatus[status];
                if (!categoryData) return null;
                const height = (categoryData.total / columns[0].total) * plotHeight;
                const labelY = y + height / 2;
                y += height;
                return (
                  <text
                    key={`smoking-${idx}`}
                    x={-15}
                    y={labelY}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(-90, ${-15}, ${labelY})`}
                    style={{ fontSize: '11px', fill: '#4a5568' }}
                  >
                    {status}
                  </text>
                );
              }) : null;
            })()}
          </g>

          {/* Legend */}
          <g transform={`translate(${width - margin.right + 20}, ${margin.top})`}>
            <text
              x={0}
              y={0}
              style={{ fontSize: '11px', fontWeight: '600', fill: '#2d3748' }}
            >
              Diabetes Status
            </text>
            {Object.entries(colors).map(([status, color], idx) => (
              <g key={status} transform={`translate(0, ${18 + idx * 24})`}>
                <rect
                  x={0}
                  y={0}
                  width={18}
                  height={14}
                  fill={color}
                  stroke="white"
                  strokeWidth={1}
                  opacity={0.85}
                />
                <text
                  x={24}
                  y={11}
                  style={{ fontSize: '10px', fill: '#4a5568' }}
                >
                  {status}
                </text>
              </g>
            ))}
          </g>

          {/* Tooltip */}
          {tooltip && (
            <g transform={`translate(${tooltip.x + 10}, ${tooltip.y - 10})`}>
              <rect
                x={0}
                y={0}
                width={180}
                height={90}
                fill="white"
                stroke="#e2e8f0"
                strokeWidth={1}
                rx={4}
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
              />
              <text x={10} y={18} style={{ fontSize: '11px', fontWeight: '600', fill: '#2d3748' }}>
                {tooltip.ageGroup}
              </text>
              <text x={10} y={34} style={{ fontSize: '10px', fill: '#4a5568' }}>
                {tooltip.smokingStatus}
              </text>
              <text x={10} y={50} style={{ fontSize: '10px', fill: '#4a5568' }}>
                Status: {tooltip.outcome}
              </text>
              <text x={10} y={66} style={{ fontSize: '10px', fill: '#4a5568' }}>
                Count: {tooltip.count.toLocaleString()}
              </text>
              <text x={10} y={82} style={{ fontSize: '10px', fontWeight: '600', fill: colors[tooltip.outcome] }}>
                {tooltip.percentage}% of age group
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default MosaicPlot;