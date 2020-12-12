import { unionize, UnionOf, ofType } from 'unionize';
import { of, EMPTY } from 'rxjs';
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { createIsAction } from '@/config/store.renderer/utils';
import type { AppEpic } from '@/config/store.renderer/rootEpic';

import { Data, dataSelector } from '@/features/data-loader';
import { Model, modelSelector } from '@/features/model-creator';

import { Traning } from './models';

export const name = 'modelTrainer';

const initialState = {};

export const Action = unionize(
  {
    TRAIN_REQUEST: ofType<Traning>(),
    TRAIN_MODEL_START: ofType<{
      training: Traning;
      model: Model;
      data: Data;
    }>(),
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
    mergeMap(([training, state]) => {
      console.warn([training, state]);
      const model = modelSelector(state);
      const data = dataSelector(state);

      return model && data ? of({ training, model, data }) : EMPTY;
    }),
    map(Action.TRAIN_MODEL_START)
  );
