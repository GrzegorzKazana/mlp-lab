import { State, name } from './state';

type Selector<T> = (state: { [name]: State }) => T;

export const stateSelector: Selector<State> = state => state[name];
