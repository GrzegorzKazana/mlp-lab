import { filter, map } from 'rxjs/operators';

import type { BackendEpic } from '@/config/events.main/rootEpic.main';

import { Action, isCounterAction } from './store.renderer';

export const epic: BackendEpic = action$ =>
  action$.pipe(
    filter(isCounterAction),
    filter(Action.is.RANDOM_REQUEST),
    map(() =>
      Action.RANDOM_RECEIVED({ value: Math.floor(Math.random() * 100) })
    )
  );
