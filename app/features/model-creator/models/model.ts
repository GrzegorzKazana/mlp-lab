import { swapWithPrevious, swapWithNext } from '@/common/utils';

import { Layer } from './layer';

export type Model = {
  layers: Array<Layer>;
};

export const Model = {
  addLayer: (model: Model, layer: Layer): Model => ({
    ...model,
    layers: [...model.layers, layer],
  }),

  removeLayer: (model: Model, layer: Layer): Model => ({
    ...model,
    layers: model.layers.filter(({ id }) => id !== layer.id),
  }),

  moveLayerUp: (model: Model, layer: Layer): Model => ({
    ...model,
    layers: swapWithPrevious(model.layers, ({ id }) => id === layer.id),
  }),

  moveLayerDown: (model: Model, layer: Layer): Model => ({
    ...model,
    layers: swapWithNext(model.layers, ({ id }) => id === layer.id),
  }),
};
