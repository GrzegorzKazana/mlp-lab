import { Action } from './actions';

import { Model } from '../models';

export const name = 'modelCreator';

const initialState: Model = {
  layers: [],
};

export type State = typeof initialState;

export const reducer = (state = initialState, action: Action): State =>
  Action.match(action, {
    MODEL_ADD_LAYER: layer => Model.addLayer(state, layer),

    MODEL_REMOVE_LAYER: layer => Model.removeLayer(state, layer),

    MODEL_MOVE_LAYER_UP: layer => Model.moveLayerUp(state, layer),

    MODEL_MOVE_LAYER_DOWN: layer => Model.moveLayerDown(state, layer),

    default: () => state,
  });
