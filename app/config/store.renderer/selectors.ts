import { Selectors as DataSelectors } from '@/features/data-loader';
import { Selectors as ModelCreatorSelectors } from '@/features/model-creator';
import { Selectors as ModelTrainerSelectors } from '@/features/model-trainer';

export const appSelectors = {
  data: DataSelectors,
  model: ModelCreatorSelectors,
  train: ModelTrainerSelectors,
};

export type AppSelectors = typeof appSelectors;
