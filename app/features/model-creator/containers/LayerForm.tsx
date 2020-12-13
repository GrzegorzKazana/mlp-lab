import React, { useState } from 'react';
import { FormControl, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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
  const [units, setUnits] = useState('10');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const size = Number.parseInt(units, 10);
    handleSubmit(Layer.ofSize(size));
  };

  return (
    <form className={classes.container} onSubmit={onSubmit}>
      <FormControl margin="normal" className={classes.input}>
        <TextField
          label="Units"
          value={units}
          onChange={({ target }) =>
            /^\d*$/.test(target.value) && setUnits(target.value)
          }
        />
      </FormControl>
      <Button type="submit" variant="contained">
        Add
      </Button>
    </form>
  );
};
