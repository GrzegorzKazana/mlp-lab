import { renderHook, act } from '@testing-library/react-hooks';

import { usePaginatedData } from '../usePaginatedData';

describe('usePaginatedData hook', () => {
  const mockData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  it('should return all data if it fits on one page', () => {
    const { result } = renderHook(() =>
      usePaginatedData(mockData, { pageSize: 10 })
    );

    expect(result.current.currentPage).toEqual(0);
    expect(result.current.currentData).toEqual(mockData);
  });

  it('should return first chunk of data', () => {
    const { result } = renderHook(() =>
      usePaginatedData(mockData, { pageSize: 5 })
    );

    expect(result.current.currentPage).toEqual(0);
    expect(result.current.currentData).toEqual([0, 1, 2, 3, 4]);
  });

  it('should allow for changing page and return new currentData', () => {
    const { result } = renderHook(() =>
      usePaginatedData(mockData, { pageSize: 5 })
    );

    act(() => result.current.changePage(1));

    expect(result.current.currentPage).toEqual(1);
    expect(result.current.currentData).toEqual([5, 6, 7, 8, 9]);
  });
});
