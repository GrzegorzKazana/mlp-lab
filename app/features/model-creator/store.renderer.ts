import { unionize, UnionOf, ofType } from 'unionize';

import { createIsAction } from '@/config/store.renderer/utils';

import { Layer, Model } from './models';

export const name = 'modelCreator';

const initialState: Model = {
  layers: [],
};

export const Action = unionize(
  {
    ADD_LAYER: ofType<Omit<Layer, 'id'>>(),
  },
  { tag: 'type' }
);

export type Action = UnionOf<typeof Action>;
type State = typeof initialState;
type Selector<T> = (state: { [name]: State }) => T;

export const reducer = (state = initialState, action: Action): State =>
  Action.match(action, {
    ADD_LAYER: layer => Model.addLayer(state, layer),
    default: () => state,
  });

export const isDataAction = createIsAction(Action);

export const modelSelector: Selector<Model> = state => state[name];
