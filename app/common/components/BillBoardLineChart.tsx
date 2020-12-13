import React, { useMemo } from 'react';
import { line } from 'billboard.js';

import { BillBoardChart } from './BillBoardChart';

export const BillBoardLineChart: React.FC<{
  data: Record<string, number[]>;
}> = ({ data }) => {
  const config = useMemo<bb.ChartOptions>(
    () => ({
      data: {
        columns: Object.entries(data).map(([name, seriesData]) => [
          name,
          ...seriesData,
        ]),
        type: line(),
      },
    }),
    [data]
  );

  return <BillBoardChart config={config} />;
};

export default BillBoardLineChart;
