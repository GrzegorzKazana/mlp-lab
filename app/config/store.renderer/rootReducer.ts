import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import {
  reducer as dataReducer,
  name as dataName,
} from '@/features/data-loader/store';
import {
  reducer as modelReducer,
  name as modelName,
} from '@/features/model-creator/store';
import {
  reducer as trainReducer,
  name as trainName,
} from '@/features/model-trainer/store';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    [dataName]: dataReducer,
    [modelName]: modelReducer,
    [trainName]: trainReducer,
  });
}

export type AppState = ReturnType<ReturnType<typeof createRootReducer>>;
