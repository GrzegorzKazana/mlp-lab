import { unionize, UnionOf, ofType } from 'unionize';
import { of, EMPTY, merge } from 'rxjs';
import {
  exhaustMap,
  filter,
  ignoreElements,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
  catchError,
  takeUntil,
} from 'rxjs/operators';
import { flow } from 'fp-ts/es6/function';

import { AppError, createUnknownError } from '@/common/errors';
import { createIsAction } from '@/config/store.renderer/utils';
import type { AppEpic } from '@/config/store.renderer/rootEpic';

import { Data, dataSelector } from '@/features/data-loader';
import { Model, modelSelector } from '@/features/model-creator';

import {
  Training,
  TrainingProgress,
  TrainingHistoryEntry,
  Progress,
} from './models';

export const name = 'modelTrainer';

const State = unionize({
  IDLE: ofType<{ history: TrainingHistoryEntry[] }>(),
  TRAINING: ofType<{ progress: Progress; history: TrainingHistoryEntry[] }>(),
  ERROR: ofType<{ error: AppError; history: TrainingHistoryEntry[] }>(),
});

const initialState = State.IDLE({ history: [] });

export const Action = unionize(
  {
    TRAIN_MODEL_REQUEST: ofType<Training>(),
    TRAIN_MODEL_CANCEL: {},
    TRAIN_MODEL_PROGRESS: ofType<Progress>(),
    TRAIN_MODEL_FINISHED: ofType<TrainingHistoryEntry>(),
    TRAIN_MODEL_ERROR: ofType<AppError>(),
  },
  { tag: 'type' }
);

export type Action = UnionOf<typeof Action>;
type State = typeof initialState;
type Selector<T> = (state: { [name]: State }) => T;

export const reducer = (state = initialState, action: Action): State =>
  Action.match(action, {
    TRAIN_MODEL_REQUEST: () =>
      State.TRAINING({ progress: Progress.empty, history: state.history }),
    TRAIN_MODEL_CANCEL: () => State.IDLE({ history: state.history }),
    TRAIN_MODEL_PROGRESS: progress =>
      State.TRAINING({ progress, history: state.history }),
    TRAIN_MODEL_FINISHED: entry =>
      State.IDLE({ history: [entry, ...state.history] }),
    default: () => state,
  });

export const isTrainingAction = createIsAction(Action);

export const epic: AppEpic = (action$, state$, { modelService }) => {
  const trainingAction$ = action$.pipe(filter(isTrainingAction));
  const trainReq$ = trainingAction$.pipe(filter(Action.is.TRAIN_MODEL_REQUEST));
  const trainCancel$ = trainingAction$.pipe(
    filter(Action.is.TRAIN_MODEL_CANCEL)
  );

  return trainReq$.pipe(
    withLatestFrom(state$),
    exhaustMap(([training, state]) => {
      const model = modelSelector(state);
      const dataset = dataSelector(state);

      if (!model || !dataset) return EMPTY;

      return modelService.trainModel(model, training, dataset.data).pipe(
        takeUntil(trainCancel$),
        map(result =>
          result.completed
            ? Action.TRAIN_MODEL_FINISHED({
                datasetMeta: dataset.meta,
                metrics: result.metrics,
                model,
                training,
                timestamp: new Date().toISOString(),
              })
            : Action.TRAIN_MODEL_PROGRESS(result.progress)
        ),
        catchError(err =>
          of(
            Action.TRAIN_MODEL_ERROR(
              createUnknownError(
                err,
                'Something went wrong during model training'
              )
            )
          )
        )
      );
    })
  );
};

export const stateSelector: Selector<State> = state => state[name];

export const historySelector: Selector<TrainingHistoryEntry[]> = flow(
  stateSelector,
  ({ history }) => history
);

export const trainingProgressSelector: Selector<Progress | null> = flow(
  stateSelector,
  State.match({ TRAINING: ({ progress }) => progress, default: () => null })
);

export const errorSelector: Selector<AppError | null> = flow(
  stateSelector,
  State.match({ ERROR: ({ error }) => error, default: () => null })
);
