import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Tab, Grid, Theme, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { dataAttributeNamesSelector } from '@/features/data-loader';

import { TrainingForm } from './containers';
import { Traning } from './models';
import { Action } from './store.renderer';

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
  const dataAttributes = useSelector(dataAttributeNamesSelector);

  const handleSubmit = (training: Traning) =>
    dispatch(Action.TRAIN_REQUEST(training));

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
        value={0}
        onChange={() => {}}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Item 0" />
        <Tab label="Item 1" />
      </Tabs>
      <TabPanel value={0} index={0}>
        <TrainingForm dataAttributes={dataAttributes} onSubmit={handleSubmit} />
      </TabPanel>
      <TabPanel value={0} index={1}>
        Item Two
      </TabPanel>
    </Grid>
  );
}

function TabPanel({
  value,
  index,
  children,
}: {
  value: number;
  index: number;
  children: React.ReactNode;
}) {
  return value === index && children ? <>{children}</> : null;
}
