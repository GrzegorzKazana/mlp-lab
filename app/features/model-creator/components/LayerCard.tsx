import React from 'react';
import { Typography, Card, Box, IconButton } from '@material-ui/core';
import { Delete, ArrowUpward, ArrowDownward } from '@material-ui/icons';

import { Layer } from '../models';

type Props = {
  layer: Layer;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export const LayerCard: React.FC<Props> = ({
  layer,
  canMoveUp,
  canMoveDown,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <Card style={{ margin: 8 }}>
      <Box p={1} display="flex" flexDirection="row" alignItems="center">
        <Box flexGrow={1} display="flex" justifyContent="center">
          <Typography variant="h5">{`${layer.numPerceptrons} units`}</Typography>
        </Box>
        <Box>
          <IconButton disabled={!canMoveUp} onClick={onMoveUp}>
            <ArrowUpward />
          </IconButton>
          <IconButton disabled={!canMoveDown} onClick={onMoveDown}>
            <ArrowDownward />
          </IconButton>
          <IconButton onClick={onDelete}>
            <Delete />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};
