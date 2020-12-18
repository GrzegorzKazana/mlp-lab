import React, { useState } from 'react';
import { FormControl, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { NumberField } from '@/common/components';

import { Layer } from '../models';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    padding: 16,
  },
  input: {
    margin: 0,
    marginRight: 16,
    flexGrow: 1,
  },
});

type Props = {
  handleSubmit: (layer: Layer) => void;
};

export const LayerForm: React.FC<Props> = ({ handleSubmit }) => {
  const classes = useStyles();
  const [units, setUnits] = useState(10);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(Layer.ofSize(units));
  };

  return (
    <form className={classes.container} onSubmit={onSubmit}>
      <FormControl margin="normal" className={classes.input}>
        <NumberField
          value={units}
          min={1}
          max={1000}
          label="Units"
          required
          error={Number.isNaN(units)}
          onChange={setUnits}
        />
      </FormControl>
      <Button type="submit" variant="contained">
        Add
      </Button>
    </form>
  );
};
