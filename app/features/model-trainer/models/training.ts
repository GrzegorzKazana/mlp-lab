import type * as tf from '@tensorflow/tfjs';

import { AttributeName } from '@/features/data-loader';

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

export const Progress = {
  empty: { value: 0 },
};
