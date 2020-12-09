import type { Unionized, UnionOf } from 'unionize';
import type { BackendAction } from './rootEvents.main';

// eslint-disable-next-line
export const createIsAction = <T extends Unionized<unknown, any, 'type'>>(
  actionUnion: T
) => (action: BackendAction): action is UnionOf<T> =>
  // eslint-disable-next-line
  Object.keys(actionUnion._Record as Record<string, string>).includes(
    action.type
  );
