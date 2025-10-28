/**
 * Data Analysis Utilities
 *
 * Contains all calculation functions for analyzing diabetes health indicators dataset
 */
import { cache } from 'react';
import { supabase } from './supabaseClient';

let targetVar = 'Diabetes';
let cachedData = null;
let isLoading = false;
let loadPromise = null;

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
 * Load and cache data from Supabase
 * This should be called once when the Dashboard mounts
 */
export const cacheData = async () => {
  // If already loading, return the existing promise
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Start loading
  isLoading = true;

  loadPromise = (async () => {
    try {
      console.log('Fetching data from Supabase...');
      const { data, error } = await supabase
        .from('diabetes_health')
        .select('*');

      if (error) {
        console.error('Error fetching data from Supabase:', error);
        throw error;
      }

      console.log(`Fetched ${data.length} records from Supabase`);

      // Transform column names to match expected format (camelCase)
      cachedData = data.map(row => ({
        Diabetes: row.Diabetes,
        HighBP: row.HighBP,
        HighChol: row.HighChol,
        CholCheck: row.CholCheck,
        BMI: row.BMI,
        Smoker: row.Smoker,
        Stroke: row.Stroke,
        HeartDiseaseorAttack: row.HeartDiseaseorAttack,
        PhysActivity: row.PhysActivity,
        Fruits: row.Fruits,
        Veggies: row.Veggies,
        HvyAlcoholConsump: row.HvyAlcoholConsump,
        AnyHealthcare: row.AnyHealthcare,
        NoDocbcCost: row.NoDocbcCost,
        GenHlth: row.GenHlth,
        MentHlth: row.MentHlth,
        PhysHlth: row.PhysHlth,
        DiffWalk: row.DiffWalk,
        Sex: row.Sex,
        Age: row.Age,
        Education: row.Education,
        Income: row.Income
      }));

      console.log('Data cached successfully');
      isLoading = false;
      return cachedData;
    } catch (error) {
      console.error('Failed to load data from Supabase:', error);
      isLoading = false;
      cachedData = [];
      return [];
    }
  })();

  return loadPromise;
};

/**
 * Get cached data (synchronous)
 * Returns null if data not yet loaded
 */
export const getCachedData = () => {
  return cachedData;
};

/**
 * Clear the cache (useful for refreshing data)
 */
export const clearCache = () => {
  cachedData = null;
  isLoading = false;
  loadPromise = null;
};

/**
 * Get data (waits for cache if needed)
 */
export const getData = async () => {
  if (cachedData) {
    return cachedData;
  }
  return await cacheData();
};

/**
 * Get metadata about the dataset
 */
export const getMetadata = () => {
  const data = getCachedData();
  if (!data) return null;

  const targetVar = 'Diabetes';
  const negativeCount = data.filter(row => row[targetVar] === 0).length;
  const positiveCount = data.filter(row => row[targetVar] === 1 || row[targetVar] === 2).length;

  return {
    totalRecords: data.length,
    features: Object.keys(data[0] || {}).length - 1,
    targetVariable: targetVar,
    classDistribution: {
      negative: negativeCount,
      positive: positiveCount
    },
    missingValues: 0
  };
};
/**
 * Calculate Pearson correlation coefficient between two features
 */
