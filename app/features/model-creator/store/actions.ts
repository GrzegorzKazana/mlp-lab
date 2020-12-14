import { unionize, UnionOf, ofType } from 'unionize';

import { createIsAction } from '@/config/store.renderer/utils';

import { Layer } from '../models';

export const name = 'modelCreator';

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

export const isModelAction = createIsAction(Action);
