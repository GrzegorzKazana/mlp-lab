import { of, EMPTY } from 'rxjs';
import {
  exhaustMap,
  filter,
  map,
  withLatestFrom,
  catchError,
  takeUntil,
} from 'rxjs/operators';

import type { AppEpic } from '@/config/store.renderer/rootEpic';
import { createUnknownError } from '@/common/errors';

import { Action, isTrainingAction } from './actions';

export const epic: AppEpic = (
  action$,
  state$,
  { services: { modelService }, selectors }
) => {
  const trainingAction$ = action$.pipe(filter(isTrainingAction));
  const trainReq$ = trainingAction$.pipe(filter(Action.is.TRAIN_MODEL_REQUEST));
  const trainCancel$ = trainingAction$.pipe(
    filter(Action.is.TRAIN_MODEL_CANCEL)
  );

  return trainReq$.pipe(
    withLatestFrom(state$),
    exhaustMap(([training, state]) => {
      const model = selectors.model.modelSelector(state);
      const dataset = selectors.data.dataSelector(state);

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
