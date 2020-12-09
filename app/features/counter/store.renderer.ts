import { unionize, UnionOf, ofType } from 'unionize';

import { createIsAction } from '@/config/store.renderer/utils';

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

export const isCounterAction = createIsAction(Action);

export const selectCount: Selector<number> = ({ counter }) => counter.value;
