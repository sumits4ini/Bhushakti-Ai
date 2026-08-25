/**
 * BHUSHAKTI AI — AI & Machine Learning Services Layer
 * Provides modular interfaces for tabular risk prediction, SHAP explainability, and CV inspection.
 */

export interface AIInferenceService {
  name: string;
  version: string;
  isReady: boolean;
}
