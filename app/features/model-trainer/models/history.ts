import { DatasetMetaData } from '@/features/data-loader';
import { Model } from '@/features/model-creator';

import { Training, Metrics } from './training';

export type TrainingHistoryEntryId = string;

export type TrainingHistoryEntry = {
  id: TrainingHistoryEntryId;
  timestamp: string;
  training: Training;
  model: Model;
  datasetMeta: DatasetMetaData;
  metrics: Metrics;
};
