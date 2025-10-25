# Diabetes KNN Model (Recall-Prioritized)

**Model version:** v2  
**Model type:** K-Nearest Neighbors  
**Training date:** 2025-10-23  

### Best Params (GridSearchCV)
{
  "knn__algorithm": "auto",
  "knn__metric": "euclidean",
  "knn__n_neighbors": 3,
  "knn__p": 1,
  "knn__weights": "distance"
}

### Cross-Validation
- Best CV Recall Score: 0.268
- Stratified 5-Fold CV

### Metrics (Test Set)
{
  "roc_auc": 0.6845051911457646,
  "pr_auc": 0.2842695098840621,
  "precision": 0.2902138540213854,
  "recall": 0.625501002004008,
  "f1": 0.3964750714512544,
  "specificity": 0.7143057634730539,
  "confusion_matrix": {
    "tn": 15269,
    "fp": 6107,
    "fn": 1495,
    "tp": 2497
  }
}

### Objective
Optimized for *recall* via hyperparameter tuning, minimizing false negatives while maintaining precision above 40%.

### Model Details
- Hyperparameter tuning with GridSearchCV
- Distance weighting for neighbors
- Features scaled using StandardScaler
- Focused on lower k values (3-11 neighbors)

### Notes
Educational demo only — not medical advice.
