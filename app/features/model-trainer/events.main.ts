import { filter, ignoreElements, map } from 'rxjs/operators';

import type { BackendEpic } from '@/config/events.main/rootEpic.main';

import { Action, isTrainingAction } from './store.renderer';

export const epic: BackendEpic = action$ =>
  action$.pipe(
    filter(isTrainingAction),
    filter(Action.is.TRAIN_MODEL_START),
    ignoreElements()
  );
