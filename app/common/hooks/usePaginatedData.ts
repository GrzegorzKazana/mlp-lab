import { useState, useMemo } from 'react';

type Options = {
  pageSize: number;
};

export function usePaginatedData<T>(data: T[], { pageSize }: Options) {
  const [currentPage, changePage] = useState(0);

  const currentData = useMemo(
    () => data.slice(currentPage * pageSize, currentPage * pageSize + pageSize),
    [data, currentPage, pageSize]
  );

  return { currentData, currentPage, changePage };
}
