import React from 'react';
import { Grid, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { LoadDataButton } from './LoadDataButton';
import { MetaData } from '../models';

type Props = {
  metaData: MetaData;
  onDataRequest: () => void;
};

const useStyles = makeStyles({
  header: {
    padding: '16px',
    flexShrink: 0,
  },
  headerFilePath: {
    fontStyle: 'italic',
  },
});

export const DataDescriptionHeader: React.FC<Props> = ({
  metaData,
  onDataRequest,
}) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.header}
    >
      <Box>
        <Typography variant="h4">{metaData.name}</Typography>
        <Typography variant="subtitle1" className={classes.headerFilePath}>
          {metaData.path}
        </Typography>
      </Box>
      <LoadDataButton onClick={onDataRequest} />
    </Grid>
  );
};
