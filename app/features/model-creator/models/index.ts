import { nanoid } from 'nanoid';

export type LayerId = string;
export type Layer = { id: LayerId; numPerceptrons: number };

export type Model = {
  layers: Array<Layer>;
};

export const Model = {
  addLayer: (model: Model, layer: Omit<Layer, 'id'>): Model => ({
    ...model,
    layers: [...model.layers, { ...layer, id: nanoid() }],
  }),
};
