/**
 * Diabetes Risk Prediction System
 * Uses the trained Decision Tree model (dt_model_v1.json)
 */

let modelCache = null;
let preprocCache = null;

/**
 * Load model and preprocessing configuration
 */
export const loadPredictionModel = async () => {
  if (modelCache && preprocCache) {
    return { model: modelCache, preproc: preprocCache };
  }

  try {
    const [modelResponse, preprocResponse] = await Promise.all([
      fetch('/dt_model_v1.json'),
      fetch('/preproc_v1.json')
    ]);

    modelCache = await modelResponse.json();
    preprocCache = await preprocResponse.json();

    return { model: modelCache, preproc: preprocCache };
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load prediction model');
  }
};

/**
 * Preprocess user input according to preproc_v1.json
 * Converts raw form data into model-ready feature vector
 */
export const preprocessInput = (userInput, preproc) => {
  const featureVector = [];

  preproc.final_feature_order.forEach(featureSpec => {
    if (featureSpec.kind === 'numeric') {
      // Handle numeric features
      let value = userInput[featureSpec.source];
      
      // Apply imputation if missing
      if (value === null || value === undefined || value === '') {
        value = preproc.numeric_imputation[featureSpec.source];
      }
      
      // Ensure it's a number
      value = parseFloat(value);
      
      // Clamp to training range
      const range = preproc.numeric_ranges_train[featureSpec.source];
      value = Math.max(range.min, Math.min(range.max, value));
      
      featureVector.push(value);
      
    } else if (featureSpec.kind === 'onehot') {
      // Handle one-hot encoded categorical features
      const userValue = userInput[featureSpec.source];
      const isMatch = userValue === featureSpec.category;
      featureVector.push(isMatch ? 1 : 0);
    }
  });

  return featureVector;
};

/**
 * Traverse decision tree recursively to make prediction
 */
const traverseTree = (nodeIndex, nodes, features) => {
  const node = nodes[nodeIndex];

  // Base case: leaf node
  if (node.is_leaf) {
    return {
      prediction: node.value[1] > node.value[0] ? 1 : 0,
      probabilities: node.value
    };
  }

  // Recursive case: traverse based on feature threshold
  const featureValue = features[node.feature_index];
  const nextNodeIndex = featureValue <= node.threshold ? node.left : node.right;
  
  return traverseTree(nextNodeIndex, nodes, features);
};

/**
 * Make prediction using the decision tree
 */
export const predictDiabetes = async (userInput) => {
  try {
    // Load model and preprocessor
    const { model, preproc } = await loadPredictionModel();

    // Preprocess input
    const features = preprocessInput(userInput, preproc);

    // Traverse tree to get prediction
    const rawResult = traverseTree(0, model.tree.nodes, features);

    // Normalize probabilities
    const total = rawResult.probabilities[0] + rawResult.probabilities[1];
    const normalizedProbs = [
      rawResult.probabilities[0] / total,
      rawResult.probabilities[1] / total
    ];

    // Apply threshold from model
    const diabetesProb = normalizedProbs[1];
    const prediction = diabetesProb >= model.threshold ? 1 : 0;

    return {
      class: prediction,
      probabilities: normalizedProbs,
      riskScore: diabetesProb,
      confidence: Math.max(...normalizedProbs),
      modelVersion: model.model_version,
      threshold: model.threshold
    };
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

/**
 * Get risk level description
 */
export const getRiskLevel = (probability) => {
  if (probability < 0.3) {
    return {
      level: 'Low Risk',
      color: '#48bb78',
      description: 'Low probability of diabetes based on current factors.'
    };
  } else if (probability < 0.5) {
    return {
      level: 'Moderate Risk',
      color: '#ed8936',
      description: 'Moderate probability. Consider lifestyle modifications and regular screening.'
    };
  } else if (probability < 0.7) {
    return {
      level: 'High Risk',
      color: '#f56565',
      description: 'High probability. Consult healthcare provider for comprehensive screening.'
    };
  } else {
    return {
      level: 'Very High Risk',
      color: '#c53030',
      description: 'Very high probability. Urgent medical consultation recommended.'
    };
  }
};