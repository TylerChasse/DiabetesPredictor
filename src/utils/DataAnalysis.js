/**
 * Data Analysis Utilities
 * 
 * Contains all calculation functions for analyzing diabetes health indicators dataset
 */

/**
 * Calculate Pearson correlation coefficient between two features
 */
export const calculateCorrelation = (data, feature1, feature2) => {
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

/**
 * Calculate age-binned diabetes risk across age categories
 */
export const calculateAgeBinnedRisk = (data, targetVar) => {
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

/**
 * Calculate physical activity impact on diabetes risk
 * PhysActivity: 0 = inactive, 1 = active
 */
export const calculatePhysActivityImpact = (data, targetVar) => {
  const activeData = {
    total: 0,
    diabetic: 0,
    nonDiabetic: 0
  };
  
  const inactiveData = {
    total: 0,
    diabetic: 0,
    nonDiabetic: 0
  };

  data.forEach(row => {
    const physActivity = row.PhysActivity;
    const outcome = row[targetVar];
    
    // Ensure valid data
    if ((physActivity === 0 || physActivity === 1) && 
        (outcome === 0 || outcome === 1 || outcome === 2)) {
      
      if (physActivity === 1) {
        // Physically active
        activeData.total++;
        if (outcome === 1 || outcome === 2) {
          activeData.diabetic++;
        } else {
          activeData.nonDiabetic++;
        }
      } else {
        // Physically inactive
        inactiveData.total++;
        if (outcome === 1 || outcome === 2) {
          inactiveData.diabetic++;
        } else {
          inactiveData.nonDiabetic++;
        }
      }
    }
  });

  // Calculate rates
  const activeRate = activeData.total > 0 
    ? (activeData.diabetic / activeData.total) * 100 
    : 0;
  const inactiveRate = inactiveData.total > 0 
    ? (inactiveData.diabetic / inactiveData.total) * 100 
    : 0;

  // Calculate relative risk and risk reduction
  const relativeRisk = activeRate > 0 ? inactiveRate / activeRate : 0;
  const riskReduction = inactiveRate - activeRate;

  return {
    active: {
      total: activeData.total,
      diabetic: activeData.diabetic,
      nonDiabetic: activeData.nonDiabetic,
      diabetesRate: activeRate
    },
    inactive: {
      total: inactiveData.total,
      diabetic: inactiveData.diabetic,
      nonDiabetic: inactiveData.nonDiabetic,
      diabetesRate: inactiveRate
    },
    relativeRisk,
    riskReduction
  };
};

/**
 * Calculate class distribution for target variable
 */
export const calculateClassDistribution = (data, targetVar) => {
  return {
    negative: data.filter(row => row[targetVar] === 0 || row[targetVar] === '0').length,
    positive: data.filter(row => row[targetVar] === 1 || row[targetVar] === '1' || row[targetVar] === 2 || row[targetVar] === '2').length
  };
};

/**
 * Count missing values in dataset
 */
export const countMissingValues = (data, columns) => {
  let missingCount = 0;
  data.forEach(row => {
    columns.forEach(col => {
      const val = row[col];
      if (val === null || val === undefined || val === '' || (typeof val === 'number' && isNaN(val))) {
        missingCount++;
      }
    });
  });
  return missingCount;
};

/**
 * Calculate correlations for key features with target variable
 */
export const calculateKeyCorrelations = (data, featureNames, targetVar) => {
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
  
  return correlations;
};

/**
 * Main analysis orchestrator - runs all calculations
 */
export const analyzeData = (data, allColumns, targetVar, featureNames) => {
  const totalRecords = data.length;
  const features = featureNames.length;
  
  // Calculate all metrics
  const classDistribution = calculateClassDistribution(data, targetVar);
  const missingCount = countMissingValues(data, allColumns);
  const correlations = calculateKeyCorrelations(data, featureNames, targetVar);
  const ageBinnedData = calculateAgeBinnedRisk(data, targetVar);
  const physActivityData = calculatePhysActivityImpact(data, targetVar);
  
  // Calculate imbalance metrics
  const imbalanceRatio = classDistribution.positive > 0 
    ? (classDistribution.negative / classDistribution.positive).toFixed(2)
    : '0';

  // Return metadata and analytics
  return {
    metadata: {
      totalRecords,
      features,
      targetVariable: targetVar,
      classDistribution,
      missingValues: missingCount,
      featureTypes: { numeric: features }
    },
    analytics: {
      featureNames,
      correlations: correlations.slice(0, 5),
      imbalance: {
        ratio: imbalanceRatio,
        negativeCount: classDistribution.negative,
        positiveCount: classDistribution.positive
      },
      ageBinnedData,
      physActivityData
    }
  };
};