import { unionize, UnionOf, ofType } from 'unionize';
import { flow } from 'fp-ts/es6/function';

import { createIsAction } from '@/config/store.renderer/utils';

import { Layer, Model } from './models';

export const name = 'modelCreator';

const initialState: Model = {
  layers: [],
};

export const Action = unionize(
  {
    MODEL_ADD_LAYER: ofType<Omit<Layer, 'id'>>(),
  },
  { tag: 'type' }
);

export type Action = UnionOf<typeof Action>;
type State = typeof initialState;
type Selector<T> = (state: { [name]: State }) => T;

export const reducer = (state = initialState, action: Action): State =>
  Action.match(action, {
    MODEL_ADD_LAYER: layer => Model.addLayer(state, layer),
    default: () => state,
  });

export const isModelAction = createIsAction(Action);

export const stateSelector: Selector<Model> = state => state[name];
export const isModelValidSelector: Selector<boolean> = flow(
  stateSelector,
  ({ layers }) => layers.length > 0
);
export const modelSelector: Selector<Model | null> = flow(
  stateSelector,
  model => (model.layers.length > 0 ? model : null)
);
