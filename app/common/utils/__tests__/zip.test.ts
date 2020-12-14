import { zip } from '../index';

describe('zip utility', () => {
  it('should work for arrays of same size', () => {
    expect(zip([1, 2, 3], ['a', 'b', 'c'])).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });

  it('should use shorter array as base otherwise', () => {
    expect(zip([1, 2, 3], ['a', 'b'])).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });

  it('should forward empty array', () => {
    expect(zip([], [])).toEqual([]);
  });
});
