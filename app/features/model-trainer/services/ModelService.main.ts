import * as tf from '@tensorflow/tfjs';

import { Model } from '@/features/model-creator/models';
import { Data } from '@/features/data-loader';
import { Traning } from '../models';

export class ModelService {
  public trainModel(definition: Model, training: Traning, data: Data) {
    const model = this.buildModel(definition);

    model.fit([], [], {});
  }

  private buildModel(definition: Model): tf.Sequential {
    const layers = definition.layers.map(({ numPerceptrons }) =>
      tf.layers.dense({ units: numPerceptrons })
    );

    const model = tf.sequential({ layers });

    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    return model;
  }
}
