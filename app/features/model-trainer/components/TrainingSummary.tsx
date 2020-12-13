import React from 'react';
import { Box, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { isNumber } from '@/common/utils';

import { TrainingHistoryEntry } from '../models';

const useStyles = makeStyles({
  headerFilePath: {
    fontStyle: 'italic',
  },
  textBold: {
    fontWeight: 'bold',
  },
});

const LazyChart = React.lazy(() =>
  import('@/common/components/BillBoardLineChart')
);

export const TrainingSummary: React.FC<{ entry: TrainingHistoryEntry }> = ({
  entry: { datasetMeta, metrics, timestamp, training },
}) => {
  const classes = useStyles();

  const loss = metrics.history.loss.filter(isNumber);
  const valLoss = metrics.history.val_loss.filter(isNumber);

  return (
    <Box p={3} flexGrow={1}>
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
      <React.Suspense fallback={<CircularProgress />}>
        <LazyChart
          data={{ 'Training loss': loss, 'Validation loss': valLoss }}
        />
      </React.Suspense>
    </Box>
  );
};
