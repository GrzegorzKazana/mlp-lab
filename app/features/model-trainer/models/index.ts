import type * as tf from '@tensorflow/tfjs';

import { AttributeName, MetaData } from '@/features/data-loader';
import { Model } from '@/features/model-creator';

export type Training = {
  epochs: number;
  inputAttributes: Array<AttributeName>;
  targetAttribute: AttributeName;
};

export type Progress = { value: number };
export type Metrics = tf.History;

export type TrainingProgress =
  | {
      completed: false;
      progress: Progress;
    }
  | {
      completed: true;
      metrics: Metrics;
    };

export type TrainingHistoryEntry = {
  timestamp: string;
  training: Training;
  model: Model;
  datasetMeta: MetaData;
  metrics: Metrics;
};

export const Progress = {
  empty: { value: 0 },
};
