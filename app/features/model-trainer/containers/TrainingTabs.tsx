import React from 'react';
import { Tabs, Tab, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useTabs } from '@/common/hooks';
import { AttributeName } from '@/features/data-loader';

import { Training, TrainingHistoryEntry } from '../models';
import { TrainingForm } from './TrainingForm';
import { TrainingSummary } from '../components';

const useStyles = makeStyles<Theme>(theme => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
}));

type Props = {
  history: TrainingHistoryEntry[];
  dataAttributes: AttributeName[];
  handleTrainingFormSubmit: (traingin: Training) => void;
};

export const TrainingTabs: React.FC<Props> = ({
  history,
  dataAttributes,
  handleTrainingFormSubmit,
}) => {
  const classes = useStyles();
  const { currentTab, setCurrentTab, renderTab } = useTabs();

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
      onSubmit={handleTrainingFormSubmit}
    />,
    ...history.map(entry => (
      <TrainingSummary key={entry.timestamp} entry={entry} />
    )),
  ];

  return (
    <>
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
    </>
  );
};
