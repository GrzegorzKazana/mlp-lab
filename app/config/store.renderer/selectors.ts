import { Selectors as DataSelectors } from '@/features/data-loader/store';
import { Selectors as ModelCreatorSelectors } from '@/features/model-creator/store';
import { Selectors as ModelTrainerSelectors } from '@/features/model-trainer/store';

export const appSelectors = {
  data: DataSelectors,
  model: ModelCreatorSelectors,
  train: ModelTrainerSelectors,
};

export type AppSelectors = typeof appSelectors;
