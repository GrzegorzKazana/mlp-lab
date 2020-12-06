import { unionize, UnionOf, ofType } from 'unionize';
import { filter, first, map, switchMap } from 'rxjs/operators';

import type { AppEpic } from '@/config/store.renderer/store';
import { BackendAction } from '@/config/events.main/rootEvents.main';

export const name = 'counter';

const initialState = { value: 0 };

export const Action = unionize(
  {
    INCREMENT: {},
    DECREMENT: {},
    RANDOM_REQUEST: {},
    RANDOM_RECEIVED: ofType<{ value: number }>(),
  },
  { tag: 'type' }
);

export type Action = UnionOf<typeof Action>;
type State = typeof initialState;
type Selector<T> = (state: { [name]: State }) => T;

export const reducer = (state = initialState, action: Action): State =>
  Action.match(action, {
    INCREMENT: () => ({ value: state.value + 1 }),
    DECREMENT: () => ({ value: state.value - 1 }),
    RANDOM_REQUEST: () => state,
    RANDOM_RECEIVED: newState => newState,
    default: () => state,
  });

export const selectCount: Selector<number> = ({ counter }) => counter.value;

export const epic: AppEpic = (action$, _, { ipcService }) =>
  action$.pipe(
    filter(Action.is.RANDOM_REQUEST),
    switchMap(() =>
      ipcService
        .publish(BackendAction.counter.RANDOM_REQUEST())
        .pipe(
          first(BackendAction.counter.is.RANDOM_GENERATED),
          map(Action.RANDOM_RECEIVED)
        )
    )
  );
