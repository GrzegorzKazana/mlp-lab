import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import counterReducer, {
  name as counterName,
} from '@/features/counter/counterSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    [counterName]: counterReducer,
  });
}
