import { unionize, UnionOf, ofType } from 'unionize';

import { AppError } from '@/common/errors';
import { createIsAction } from '@/config/store.renderer/utils';

import { Dataset, DatasetMetaData } from '../models';

export const Action = unionize(
  {
    DATA_PROMPT_REQUEST: {},
    DATA_PROMPT_SUBMIT: ofType<DatasetMetaData>(),
    DATA_PROMPT_CANCEL: {},
    DATA_PROMPT_ERROR: ofType<AppError>(),

    DATA_FILE_LOADED: ofType<Dataset>(),
    DATA_FILE_ERROR: ofType<AppError>(),
  },
  { tag: 'type', value: 'payload' }
);

export type Action = UnionOf<typeof Action>;

export const isDataAction = createIsAction(Action);
