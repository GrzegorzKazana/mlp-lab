import { unionize, UnionOf, ofType } from 'unionize';

import { AppError } from '@/common/errors';

import { Dataset, DatasetMetaData } from '../models';
import { Action } from './actions';

export const name = 'dataLoader';

export const State = unionize({
  IDLE: {},
  LOADED_META_LOADING_DATA: ofType<DatasetMetaData>(),
  LOADED: ofType<{ meta: DatasetMetaData; data: Dataset }>(),
  ERROR: ofType<AppError>(),
});

export type State = UnionOf<typeof State>;

const initialState = State.IDLE();

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
