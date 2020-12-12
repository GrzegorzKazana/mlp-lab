import React from 'react';
import { Box, LinearProgress, Typography } from '@material-ui/core';

export const LinearProgressWithLabel: React.FC<{ value: number }> = ({
  value,
}) => {
  const valuePercentage = value * 100;
  const valueText = `${Math.round(valuePercentage)}%`;

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={valuePercentage} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {valueText}
        </Typography>
      </Box>
    </Box>
  );
};
