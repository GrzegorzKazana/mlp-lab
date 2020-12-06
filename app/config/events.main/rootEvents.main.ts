import { Action as BackendCounterAction } from '@/features/counter/events.main';

export type BackendAction = BackendCounterAction;

export const BackendAction = {
  counter: BackendCounterAction,
};
