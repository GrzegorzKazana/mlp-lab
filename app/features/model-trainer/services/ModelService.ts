import { Observable } from 'rxjs';
import * as tf from '@tensorflow/tfjs';

import { Model } from '@/features/model-creator/models';
import { Data } from '@/features/data-loader';

import { Training, TrainingProgress } from '../models';
import { fitModelAsObservable } from '../utils';

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
}
