import { nanoid } from 'nanoid';

import { swapWithPrevious, swapWithNext } from '@/common/utils';

export type LayerId = string;
export type Layer = { id: LayerId; numPerceptrons: number };

export type Model = {
  layers: Array<Layer>;
};

export const Layer = {
  ofSize: (numPerceptrons: number): Layer => ({ id: nanoid(), numPerceptrons }),
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
