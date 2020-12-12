import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tabs,
  Tab,
  Grid,
  Theme,
  Box,
  Typography,
  Dialog,
  LinearProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useTabs } from '@/common/hooks';
import { dataAttributeNamesSelector } from '@/features/data-loader';

import { TrainingForm } from './containers';
import { Training } from './models';
import {
  Action,
  errorSelector,
  historySelector,
  stateSelector,
  trainingProgressSelector,
} from './store.renderer';

const useStyles = makeStyles<Theme>(theme => ({
  container: {
    flexGrow: 1,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
}));

export default function ModelCreator() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { currentTab, setCurrentTab, renderTab } = useTabs();

  const dataAttributes = useSelector(dataAttributeNamesSelector);
  const history = useSelector(historySelector);
  const trainingProgress = useSelector(trainingProgressSelector);
  const trainingError = useSelector(errorSelector);

  const handleSubmit = (training: Training) =>
    dispatch(Action.TRAIN_MODEL_REQUEST(training));

  const cancelTraining = () => dispatch(Action.TRAIN_MODEL_CANCEL());

  const tabs = [
    <Tab key="training-tab" label="Schedule training" />,
    ...history.map((entry, idx) => (
      <Tab key={entry.timestamp} label={`History #${history.length - idx}`} />
    )),
  ];

  const tabsContents = [
    <TrainingForm
      key="training-form"
      dataAttributes={dataAttributes}
      onSubmit={handleSubmit}
    />,
    ...history.map(entry => <div key={entry.timestamp}>{entry.timestamp}</div>),
  ];

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="stretch"
      className={classes.container}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={currentTab}
        onChange={(_, tab) => setCurrentTab(tab)}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {tabs}
      </Tabs>
      {tabsContents.map((content, idx) => renderTab(idx, content))}
      <Dialog fullWidth maxWidth="md" open={!!trainingProgress}>
        <DialogTitle>Training in progress</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress
                variant="determinate"
                value={trainingProgress ? trainingProgress.value * 100 : 0}
              />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">{`${Math.round(
                trainingProgress ? trainingProgress.value * 100 : 0
              )}%`}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelTraining} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
