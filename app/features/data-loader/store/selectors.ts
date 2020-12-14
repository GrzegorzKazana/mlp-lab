import { flow, identity } from 'fp-ts/es6/function';

import {
  Dataset,
  DatasetMetaData,
  AttributeName,
  indexColumnName,
} from '../models';
import { State, name } from './state';

type Selector<T> = (state: { [name]: State }) => T;

export const stateSelector: Selector<State> = state => state[name];

export const isDataLoadedSelector: Selector<boolean> = flow(
  stateSelector,
  State.is.LOADED
);

export const dataSelector: Selector<{
  meta: DatasetMetaData;
  data: Dataset;
} | null> = flow(
  stateSelector,
  State.match({ LOADED: identity, default: () => null })
);

export const dataAttributeNamesSelector: Selector<AttributeName[]> = flow(
  stateSelector,
  State.match({
    LOADED: ({ data }) =>
      data.attributes
        .map(({ name: attrName }) => attrName)
        .filter(attrName => attrName !== indexColumnName),

    default: () => [],
  })
);
