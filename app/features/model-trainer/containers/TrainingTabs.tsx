import React, { useMemo } from 'react';
import { Tabs, Tab, Theme } from '@material-ui/core';
import { useParams, useHistory } from 'react-router';
import { makeStyles } from '@material-ui/styles';

import routes from '@/config/routes';
import { AttributeName } from '@/features/data-loader';

import {
  Training,
  TrainingHistoryEntry,
  TrainingHistoryEntryId,
} from '../models';
import { TrainingForm } from './TrainingForm';
import { TrainingSummary } from '../components';

const useStyles = makeStyles<Theme>(theme => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
}));

type Props = {
  trainingHistory: TrainingHistoryEntry[];
  dataAttributes: AttributeName[];
  handleTrainingFormSubmit: (traingin: Training) => void;
};

const SCHEDULE_TRAINING_TAB_KEY = 'training-tab';

export const TrainingTabs: React.FC<Props> = ({
  trainingHistory,
  dataAttributes,
  handleTrainingFormSubmit,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { historyEntryId } = useParams<{
    historyEntryId?: TrainingHistoryEntryId;
  }>();

  const selectedEntryId = useMemo(
    () =>
      historyEntryId && trainingHistory.find(({ id }) => id === historyEntryId)
        ? historyEntryId
        : SCHEDULE_TRAINING_TAB_KEY,
    [historyEntryId, trainingHistory]
  );

  const navigateToTab = (id: TrainingHistoryEntryId) =>
    history.push(routes.createTrainingHistoryEntryUrl(id));

  const tabs = [
    <Tab
      key="training-tab"
      label="Schedule training"
      value={SCHEDULE_TRAINING_TAB_KEY}
    />,
    ...trainingHistory.map((entry, idx) => (
      <Tab
        key={entry.timestamp}
        label={`History #${trainingHistory.length - idx}`}
        value={entry.id}
      />
    )),
  ];

  return (
    <>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedEntryId}
        onChange={(_, tab) => navigateToTab(tab)}
        className={classes.tabs}
      >
        {tabs}
      </Tabs>
      {selectedEntryId === SCHEDULE_TRAINING_TAB_KEY && (
        <TrainingForm
          dataAttributes={dataAttributes}
          onSubmit={handleTrainingFormSubmit}
        />
      )}
      {trainingHistory
        .filter(({ id }) => id === selectedEntryId)
        .map(entry => (
          <TrainingSummary key={entry.timestamp} entry={entry} />
        ))}
    </>
  );
};
