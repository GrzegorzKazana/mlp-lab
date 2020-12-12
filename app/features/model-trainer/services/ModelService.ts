import { Observable } from 'rxjs';
import * as tf from '@tensorflow/tfjs';

import { Model } from '@/features/model-creator/models';
import { Data } from '@/features/data-loader';
import { Training, TrainingProgress } from '../models';

export class ModelService {
  private static readonly VALIDATION_SPLIT = 0.3;

  private static readonly BATCH_SIZE = 32;

  private static readonly DEFAULT_LOSS: tf.ModelCompileArgs['loss'] = 'hinge';

  private static readonly DEFAULT_OPTIMIZER: tf.ModelCompileArgs['optimizer'] =
    'adam';

  public trainModel(
    definition: Model,
    training: Training,
    data: Data
  ): Observable<TrainingProgress> {
    const model = this.buildModel(definition, training);
    const [xs, ys] = this.createDataTensors(training, data);

    return this.fitModelAsObservable(
      model,
      xs,
      ys,
      {
        epochs: training.epochs,
        batchSize: ModelService.BATCH_SIZE,
        validationSplit: ModelService.VALIDATION_SPLIT,
      },
      {
        loss: ModelService.DEFAULT_LOSS,
        optimizer: ModelService.DEFAULT_OPTIMIZER,
      }
    );
  }

  private buildModel(definition: Model, training: Training): tf.Sequential {
    const hiddenLayers = definition.layers.map(({ numPerceptrons }, idx) => {
      const isFirstLayer = idx === 0;

      return tf.layers.dense({
        units: numPerceptrons,
        inputDim: isFirstLayer ? training.inputAttributes.length : undefined,
      });
    });

    const outputLayer = tf.layers.dense({ units: 1 });
    const layers = [...hiddenLayers, outputLayer];
    const model = tf.sequential({ layers });

    return model;
  }

  private createDataTensors(
    training: Training,
    data: Data
  ): [tf.Tensor2D, tf.Tensor2D] {
    const xs = data.rows.map(row =>
      training.inputAttributes.map(attr => row[attr])
    );
    const ys = data.rows.map(row => [row[training.targetAttribute]]);

    return [tf.tensor2d(xs), tf.tensor2d(ys)];
  }

  private fitModelAsObservable(
    model: tf.Sequential,
    xs: tf.Tensor2D,
    ys: tf.Tensor2D,
    fitOpts: tf.ModelFitArgs &
      Required<
        Pick<tf.ModelFitArgs, 'epochs' | 'batchSize' | 'validationSplit'>
      >,
    compileOpts: tf.ModelCompileArgs
  ): Observable<TrainingProgress> {
    const numberOfBatchesPerEpoch = Math.ceil(
      ((1 - fitOpts.validationSplit) * xs.shape[0]) / fitOpts.batchSize
    );
    const numberOfBatches = numberOfBatchesPerEpoch * fitOpts.epochs;

    let currentEpoch = 0;

    return new Observable(observer => {
      const args: tf.ModelFitArgs = {
        ...fitOpts,
        callbacks: {
          onBatchEnd: batchNumber => {
            const progress =
              (currentEpoch * numberOfBatchesPerEpoch + batchNumber + 1) /
              numberOfBatches;

            observer.next({
              completed: false,
              progress: { value: progress },
            });
          },
          onEpochEnd: epochNumber => {
            currentEpoch += 1;
            const progress = (epochNumber + 1) / fitOpts.epochs;

            observer.next({
              completed: false,
              progress: { value: progress },
            });
          },
        },
      };

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
  }
}
