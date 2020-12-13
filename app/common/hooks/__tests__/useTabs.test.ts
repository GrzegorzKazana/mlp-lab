import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

import { useTabs } from '../useTabs';

describe('useTabs hook', () => {
  it('should initialize with given tab', () => {
    const { result } = renderHook(() => useTabs(2));

    expect(result.current.currentTab).toBe(2);
  });

  it('should handle tab changes', () => {
    const { result } = renderHook(() => useTabs(0));

    act(() => result.current.setCurrentTab(1));

    expect(result.current.currentTab).toBe(1);
  });

  it('should wrap components with `render`', () => {
    const { result } = renderHook(() => useTabs(1));
    const { renderTab } = result.current;

    expect(renderTab(0, React.createElement('div'))).toBe(null);
    expect(renderTab(1, React.createElement('div'))).not.toBe(null);
  });
});
