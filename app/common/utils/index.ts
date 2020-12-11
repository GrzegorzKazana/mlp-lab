export const head = <T>(arr: T[]): T | undefined => arr[0];

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
