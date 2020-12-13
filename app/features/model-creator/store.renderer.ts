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
    MODEL_ADD_LAYER: ofType<Layer>(),
    MODEL_REMOVE_LAYER: ofType<Layer>(),
    MODEL_MOVE_LAYER_UP: ofType<Layer>(),
    MODEL_MOVE_LAYER_DOWN: ofType<Layer>(),
  },
  { tag: 'type' }
);

export type Action = UnionOf<typeof Action>;
type State = typeof initialState;
type Selector<T> = (state: { [name]: State }) => T;

export const reducer = (state = initialState, action: Action): State =>
  Action.match(action, {
    MODEL_ADD_LAYER: layer => Model.addLayer(state, layer),
    MODEL_REMOVE_LAYER: layer => Model.removeLayer(state, layer),
    MODEL_MOVE_LAYER_UP: layer => Model.moveLayerUp(state, layer),
    MODEL_MOVE_LAYER_DOWN: layer => Model.moveLayerDown(state, layer),
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
