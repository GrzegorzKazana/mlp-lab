import React from 'react';
import { DialogTitle, DialogContent, Typography } from '@material-ui/core';

import { AppError } from '@/common/errors';

export const TrainginErrorDialogContent: React.FC<{ error: AppError }> = ({
  error,
}) => {
  return (
    <>
      <DialogTitle>An error occured</DialogTitle>
      <DialogContent>
        <Typography>{error.message}</Typography>
      </DialogContent>
    </>
  );
};
