import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';

import { LinearProgressWithLabel } from '@/common/components';

type Props = {
  value: number;
  onCancel: () => void;
};

export const TrainginProgressDialogContent: React.FC<Props> = ({
  value,
  onCancel,
}) => {
  return (
    <>
      <DialogTitle>Training in progress</DialogTitle>
      <DialogContent>
        <LinearProgressWithLabel value={value} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </>
  );
};
