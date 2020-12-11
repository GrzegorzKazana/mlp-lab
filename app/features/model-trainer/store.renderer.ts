import { unionize, UnionOf, ofType } from 'unionize';
import { filter, map, withLatestFrom } from 'rxjs/operators';

import { createIsAction } from '@/config/store.renderer/utils';
import type { AppEpic } from '@/config/store.renderer/rootEpic';

import { Model } from '@/features/model-creator/models';
import { modelSelector } from '@/features/model-creator/store.renderer';

import { Traning } from './models';

export const name = 'modelTrainer';

const initialState = {};

export const Action = unionize(
  {
    TRAIN_REQUEST: ofType<Traning>(),
    TRAIN_MODEL_START: ofType<{ training: Traning; model: Model }>(),
  },
  { tag: 'type' }
);

export type Action = UnionOf<typeof Action>;
type State = typeof initialState;
type Selector<T> = (state: { [name]: State }) => T;

export const reducer = (state = initialState, action: Action): State =>
  Action.match(action, {
    default: () => state,
  });

export const isTrainingAction = createIsAction(Action);

export const epic: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(isTrainingAction),
    filter(Action.is.TRAIN_REQUEST),
    withLatestFrom(state$),
    map(([training, state]) => ({ training, model: modelSelector(state) })),
    map(Action.TRAIN_MODEL_START)
  );

// export const modelSelector: Selector<Model> = state => state[name];
