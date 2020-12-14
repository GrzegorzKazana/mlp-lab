import { of, merge } from 'rxjs';
import { filter, switchMap, map, catchError, mergeMap } from 'rxjs/operators';

import type { BackendEpic } from '@/config/events.main/rootEpic.main';

import { createFileSystemError } from '@/common/errors';

import { Action, isDataAction } from './actions';

export const epic: BackendEpic = (action$, { datasetService }) =>
  action$.pipe(
    filter(isDataAction),
    filter(Action.is.DATA_PROMPT_REQUEST),
    switchMap(() =>
      datasetService.loadCsvMetaData().pipe(
        mergeMap(metaData => {
          if (!metaData) return of(Action.DATA_PROMPT_CANCEL());

          const promptSubmit$ = of(Action.DATA_PROMPT_SUBMIT(metaData));

          const data$ = datasetService.readCsv(metaData.path).pipe(
            map(Action.DATA_FILE_LOADED),
            catchError(err =>
              of(Action.DATA_FILE_ERROR(createFileSystemError(err)))
            )
          );

          return merge(promptSubmit$, data$);
        }),
        catchError(err => of(Action.DATA_PROMPT_ERROR(err)))
      )
    )
  );
