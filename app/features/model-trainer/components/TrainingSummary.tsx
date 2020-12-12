import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { TrainingHistoryEntry } from '../models';

const useStyles = makeStyles({
  headerFilePath: {
    fontStyle: 'italic',
  },
  textBold: {
    fontWeight: 'bold',
  },
});

export const TrainingSummary: React.FC<{ entry: TrainingHistoryEntry }> = ({
  entry: { datasetMeta, metrics, timestamp, training },
}) => {
  const classes = useStyles();

  return (
    <Box p={3}>
      <Typography variant="h4">{datasetMeta.name}</Typography>
      <Typography variant="subtitle1" className={classes.headerFilePath}>
        {datasetMeta.path}
      </Typography>
      <Typography variant="subtitle2" className={classes.headerFilePath}>
        {timestamp}
      </Typography>
      <Box my={1.5}>
        <Typography display="inline" variant="body1">{`Epochs: `}</Typography>
        <Typography
          display="inline"
          variant="body1"
          className={classes.textBold}
        >
          {training.epochs}
        </Typography>
      </Box>
    </Box>
  );
};
