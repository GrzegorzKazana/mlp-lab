import { mapObject, identity } from '../index';

describe('mapObject', () => {
  it('should do nothing for empty objects', () => {
    expect(mapObject({}, identity)).toEqual({});
  });

  it('should execute mapper on each property', () => {
    const fn = jest.fn();

    mapObject({ a: 1, b: 2 }, fn);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should supply args to mapper', () => {
    const fn = jest.fn();

    mapObject({ a: 1, b: 2 }, fn);

    expect(fn).toHaveBeenCalledWith(1, 'a');
    expect(fn).toHaveBeenCalledWith(2, 'b');
  });

  it('should correctly create output object', () => {
    const formatPercentage = (num: number) => `${num * 100}%`;
    const input = { foo: 0.1, bar: 0.99 };
    const expected = { foo: '10%', bar: '99%' };

    expect(mapObject(input, formatPercentage)).toEqual(expected);
  });
});
