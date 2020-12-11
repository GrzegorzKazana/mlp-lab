import React from 'react';
import { Button } from '@material-ui/core';
import { FolderOpen } from '@material-ui/icons';

type Props = {
  onClick: () => void;
};

export const LoadDataButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<FolderOpen />}
      onClick={onClick}
    >
      Load dataset
    </Button>
  );
};
