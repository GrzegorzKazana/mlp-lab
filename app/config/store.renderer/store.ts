import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createEpicMiddleware } from 'redux-observable';
import { createStore, applyMiddleware, compose } from 'redux';
import { ipcRenderer } from 'electron';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import type { AppRootService } from '../rootService.renderer';
import type { AppAction } from './rootAction';
import type { AppState } from './rootReducer';
import type { AppEpic } from './rootEpic';

import { appSelectors, AppSelectors } from './selectors';
import createRootReducer from './rootReducer';
import createRootEpic from './rootEpic';
import createIpcMiddleware from '../ipc/ipc.renderer';
import { appRootService } from '../rootService.renderer';
import { isDev } from '../env';

export type Store = ReturnType<typeof configuredStore>;
export type { AppRootService, AppAction, AppState, AppEpic };

const composeEnhancers =
  (isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const history = createHashHistory();

export function configuredStore(initialState?: AppState) {
  const rootReducer = createRootReducer(history);
  const rootEpic = createRootEpic();

  const epicMiddleware = createEpicMiddleware<
    AppAction,
    AppAction,
    AppState,
    { services: AppRootService; selectors: AppSelectors }
  >({
    dependencies: { services: appRootService, selectors: appSelectors },
  });

  const middlewares = [
    routerMiddleware(history),
    epicMiddleware,
    createIpcMiddleware(ipcRenderer),
  ];

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  epicMiddleware.run(withHMR(rootEpic));
  acceptReducerHMR(store);

  return store;
}

function acceptReducerHMR<S extends Store>(store: S) {
  if (!module.hot || !isDev) return;

  module.hot.accept(
    './rootReducer',
    // eslint-disable-next-line global-require
    () => store.replaceReducer(require('./rootReducer').default)
  );
}

function withHMR(epic: AppEpic): AppEpic {
  // https://redux-observable.js.org/docs/recipes/HotModuleReplacement.html
  if (!module.hot || !isDev) return epic;

  const epic$ = new BehaviorSubject(epic);
  // Every time a new epic is given to epic$ it
  // will unsubscribe from the previous one then
  // call and subscribe to the new one because of
  // how switchMap works
  const hotReloadingEpic: AppEpic = (...args) =>
    epic$.pipe(switchMap(e => e(...args)));

  module.hot.accept('./rootEpic', () => {
    // eslint-disable-next-line global-require
    const nextRootEpic = require('./rootEpic').default;
    epic$.next(nextRootEpic);
  });

  return hotReloadingEpic;
}
