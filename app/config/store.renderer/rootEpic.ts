import { combineEpics, Epic } from 'redux-observable';

import type { AppAction } from './rootAction';
import type { AppState } from './rootReducer';
import type { AppRootService } from '../rootService.renderer';

export type AppEpic = Epic<AppAction, AppAction, AppState, AppRootService>;

const rootEpic: AppEpic = combineEpics();

export default function createRootEpic() {
  return rootEpic;
}
