import { unionize, UnionOf, ofType } from 'unionize';

import { AppError } from '@/common/errors';

import { TrainingHistoryEntry, Progress } from '../models';
import { Action } from './actions';

export const name = 'modelTrainer';

export const State = unionize({
  IDLE: ofType<{ history: TrainingHistoryEntry[] }>(),
  TRAINING: ofType<{ progress: Progress; history: TrainingHistoryEntry[] }>(),
  ERROR: ofType<{ error: AppError; history: TrainingHistoryEntry[] }>(),
});

export type State = UnionOf<typeof State>;

const initialState = State.IDLE({ history: [] });

export const reducer = (state = initialState, action: Action): State =>
  Action.match(action, {
    TRAIN_MODEL_CANCEL: () => State.IDLE({ history: state.history }),

    TRAIN_MODEL_PROGRESS: progress =>
      State.TRAINING({ progress, history: state.history }),

    TRAIN_MODEL_FINISHED: entry =>
      State.IDLE({ history: [entry, ...state.history] }),

    default: () => state,
  });
