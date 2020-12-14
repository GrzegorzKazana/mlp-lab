import { flow } from 'fp-ts/es6/function';

import { State, name } from './state';
import { Model } from '../models';

type Selector<T> = (state: { [name]: State }) => T;

export const stateSelector: Selector<Model> = state => state[name];

export const isModelValidSelector: Selector<boolean> = flow(
  stateSelector,
  ({ layers }) => layers.length > 0
);

export const modelSelector: Selector<Model | null> = flow(
  stateSelector,
  model => (model.layers.length > 0 ? model : null)
);
