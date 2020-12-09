export enum Status {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  LOADED = 'LOADED',
  ERROR = 'ERROR',
}

/**
 * This models represents values obtained via asynchronous requests.
 */
export type AsyncData<T, E> =
  | { status: Status.IDLE }
  | { status: Status.PENDING }
  | { status: Status.LOADED; data: T }
  | { status: Status.ERROR; error: E };

export const AsyncData = {
  create: <T, E = Error>(): AsyncData<T, E> => ({ status: Status.IDLE }),
  request: <T, E = Error>(): AsyncData<T, E> => ({ status: Status.PENDING }),
  load: <T, E = Error>(data: T): AsyncData<T, E> => ({
    status: Status.LOADED,
    data,
  }),
  error: <T, E = Error>(error: E): AsyncData<T, E> => ({
    status: Status.ERROR,
    error,
  }),

  map,
  match,
  is: {
    [Status.IDLE]: <T, E>(
      asyncData: AsyncData<T, E>
    ): asyncData is AsyncData<T, E> & { status: Status.IDLE } =>
      asyncData.status === Status.IDLE,
    [Status.PENDING]: <T, E>(
      asyncData: AsyncData<T, E>
    ): asyncData is AsyncData<T, E> & { status: Status.PENDING } =>
      asyncData.status === Status.PENDING,
    [Status.LOADED]: <T, E>(
      asyncData: AsyncData<T, E>
    ): asyncData is AsyncData<T, E> & { status: Status.LOADED } =>
      asyncData.status === Status.LOADED,
    [Status.ERROR]: <T, E>(
      asyncData: AsyncData<T, E>
    ): asyncData is AsyncData<T, E> & { status: Status.ERROR } =>
      asyncData.status === Status.ERROR,
  },
};

type Folder<T, E, R> = {
  [Status.IDLE]: () => R;
  [Status.PENDING]: () => R;
  [Status.LOADED]: (data: T) => R;
  [Status.ERROR]: (error: E) => R;
};

function match<T, E, R>(
  asyncData: AsyncData<T, E>,
  folders: Folder<T, E, R>
): R;
function match<T, E, R>(
  asyncData: AsyncData<T, E>,
  folders: Partial<Folder<T, E, R>>
): R | null;
function match<T, E, R>(
  asyncData: AsyncData<T, E>,
  folders: Partial<Folder<T, E, R>>,
  defaultVal: R
): R;
function match<T, E, R>(
  asyncData: AsyncData<T, E>,
  folders: Partial<Folder<T, E, R>>,
  defaultVal: R | null = null
): R | null {
  switch (asyncData.status) {
    case Status.IDLE:
      return folders.IDLE ? folders.IDLE() : defaultVal;
    case Status.PENDING:
      return folders.PENDING ? folders.PENDING() : defaultVal;
    case Status.LOADED:
      return folders.LOADED ? folders.LOADED(asyncData.data) : defaultVal;
    case Status.ERROR:
      return folders.ERROR ? folders.ERROR(asyncData.error) : defaultVal;
    default:
      return defaultVal;
  }
}

function map<T, E = Error>(
  asyncData: AsyncData<T, E>,
  mapper: (data: T) => T
): AsyncData<T, E> {
  return match(
    asyncData,
    {
      LOADED: data => AsyncData.load(mapper(data)),
    },
    asyncData
  );
}
