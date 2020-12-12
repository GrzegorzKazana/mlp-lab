import { unionize, UnionOf, ofType } from 'unionize';
import { flow } from 'fp-ts/es6/function';

import { AppError } from '@/common/errors';
import { identity } from '@/common/utils';
import { createIsAction } from '@/config/store.renderer/utils';

import { AttributeName, Data, MetaData, indexColumnName } from './models';

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
export const isDataLoadedSelector: Selector<boolean> = flow(
  stateSelector,
  State.is.LOADED
);
export const dataSelector: Selector<{
  meta: MetaData;
  data: Data;
} | null> = flow(
  stateSelector,
  State.match({ LOADED: identity, default: () => null })
);
export const dataAttributeNamesSelector: Selector<AttributeName[]> = flow(
  stateSelector,
  State.match({
    LOADED: ({ data }) =>
      data.attributes
        .map(({ name: attrName }) => attrName)
        .filter(attrName => attrName !== indexColumnName),
    default: () => [],
  })
);
