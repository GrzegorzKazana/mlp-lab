import { unionize, UnionOf, ofType } from 'unionize';
import { filter, map } from 'rxjs/operators';

import type { BackendEpic } from '@/config/events.main/rootEpic.main';

export const Action = unionize(
  {
    RANDOM_REQUEST: {},
    RANDOM_GENERATED: ofType<{ value: number }>(),
  },
  { tag: 'type' }
);

export type Action = UnionOf<typeof Action>;

export const epic: BackendEpic = action$ =>
  action$.pipe(
    filter(Action.is.RANDOM_REQUEST),
    map(() =>
      Action.RANDOM_GENERATED({ value: Math.floor(Math.random() * 100) })
    )
  );
