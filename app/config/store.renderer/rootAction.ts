import type { RouterAction } from 'connected-react-router';

import type { Action as DataAction } from '@/features/data-loader/store';
import type { Action as ModelAction } from '@/features/model-creator/store';
import type { Action as TrainingAction } from '@/features/model-trainer/store';

export type AppAction =
  | RouterAction
  | DataAction
  | ModelAction
  | TrainingAction;