export const calculateCorrelation = (feature1, feature2) => {
  const data = getCachedData();
  if (!data) return null;

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
export const calculateAgeBinnedRisk = () => {
  const data = getCachedData();
  if (!data) return null;

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
export const calculatePhysActivityImpact = () => {
  const data = getCachedData();
  if (!data) return null;

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
export const calculateClassDistribution = () => {
  const data = getCachedData();
  if (!data) return null;

  return {
    negative: data.filter(row => row[targetVar] === 0 || row[targetVar] === '0').length,
    positive: data.filter(row => row[targetVar] === 1 || row[targetVar] === '1' || row[targetVar] === 2 || row[targetVar] === '2').length
  };
};

/**
 * Count missing values in dataset
 */
export const countMissingValues = (columns) => {
  const data = getCachedData();
  if (!data) return null;

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
  const data = getCachedData();
  if (!data) return null;

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
  data.forEach(row => {
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
  const classDistribution = calculateClassDistribution();
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
  const data = getCachedData();
  if (!data) return null;

  const factors = {
    'High BP': 'HighBP',
    'Gen Health': 'GenHlth',
    'High Chol': 'HighChol',
    'Smoker': 'Smoker',
    'BMI': 'BMI',
    'Physical Activity': 'PhysActivity',
    'Alcohol Consumption': 'HvyAlcoholConsump',
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
  const data = getCachedData();
  if (!data) return null;

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
  const data = getCachedData();
  if (!data) return null;

  const totalBMI = data.reduce((sum, row) => sum + (row.BMI || 0), 0);
  const avgBMI = (totalBMI / data.length).toFixed(1);

  return parseFloat(avgBMI);
};

/**
 * Calculate average income category
 */
export const getAverageIncome = () => {
  const data = getCachedData();
  if (!data) return null;

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
/**
 * Calculate BMI risk analysis for diabetes
 * Analyzes diabetes rates across BMI categories (CDC standard)
 */
export const calculateBmiRiskAnalysis = () => {
  const data = getCachedData();
  if (!data) return null;

  // BMI categories (CDC standard)
  const bmiCategories = {
    'Underweight': { min: 0, max: 18.5 },
    'Normal': { min: 18.5, max: 25 },
    'Overweight': { min: 25, max: 30 },
    'Obese': { min: 30, max: 100 }
  };

  // Filter valid data
  const validData = data.filter(row =>
    row.BMI &&
    (row.Diabetes === 0 || row.Diabetes === 1 || row.Diabetes === 2)
  );

  // Calculate statistics by BMI category
  const bmiStats = {};
  Object.keys(bmiCategories).forEach(category => {
    const categoryData = validData.filter(row =>
      row.BMI >= bmiCategories[category].min &&
      row.BMI < bmiCategories[category].max
    );

    const diabeticCount = categoryData.filter(row =>
      row.Diabetes === 1 || row.Diabetes === 2
    ).length;

    bmiStats[category] = {
      total: categoryData.length,
      diabetic: diabeticCount,
      rate: categoryData.length > 0 ? (diabeticCount / categoryData.length * 100) : 0
    };
  });

  // Find highest and lowest risk categories
  const bmiRates = Object.entries(bmiStats).map(([category, stats]) => ({
    category,
    rate: stats.rate
  }));
  const highestBMI = bmiRates.reduce((max, curr) =>
    curr.rate > max.rate ? curr : max
  );
  const lowestBMI = bmiRates.reduce((min, curr) =>
    curr.rate < min.rate ? curr : min
  );

  // Calculate average BMI for diabetic vs non-diabetic
  const diabeticData = validData.filter(row => row.Diabetes === 1 || row.Diabetes === 2);
  const nonDiabeticData = validData.filter(row => row.Diabetes === 0);

  const avgBMIDiabetic = diabeticData.reduce((sum, row) => sum + row.BMI, 0) / diabeticData.length;
  const avgBMINonDiabetic = nonDiabeticData.reduce((sum, row) => sum + row.BMI, 0) / nonDiabeticData.length;

  return {
    bmiStats,
    highestBMI,
    lowestBMI,
    avgBMIDiabetic: avgBMIDiabetic.toFixed(2),
    avgBMINonDiabetic: avgBMINonDiabetic.toFixed(2),
    bmiDifference: (avgBMIDiabetic - avgBMINonDiabetic).toFixed(2),
    totalRecords: validData.length
  };
};

/**
 * Calculate hexbin data for BMI and Income relationship with diabetes
 * Bins BMI by 2.5 units and groups by income categories
 */
export const calculateIncomeBmiHexbinData = () => {
  const data = getCachedData();
  if (!data) return null;

  // Income labels mapping
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

  // Filter valid data
  const validData = data.filter(row =>
    row.BMI && row.Income &&
    (row.Diabetes === 0 || row.Diabetes === 1 || row.Diabetes === 2)
  );

  // Create bins: Income (8 categories) x BMI (grouped by 2.5 units)
  const bins = {};

  validData.forEach(row => {
    const income = row.Income;
    const bmiBin = Math.floor(row.BMI / 2.5) * 2.5; // Bin BMI by 2.5 units
    const diabetes = row.Diabetes;

    const binKey = `${income}-${bmiBin}`;

    if (!bins[binKey]) {
      bins[binKey] = {
        income,
        bmiBin,
        bmiMid: bmiBin + 1.25, // Middle of the bin
        total: 0,
        noDiabetes: 0,
        diabetic: 0  // Combined prediabetes + diabetes
      };
    }

    bins[binKey].total++;
    if (diabetes === 0) {
      bins[binKey].noDiabetes++;
    } else {
      bins[binKey].diabetic++;  // Combine 1 (prediabetes) and 2 (diabetes)
    }
  });

  // Convert bins to array with percentage calculation
  const binsArray = Object.values(bins).map(bin => {
    const diabeticPercent = (bin.diabetic / bin.total) * 100;

    return {
      income: bin.income,
      bmi: bin.bmiMid,
      count: bin.total,
      z: bin.total, // Z value for sizing
      total: bin.total,
      noDiabetesCount: bin.noDiabetes,
      diabeticCount: bin.diabetic,
      noDiabetesPercent: ((bin.noDiabetes / bin.total) * 100).toFixed(1),
      diabeticPercent: diabeticPercent.toFixed(1),
      diabeticPercentRaw: diabeticPercent, // For color calculation
      incomeLabel: incomeLabels[bin.income]
    };
  });

  // Calculate statistics
  const diabeticData = validData.filter(row => row.Diabetes === 1 || row.Diabetes === 2);
  const nonDiabeticData = validData.filter(row => row.Diabetes === 0);

  const avgBMIDiabetic = (diabeticData.reduce((sum, row) => sum + row.BMI, 0) / diabeticData.length).toFixed(2);
  const avgBMINonDiabetic = (nonDiabeticData.reduce((sum, row) => sum + row.BMI, 0) / nonDiabeticData.length).toFixed(2);
  const avgIncomeDiabetic = (diabeticData.reduce((sum, row) => sum + row.Income, 0) / diabeticData.length).toFixed(2);
  const avgIncomeNonDiabetic = (nonDiabeticData.reduce((sum, row) => sum + row.Income, 0) / nonDiabeticData.length).toFixed(2);

  const bmiDifference = (avgBMIDiabetic - avgBMINonDiabetic).toFixed(2);
  const incomeDifference = (avgIncomeNonDiabetic - avgIncomeDiabetic).toFixed(2);

  // Find max counts for size scaling
  const maxCount = Math.max(...binsArray.map(b => b.count));

  // Find min/max diabetes percentages for gradient reference
  const diabeticPercentages = binsArray.map(b => b.diabeticPercentRaw);
  const minDiabeticPercent = Math.min(...diabeticPercentages);
  const maxDiabeticPercent = Math.max(...diabeticPercentages);

  return {
    bins: binsArray,
    maxCount,
    minDiabeticPercent: minDiabeticPercent.toFixed(1),
    maxDiabeticPercent: maxDiabeticPercent.toFixed(1),
    stats: {
      avgBMIDiabetic,
      avgBMINonDiabetic,
      avgIncomeDiabetic,
      avgIncomeNonDiabetic,
      bmiDifference,
      incomeDifference,
      totalRecords: validData.length,
      totalBins: Object.keys(bins).length,
      diabeticCount: diabeticData.length,
      nonDiabeticCount: nonDiabeticData.length
    },
    incomeLabels
  };
};

/**
 * Calculate hexbin data for General Health and Education relationship with diabetes
 * Groups by education categories (1-6) and general health categories (1-5)
 */
export const calculateGenHealthEduHexbinData = () => {
  const data = getCachedData();
  if (!data) return null;

  // Education labels mapping
  const educationLabels = {
    1: 'Never attended/Kindergarten',
    2: 'Elementary',
    3: 'Some high school',
    4: 'High school grad',
    5: 'Some college',
    6: 'College graduate'
  };

  // General Health labels mapping (1 = Excellent, 5 = Poor)
  const healthLabels = {
    1: 'Excellent',
    2: 'Very Good',
    3: 'Good',
    4: 'Fair',
    5: 'Poor'
  };

  // Filter valid data
  const validData = data.filter(row =>
    row.Education && row.GenHlth &&
    (row.Diabetes === 0 || row.Diabetes === 1 || row.Diabetes === 2)
  );

  // Create bins: Education (6 categories) x General Health (5 categories)
  const bins = {};

  validData.forEach(row => {
    const education = row.Education;
    const genHlth = row.GenHlth;
    const diabetes = row.Diabetes;

    const binKey = `${education}-${genHlth}`;

    if (!bins[binKey]) {
      bins[binKey] = {
        education,
        genHlth,
        total: 0,
        noDiabetes: 0,
        diabetic: 0  // Combined prediabetes + diabetes
      };
    }

    bins[binKey].total++;
    if (diabetes === 0) {
      bins[binKey].noDiabetes++;
    } else {
      bins[binKey].diabetic++;  // Combine 1 (prediabetes) and 2 (diabetes)
    }
  });

  // Convert bins to array with percentage calculation
  const binsArray = Object.values(bins).map(bin => {
    const diabeticPercent = (bin.diabetic / bin.total) * 100;

    return {
      education: bin.education,
      genHlth: bin.genHlth,
      count: bin.total,
      z: bin.total, // Z value for sizing
      total: bin.total,
      noDiabetesCount: bin.noDiabetes,
      diabeticCount: bin.diabetic,
      noDiabetesPercent: ((bin.noDiabetes / bin.total) * 100).toFixed(1),
      diabeticPercent: diabeticPercent.toFixed(1),
      diabeticPercentRaw: diabeticPercent, // For color calculation
      educationLabel: educationLabels[bin.education],
      healthLabel: healthLabels[bin.genHlth]
    };
  });

  // Calculate statistics
  const diabeticData = validData.filter(row => row.Diabetes === 1 || row.Diabetes === 2);
  const nonDiabeticData = validData.filter(row => row.Diabetes === 0);

  const avgGenHlthDiabetic = (diabeticData.reduce((sum, row) => sum + row.GenHlth, 0) / diabeticData.length).toFixed(2);
  const avgGenHlthNonDiabetic = (nonDiabeticData.reduce((sum, row) => sum + row.GenHlth, 0) / nonDiabeticData.length).toFixed(2);
  const avgEducationDiabetic = (diabeticData.reduce((sum, row) => sum + row.Education, 0) / diabeticData.length).toFixed(2);
  const avgEducationNonDiabetic = (nonDiabeticData.reduce((sum, row) => sum + row.Education, 0) / nonDiabeticData.length).toFixed(2);

  const genHlthDifference = (avgGenHlthDiabetic - avgGenHlthNonDiabetic).toFixed(2);
  const educationDifference = (avgEducationNonDiabetic - avgEducationDiabetic).toFixed(2);

  // Find max counts for size scaling
  const maxCount = Math.max(...binsArray.map(b => b.count));

  // Find min/max diabetes percentages for gradient reference
  const diabeticPercentages = binsArray.map(b => b.diabeticPercentRaw);
  const minDiabeticPercent = Math.min(...diabeticPercentages);
  const maxDiabeticPercent = Math.max(...diabeticPercentages);

  return {
    bins: binsArray,
    maxCount,
    minDiabeticPercent: minDiabeticPercent.toFixed(1),
    maxDiabeticPercent: maxDiabeticPercent.toFixed(1),
    stats: {
      avgGenHlthDiabetic,
      avgGenHlthNonDiabetic,
      avgEducationDiabetic,
      avgEducationNonDiabetic,
      genHlthDifference,
      educationDifference,
      totalRecords: validData.length,
      totalBins: Object.keys(bins).length,
      diabeticCount: diabeticData.length,
      nonDiabeticCount: nonDiabeticData.length
    },
    educationLabels,
    healthLabels
  };
};
