export const head = <T>(arr: T[]): T | undefined => arr[0];
export const last = <T>(arr: T[]): T | undefined => arr[arr.length - 1];
export const init = <T>(arr: T[]): T[] => arr.slice(0, arr.length - 1);
export const tail = <T>(arr: T[]): T[] => arr.slice(1);

export const mapObject = <R extends Record<string, unknown>, T>(
  obj: R,
  mapper: (value: R[keyof R], key: keyof R) => T
): { [K in keyof R]: T } =>
  (Object.entries(obj) as Array<[keyof R, R[keyof R]]>).reduce(
    (acc, [key, val]) => {
      acc[key] = mapper(val, key);
      return acc;
    },
    {} as { [K in keyof R]: T }
  );

export const noop = () => {};
export const identity = <T>(a: T): T => a;

export const inNullable = <T>(val: T | null | undefined): val is T =>
  val !== null && val !== undefined;
export const isNumber = (a: unknown): a is number => typeof a === 'number';

export const swapWithPrevious = <T>(arr: T[], pred: (a: T) => boolean): T[] => {
  const idx = arr.findIndex(pred);

  if (idx === -1 || idx === 0) return arr;

  const arrInit = arr.slice(0, idx - 1);
  const arrTail = arr.slice(idx + 1);

  return [...arrInit, arr[idx], arr[idx - 1], ...arrTail];
};

export const swapWithNext = <T>(arr: T[], pred: (a: T) => boolean): T[] => {
  const idx = arr.findIndex(pred);

  if (idx === -1 || idx === arr.length - 1) return arr;

  const arrInit = arr.slice(0, idx);
  const arrTail = arr.slice(idx + 2);

  return [...arrInit, arr[idx + 1], arr[idx], ...arrTail];
};

export const zip = <T, R>(arrA: T[], arrB: R[]): Array<[T, R]> => {
  const length = Math.min(arrA.length, arrB.length);

  return [...new Array(length).keys()].map(idx => [arrA[idx], arrB[idx]]);
};
