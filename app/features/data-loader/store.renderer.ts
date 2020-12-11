import { unionize, UnionOf, ofType } from 'unionize';

import { createIsAction } from '@/config/store.renderer/utils';
import { AppError } from '@/common/errors';

import { Data, MetaData } from './models';

export const name = 'dataLoader';

export const State = unionize({
  IDLE: {},
  LOADED_META_LOADING_DATA: ofType<MetaData>(),
  LOADED: ofType<{ meta: MetaData; data: Data }>(),
  ERROR: ofType<AppError>(),
});

const initialState = State.IDLE();

export const Action = unionize(
  {
    DATA_PROMPT_REQUEST: {},
    DATA_PROMPT_SUBMIT: ofType<MetaData>(),
    DATA_PROMPT_CANCEL: {},
    DATA_PROMPT_ERROR: ofType<AppError>(),

    DATA_FILE_LOADED: ofType<Data>(),
    DATA_FILE_ERROR: ofType<AppError>(),
  },
  { tag: 'type', value: 'payload' }
);

export type Action = UnionOf<typeof Action>;
type State = typeof initialState;
type Selector<T> = (state: { [name]: State }) => T;

export const reducer = (state = initialState, action: Action): State =>
  Action.match(action, {
    DATA_PROMPT_SUBMIT: meta => State.LOADED_META_LOADING_DATA(meta),
    DATA_PROMPT_ERROR: err => State.ERROR(err),
    DATA_FILE_LOADED: data =>
      State.is.LOADED_META_LOADING_DATA(state)
        ? State.LOADED({ meta: state, data })
        : state,
    default: () => state,
  });

export const isDataAction = createIsAction(Action);

export const stateSelector: Selector<State> = state => state[name];
