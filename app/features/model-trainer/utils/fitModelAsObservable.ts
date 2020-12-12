import * as tf from '@tensorflow/tfjs';
import { Observable, Subscriber } from 'rxjs';

import { TrainingProgress } from '../models';

export const fitModelAsObservable = (
  model: tf.Sequential,
  xs: tf.Tensor2D,
  ys: tf.Tensor2D,
  fitOpts: tf.ModelFitArgs &
    Required<Pick<tf.ModelFitArgs, 'epochs' | 'batchSize' | 'validationSplit'>>,
  compileOpts: tf.ModelCompileArgs
): Observable<TrainingProgress> => {
  const numberOfBatchesPerEpoch = Math.ceil(
    ((1 - fitOpts.validationSplit) * xs.shape[0]) / fitOpts.batchSize
  );
  const numberOfBatches = numberOfBatchesPerEpoch * fitOpts.epochs;

  return new Observable(observer => {
    const args: tf.ModelFitArgs = {
      ...fitOpts,
      callbacks: createTrainingCallbacks(
        observer,
        fitOpts.epochs,
        numberOfBatches,
        numberOfBatchesPerEpoch
      ),
    };

    observer.next({ completed: false, progress: { value: 0 } });

    model.compile(compileOpts);

    model
      .fit(xs, ys, args)
      .then(logs => {
        observer.next({ completed: true, metrics: logs });

        return observer.complete();
      })
      .catch(err => observer.error(err));

    return () => {
      // stops training after finishing current batch
      model.stopTraining = true;
    };
  });
};

function createTrainingCallbacks(
  observer: Subscriber<TrainingProgress>,
  epochs: number,
  batches: number,
  batchesPerEpoch: number
): tf.ModelFitArgs['callbacks'] {
  let currentEpoch = 0;

  return {
    onBatchEnd: batchNumber => {
      const progress =
        (currentEpoch * batchesPerEpoch + batchNumber + 1) / batches;

      observer.next({
        completed: false,
        progress: { value: progress },
      });
    },
    onEpochEnd: epochNumber => {
      currentEpoch += 1;
      const progress = (epochNumber + 1) / epochs;

      observer.next({
        completed: false,
        progress: { value: progress },
      });
    },
  };
}
