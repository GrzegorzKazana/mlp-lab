import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import {
  reducer as counterReducer,
  name as counterName,
} from '@/features/counter/store.renderer';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    [counterName]: counterReducer,
  });
}

export type AppState = ReturnType<ReturnType<typeof createRootReducer>>;
