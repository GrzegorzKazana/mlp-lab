import { of, EMPTY } from 'rxjs';
import {
  exhaustMap,
  filter,
  mergeMap,
  withLatestFrom,
  catchError,
  takeUntil,
} from 'rxjs/operators';
import { push } from 'connected-react-router';
import { nanoid } from 'nanoid';

import type { AppEpic } from '@/config/store.renderer/rootEpic';
import routes from '@/config/routes';
import { createUnknownError } from '@/common/errors';

import { Action, isTrainingAction } from './actions';
import { TrainingHistoryEntry } from '../models';

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
        mergeMap(result => {
          if (!result.completed)
            return of(Action.TRAIN_MODEL_PROGRESS(result.progress));

          const resultId = nanoid();
          const trainingEntry: TrainingHistoryEntry = {
            datasetMeta: dataset.meta,
            metrics: result.metrics,
            model,
            training,
            id: resultId,
            timestamp: new Date().toISOString(),
          };

          return of(
            Action.TRAIN_MODEL_FINISHED(trainingEntry),
            push(routes.createTrainingHistoryEntryUrl(resultId))
          );
        }),
        catchError(err => {
          const error = createUnknownError(
            err,
            'Something went wrong during model training'
          );

          return of(Action.TRAIN_MODEL_ERROR(error));
        })
      );
    })
  );
};
