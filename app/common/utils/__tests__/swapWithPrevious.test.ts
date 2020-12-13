import { swapWithPrevious } from '../index';

describe('swapWithPrevious', () => {
  it('should do nothing with empty array', () => {
    expect(swapWithPrevious([], () => true)).toEqual([]);
  });

  it('should do nothing if no elements match', () => {
    expect(swapWithPrevious([1, 2, 3], i => i === 99)).toEqual([1, 2, 3]);
  });

  it('should do nothing if picked element is first', () => {
    expect(swapWithPrevious([1, 2, 3], i => i === 1)).toEqual([1, 2, 3]);
  });

  it('should do swap the elements', () => {
    expect(swapWithPrevious([1, 2, 3], i => i === 2)).toEqual([2, 1, 3]);
  });

  it('should do swap the elements if the element is the last', () => {
    expect(swapWithPrevious([1, 2, 3], i => i === 3)).toEqual([1, 3, 2]);
  });

  it('should ignore subsequent elements that match predicate', () => {
    expect(swapWithPrevious([1, 2, 3, 2], i => i === 2)).toEqual([2, 1, 3, 2]);
  });
});
