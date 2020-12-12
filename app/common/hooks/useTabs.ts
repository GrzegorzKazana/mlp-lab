import React, { useCallback, useState } from 'react';

export function useTabs(initialTab = 0) {
  const [currentTab, setCurrentTab] = useState(initialTab);

  const renderTab = useCallback(
    (idx: number, elem: React.ReactNode) => (idx === currentTab ? elem : null),
    [currentTab]
  );

  return {
    currentTab,
    setCurrentTab,
    renderTab,
  };
}
