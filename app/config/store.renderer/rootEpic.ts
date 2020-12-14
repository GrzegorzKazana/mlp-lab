import { combineEpics, Epic } from 'redux-observable';

import { appEpic as trainingEpic } from '@/features/model-trainer/store';

import type { AppAction } from './rootAction';
import type { AppState } from './rootReducer';
import type { AppSelectors } from './selectors';
import type { AppRootService } from '../rootService.renderer';

export type AppEpic = Epic<
  AppAction,
  AppAction,
  AppState,
  { services: AppRootService; selectors: AppSelectors }
>;

const rootEpic: AppEpic = combineEpics(trainingEpic);

export default function createRootEpic() {
  return rootEpic;
}
