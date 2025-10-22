/**
 * Data Analysis Utilities
 * 
 * Contains all calculation functions for analyzing diabetes health indicators dataset
 */
import Papa from 'papaparse';

let csvPath = 'diabetes_health.csv'
let targetVar = 'Diabetes';
let cachedData = null;
let cachedMetadata = null;
let ageLabels = {
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

/**
 * Load and cache the CSV data
 */
export const loadData = async () => {
  if (cachedData) return cachedData; // Return cached if already loaded
  
  const response = await fetch(csvPath);
  if (!response.ok) {
    throw new Error('Failed to load dataset.');
  }
  const csvText = await response.text();
  
  // Parse CSV
  const results = Papa.parse(csvText, { 
    header: true, 
    dynamicTyping: true,
    skipEmptyLines: true,
    delimitersToGuess: [',', '\t', '|', ';'],
    transformHeader: (header) => header.trim()
  });

  cachedData = results.data;

  if (cachedData.length === 0) {
    throw new Error('Dataset is empty after parsing');
  }

  // Extract columns and identify target variable
  const allColumns = results.meta.fields || Object.keys(cachedData[0]);
  
  const featureNames = allColumns.filter(col => col !== targetVar);
  const classDistribution = calculateClassDistribution();
  const missingCount = countMissingValues(allColumns);

  // Calculate basic metadata once
  cachedMetadata = {
    totalRecords: cachedData.length,
    features: featureNames.length,
    targetVariable: targetVar,  
    classDistribution,
    missingValues: missingCount,
    featureTypes: { numeric: featureNames.length }
  };
  
  return cachedData;
};

export const getData = () => cachedData;
export const getMetadata = () => cachedMetadata;

/**
 * Calculate Pearson correlation coefficient between two features
 */
export const calculateCorrelation = (feature1, feature2) => {
  if (!cachedData) throw new Error('Data not loaded');

  const validData = cachedData.filter(row => {
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
export const calculateAgeBinnedRisk = () => {
  if (!cachedData) throw new Error('Data not loaded');

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
  cachedData.forEach(row => {
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
export const calculatePhysActivityImpact = () => {
  if (!cachedData) throw new Error('Data not loaded');

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

  cachedData.forEach(row => {
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
export const calculateClassDistribution = () => {
  if (!cachedData) throw new Error('Data not loaded');

  return {
    negative: cachedData.filter(row => row[targetVar] === 0 || row[targetVar] === '0').length,
    positive: cachedData.filter(row => row[targetVar] === 1 || row[targetVar] === '1' || row[targetVar] === 2 || row[targetVar] === '2').length
  };
};

/**
 * Count missing values in dataset
 */
export const countMissingValues = (columns) => {
  if (!cachedData) throw new Error('Data not loaded');

  let missingCount = 0;
  cachedData.forEach(row => {
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
export const calculateKeyCorrelations = (featureNames) => {
  const keyFeatures = ['HighBP', 'HighChol', 'BMI', 'Age', 'GenHlth'].filter(f => 
    featureNames.includes(f)
  );
  
  const correlations = keyFeatures.map(feature => {
    const corr = calculateCorrelation(feature, targetVar);
    return {
      feature: `${feature} → ${targetVar}`,
      value: corr.toFixed(3)
    };
  }).sort((a, b) => Math.abs(parseFloat(b.value)) - Math.abs(parseFloat(a.value)));
  
  return correlations;
};

/**
 * Calculate mosaic plot data for age groups and smoking status with diabetes outcomes
 */
export const calculateAgeSmokingData = () => {
  if (!cachedData) throw new Error('Data not loaded');

  const smokingCategories = ['Non-Smoker', 'Smoker'];

  // Initialize data structure
  const mosaicStructure = {};
  for (let i = 1; i <= 13; i++) {
    const ageLabel = ageLabels[i];
    mosaicStructure[ageLabel] = {
      label: ageLabel,
      total: 0,
      bySmokingStatus: {
        'Non-Smoker': {
          total: 0,
          byOutcome: { 'Non-Diabetic': 0, 'Diabetic/Prediabetic': 0 }
        },
        'Smoker': {
          total: 0,
          byOutcome: { 'Non-Diabetic': 0, 'Diabetic/Prediabetic': 0 }
        }
      }
    };
  }

  let totalRecords = 0;

  // Populate data
  cachedData.forEach(row => {
    const age = row.Age;
    const smoker = row.Smoker;
    const outcome = row[targetVar];

    if (!age || age < 1 || age > 13) return;
    if (smoker !== 0 && smoker !== 1) return;
    if (outcome !== 0 && outcome !== 1 && outcome !== 2) return;

    const ageLabel = ageLabels[age];
    const smokingStatus = smoker === 1 ? 'Smoker' : 'Non-Smoker';
    
    // Combine prediabetic and diabetic into one category
    let outcomeLabel;
    if (outcome === 0) {
      outcomeLabel = 'Non-Diabetic';
    } else {
      outcomeLabel = 'Diabetic/Prediabetic'; // Combine outcome 1 and 2
    }

    mosaicStructure[ageLabel].total++;
    mosaicStructure[ageLabel].bySmokingStatus[smokingStatus].total++;
    mosaicStructure[ageLabel].bySmokingStatus[smokingStatus].byOutcome[outcomeLabel]++;
    totalRecords++;
  });

  // Convert to array and filter empty groups
  const ageGroups = Object.values(mosaicStructure)
    .filter(group => group.total > 0);

  return {
    ageGroups,
    smokingCategories,
    totalRecords
  };
};

export const calculateClassImbalanceData = () => {
  if (!cachedData) throw new Error('Data not loaded');

  const classDistribution = calculateClassDistribution(targetVar);
  const imbalanceRatio = classDistribution.positive > 0 
    ? (classDistribution.negative / classDistribution.positive).toFixed(2)
    : '0';
  return {
    ratio: imbalanceRatio,
    negativeCount: classDistribution.negative,
    positiveCount: classDistribution.positive
  };
}

/**
 * Calculate risk factor prevalence among diabetic vs non-diabetic populations
 */
export const calculateDiabeticRiskProfile = () => {
  const data = getData();
  const targetVar = 'Diabetes';
  
  const factors = {
    'High BP': 'HighBP',
    'High Chol': 'HighChol',
    'Smoker': 'Smoker',
    'Obese': 'BMI',
    'Inactive': 'PhysActivity',
    'Heavy Drinker': 'HvyAlcoholConsump',
    'Poor Health': 'GenHlth',
    'Heart Disease': 'HeartDiseaseorAttack',
    'Stroke': 'Stroke',
    'Difficulty Walking': 'DiffWalk'
  };
  
  const diabeticData = data.filter(row => row[targetVar] === 1 || row[targetVar] === 2);
  const nonDiabeticData = data.filter(row => row[targetVar] === 0);
  
  const profile = [];
  
  Object.entries(factors).forEach(([label, field]) => {
    let diabeticCount, nonDiabeticCount;
    
    if (field === 'BMI') {
      // Count people with BMI > 30 (obese)
      diabeticCount = diabeticData.filter(row => row.BMI > 30).length;
      nonDiabeticCount = nonDiabeticData.filter(row => row.BMI > 30).length;
    } else if (field === 'PhysActivity') {
      // Count inactive people (0 = inactive)
      diabeticCount = diabeticData.filter(row => row[field] === 0).length;
      nonDiabeticCount = nonDiabeticData.filter(row => row[field] === 0).length;
    } else if (field === 'GenHlth') {
      // Count people with poor/fair health (4 or 5)
      diabeticCount = diabeticData.filter(row => row[field] >= 4).length;
      nonDiabeticCount = nonDiabeticData.filter(row => row[field] >= 4).length;
    } else {
      // Count people with the risk factor (1 = yes)
      diabeticCount = diabeticData.filter(row => row[field] === 1).length;
      nonDiabeticCount = nonDiabeticData.filter(row => row[field] === 1).length;
    }
    
    const diabeticPercent = parseFloat(((diabeticCount / diabeticData.length) * 100).toFixed(1));
    const nonDiabeticPercent = parseFloat(((nonDiabeticCount / nonDiabeticData.length) * 100).toFixed(1));
    
    profile.push({
      factor: label,
      Diabetic: diabeticPercent,
      NonDiabetic: nonDiabeticPercent,
      difference: (diabeticPercent - nonDiabeticPercent).toFixed(1),
      relativeRisk: (diabeticPercent / nonDiabeticPercent).toFixed(2)
    });
  });
  
  // Sort by difference (most influential first)
  return profile.sort((a, b) => Math.abs(parseFloat(b.difference)) - Math.abs(parseFloat(a.difference)));
};

/**
 * Calculate average age category
 */
export const getAverageAge = () => {
  const data = getData();
  
  const ageLabels = {
    1: '18-24', 2: '25-29', 3: '30-34', 4: '35-39',
    5: '40-44', 6: '45-49', 7: '50-54', 8: '55-59',
    9: '60-64', 10: '65-69', 11: '70-74', 12: '75-79', 13: '80+'
  };
  
  const totalAge = data.reduce((sum, row) => sum + (row.Age || 0), 0);
  const avgAgeBin = Math.round(totalAge / data.length);
  
  return {
    avgBin: avgAgeBin,
    ageRange: ageLabels[avgAgeBin] || 'Unknown'
  };
};

/**
 * Calculate average BMI
 */
export const getAverageBMI = () => {
  const data = getData();
  
  const totalBMI = data.reduce((sum, row) => sum + (row.BMI || 0), 0);
  const avgBMI = (totalBMI / data.length).toFixed(1);
  
  return parseFloat(avgBMI);
};

/**
 * Calculate average income category
 */
export const getAverageIncome = () => {
  const data = getData();
  
  const incomeLabels = {
    1: '<$10k',
    2: '$10k-$15k',
    3: '$15k-$20k',
    4: '$20k-$25k',
    5: '$25k-$35k',
    6: '$35k-$50k',
    7: '$50k-$75k',
    8: '>$75k'
  };
  
  const totalIncome = data.reduce((sum, row) => sum + (row.Income || 0), 0);
  const avgIncomeBin = Math.round(totalIncome / data.length);
  
  return {
    avgBin: avgIncomeBin,
    incomeRange: incomeLabels[avgIncomeBin] || 'Unknown'
  };
};