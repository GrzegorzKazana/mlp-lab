import { DatasetMetaData } from '@/features/data-loader';
import { Model } from '@/features/model-creator';

import { Training, Metrics } from './training';

export type TrainingHistoryEntry = {
  timestamp: string;
  training: Training;
  model: Model;
  datasetMeta: DatasetMetaData;
  metrics: Metrics;
};
