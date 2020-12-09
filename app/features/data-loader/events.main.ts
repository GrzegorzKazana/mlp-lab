import { of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';

import type { BackendEpic } from '@/config/events.main/rootEpic.main';

import { createFileSystemError } from '@/common/errors';

import { Action, isDataAction } from './store.renderer';

export const epic: BackendEpic = (action$, { dataLoadingService }) =>
  action$.pipe(
    filter(isDataAction),
    filter(Action.is.DATA_FILE_REQUEST_PROMPT),
    switchMap(() =>
      dataLoadingService.loadCsv().pipe(
        map(data =>
          data
            ? Action.DATA_FILE_LOADED(data)
            : Action.DATA_FILE_REQUEST_PROMPT_CANCEL()
        ),
        catchError(err =>
          of(Action.DATA_FILE_ERROR(createFileSystemError(err)))
        )
      )
    )
  );
