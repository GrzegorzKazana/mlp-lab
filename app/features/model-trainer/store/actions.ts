import { unionize, UnionOf, ofType } from 'unionize';

import { AppError } from '@/common/errors';
import { createIsAction } from '@/config/store.renderer/utils';

import { Training, TrainingHistoryEntry, Progress } from '../models';

export const Action = unionize(
  {
    TRAIN_MODEL_REQUEST: ofType<Training>(),
    TRAIN_MODEL_CANCEL: {},
    TRAIN_MODEL_PROGRESS: ofType<Progress>(),
    TRAIN_MODEL_FINISHED: ofType<TrainingHistoryEntry>(),
    TRAIN_MODEL_ERROR: ofType<AppError>(),
  },
  { tag: 'type' }
);

export type Action = UnionOf<typeof Action>;

export const isTrainingAction = createIsAction(Action);
