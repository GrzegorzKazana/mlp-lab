import React from 'react';
import { FormControl, InputLabel, Button, Box } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { NumberField } from '@/common/components';
import { AttributeName } from '@/features/data-loader';

import { Training } from '../models';
import { AttributeMultiSelect, AttributeSingleSelect } from '../components';
import { useTrainingFormState } from '../hooks';

const useStyles = makeStyles({
  form: {
    flexGrow: 1,
    padding: '24px',
  },
  formControl: {
    minWidth: '120px',
  },
  submit: {
    display: 'flex',
    marginTop: '8px',
    justifyContent: 'flex-end',
  },
});

type Props = {
  dataAttributes: Array<AttributeName>;
  onSubmit: (training: Training) => void;
};

export const TrainingForm: React.FC<Props> = ({ dataAttributes, onSubmit }) => {
  const classes = useStyles();

  const {
    epochs,
    inputAttributes,
    targetAttribute,
    setEpochs,
    setInputAttributes,
    setTargetAttribute,
  } = useTrainingFormState(dataAttributes);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      epochs,
      inputAttributes,
      targetAttribute,
    });
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="input-attrs">Input attributes</InputLabel>
        <AttributeMultiSelect
          id="input-attrs"
          required
          error={inputAttributes.length === 0}
          attributes={dataAttributes}
          selectedAttributes={inputAttributes}
          onChange={setInputAttributes}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="target-attr">Target attribute</InputLabel>
        <AttributeSingleSelect
          id="target-attr"
          required
          error={!targetAttribute}
          attributes={dataAttributes}
          selectedAttribute={targetAttribute}
          onChange={setTargetAttribute}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <NumberField
          value={epochs}
          min={1}
          max={1000}
          label="Epochs"
          required
          error={Number.isNaN(epochs)}
          onChange={setEpochs}
        />
      </FormControl>

      <Box className={classes.submit}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<Send />}
        >
          Train
        </Button>
      </Box>
    </form>
  );
};
