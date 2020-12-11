import type { Action as CounterAction } from '@/features/counter/store.renderer';
import type { Action as DataAction } from '@/features/data-loader/store.renderer';
import type { Action as ModelAction } from '@/features/model-creator/store.renderer';
import type { Action as TrainingAction } from '@/features/model-trainer/store.renderer';

export type AppAction =
  | CounterAction
  | DataAction
  | ModelAction
  | TrainingAction;
