import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Dialog } from '@material-ui/core';

import { Selectors as DataSelectors } from '@/features/data-loader';

import {
  TrainginProgressDialogContent,
  TrainginErrorDialogContent,
} from './components';
import { TrainingTabs } from './containers';
import { Training } from './models';
import { Action, State, Selectors } from './store';

export default function ModelCreator() {
  const dispatch = useDispatch();

  const state = useSelector(Selectors.stateSelector);
  const dataAttributes = useSelector(DataSelectors.dataAttributeNamesSelector);

  const isDialogOpen = State.is.TRAINING(state) || State.is.ERROR(state);

  const handleSubmit = (training: Training) =>
    dispatch(Action.TRAIN_MODEL_REQUEST(training));

  const cancelTraining = () => dispatch(Action.TRAIN_MODEL_CANCEL());

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="stretch"
      style={{ flexGrow: 1 }}
    >
      <TrainingTabs
        history={state.history}
        dataAttributes={dataAttributes}
        handleTrainingFormSubmit={handleSubmit}
      />
      <Dialog fullWidth maxWidth="md" open={isDialogOpen}>
        {State.match(state, {
          TRAINING: ({ progress }) => (
            <TrainginProgressDialogContent
              value={progress.value}
              onCancel={cancelTraining}
            />
          ),
          ERROR: ({ error }) => <TrainginErrorDialogContent error={error} />,
          default: () => null,
        })}
      </Dialog>
    </Grid>
  );
}
