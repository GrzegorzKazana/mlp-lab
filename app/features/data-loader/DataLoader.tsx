import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box } from '@material-ui/core';
import { Error } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { LoadDataButton } from './components';
import { DataPreview } from './containers';
import { Action, State, stateSelector } from './store.renderer';

const useStyles = makeStyles(() => ({
  centered: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function DataLoader() {
  const dispatch = useDispatch();
  const styles = useStyles();
  const state = useSelector(stateSelector);

  const requestData = () => dispatch(Action.DATA_PROMPT_REQUEST());

  return State.match(state, {
    IDLE: () => (
      <Box className={styles.centered}>
        <LoadDataButton onClick={requestData} />
      </Box>
    ),

    LOADED_META_LOADING_DATA: meta => (
      <DataPreview metaData={meta} onDataRequest={requestData} />
    ),

    LOADED: ({ meta, data }) => (
      <DataPreview metaData={meta} data={data} onDataRequest={requestData} />
    ),

    ERROR: err => (
      <Box className={styles.centered}>
        <Error fontSize="large" />
        <Typography variant="h6">{err.message}</Typography>
      </Box>
    ),
  });
}
