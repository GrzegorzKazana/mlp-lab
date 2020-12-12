import type * as tfLib from '@tensorflow/tfjs';
import { Observable, defer } from 'rxjs';
import { mergeMap, shareReplay } from 'rxjs/operators';

import { Model } from '@/features/model-creator/models';
import { Data } from '@/features/data-loader';

import { Training, TrainingProgress } from '../models';
import { fitModelAsObservable } from '../utils';

type TF = typeof tfLib;

export class ModelService {
  private static readonly VALIDATION_SPLIT = 0.3;

  private static readonly BATCH_SIZE = 32;

  private static readonly DEFAULT_LOSS: tfLib.ModelCompileArgs['loss'] =
    'hinge';

  private static readonly DEFAULT_OPTIMIZER: tfLib.ModelCompileArgs['optimizer'] =
    'adam';

  /**
   * Load tensorflow lazily - so it is skipped in initial bundle
   * use `shareReplay` so first emission is reused upon subsequent subscriptions
   */
  private readonly tf = defer(() => import('@tensorflow/tfjs')).pipe(
    shareReplay(1)
  );

  public trainModel(
    definition: Model,
    training: Training,
    data: Data
  ): Observable<TrainingProgress> {
    return this.tf.pipe(
      mergeMap(tf => {
        const model = this.buildModel(tf, definition, training);
        const [xs, ys] = this.createDataTensors(tf, training, data);

        return fitModelAsObservable(
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
      })
    );
  }

  private buildModel(
    tf: TF,
    definition: Model,
    training: Training
  ): tfLib.Sequential {
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
    tf: TF,
    training: Training,
    data: Data
  ): [tfLib.Tensor2D, tfLib.Tensor2D] {
    const xs = data.rows.map(row =>
      training.inputAttributes.map(attr => row[attr])
    );
    const ys = data.rows.map(row => [row[training.targetAttribute]]);

    return [tf.tensor2d(xs), tf.tensor2d(ys)];
  }
}
