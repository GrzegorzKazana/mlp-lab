import { unionize, UnionOf, ofType } from 'unionize';

import { createIsAction } from '@/config/store.renderer/utils';
import { AsyncData } from '@/common/models/asyncData';
import { AppError } from '@/common/errors';

import { Data } from './models';

export const name = 'dataLoader';

const initialState = AsyncData.create<
  { filePath: string; data: Data },
  AppError
>();

export const Action = unionize(
  {
    DATA_FILE_REQUEST_PROMPT: {},
    DATA_FILE_REQUEST_PROMPT_CANCEL: {},
    DATA_FILE_LOADED: ofType<{ filePath: string; data: Data }>(),
    DATA_FILE_ERROR: ofType<AppError>(),
  },
  { tag: 'type' }
);

export type Action = UnionOf<typeof Action>;
type State = typeof initialState;
type Selector<T> = (state: { [name]: State }) => T;

export const reducer = (state = initialState, action: Action): State =>
  Action.match(action, {
    DATA_FILE_REQUEST_PROMPT: () => AsyncData.request(),
    DATA_FILE_REQUEST_PROMPT_CANCEL: () => AsyncData.create(),
    DATA_FILE_LOADED: loadedData => AsyncData.load(loadedData),
    DATA_FILE_ERROR: error => AsyncData.error(error),
    default: () => state,
  });

export const isDataAction = createIsAction(Action);
