import React, { useRef, useEffect } from 'react';
import bb from 'billboard.js';

export const BillBoardChart: React.FC<{ config: bb.ChartOptions }> = ({
  config,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = bb.generate({
      ...config,
      bindto: ref.current,
    });

    return () => chart.unload();
  }, [config]);

  return <div ref={ref} />;
};
