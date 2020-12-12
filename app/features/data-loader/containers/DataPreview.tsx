import React from 'react';
import { Grid, Divider, CircularProgress, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { DataDescriptionHeader, DataTable } from '../components';
import { MetaData, Data } from '../models';

type Props = {
  metaData: MetaData;
  data?: Data;
  onDataRequest: () => void;
};

const useStyles = makeStyles(() => ({
  tablePagination: {
    flexShrink: 0,
  },
  container: {
    minHeight: 0,
    flexGrow: 1,
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const DataPreview: React.FC<Props> = ({
  metaData,
  data,
  onDataRequest,
}) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      className={classes.container}
    >
      <DataDescriptionHeader
        metaData={metaData}
        onDataRequest={onDataRequest}
      />
      <Divider />
      {data ? (
        <DataTable data={data} />
      ) : (
        <Box className={classes.content}>
          <CircularProgress />
        </Box>
      )}
    </Grid>
  );
};
