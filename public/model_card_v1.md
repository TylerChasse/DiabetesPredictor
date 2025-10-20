# Diabetes Decision Tree Model (Recall-Prioritized)

**Model version:** v1_recall  
**Training date:** 2025-10-20  

### Best Params
{'dt__max_depth': 5, 'dt__min_samples_leaf': 1}

### Metrics (Test Set)
{
  "roc_auc": 0.7931898368218473,
  "pr_auc": 0.391036285507704,
  "precision": 0.3092534914096252,
  "recall": 0.7710420841683366,
  "f1": 0.44144854786661886,
  "specificity": 0.6783776197604791,
  "confusion_matrix": {
    "tn": 14501,
    "fp": 6875,
    "fn": 914,
    "tp": 3078
  }
}

### Objective
Optimized for *recall*, minimizing false negatives (e.g., catching as many positive cases as possible).

### Notes
Educational demo only — not medical advice.
