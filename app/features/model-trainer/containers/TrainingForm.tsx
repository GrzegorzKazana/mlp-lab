import React, { useState } from 'react';
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  ListItemText,
  Input,
  Chip,
  TextField,
  Button,
  Box,
} from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { init, last } from '@/common/utils';
import { AttributeName } from '@/features/data-loader';

import { Training } from '../models';

const useStyles = makeStyles({
  form: {
    flexGrow: 1,
    padding: '24px',
  },
  formControl: {
    minWidth: '120px',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
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
  const [inputAttributes, setInputAttributes] = useState<AttributeName[]>(() =>
    init(dataAttributes)
  );
  const [targetAttribute, setTargetAttribute] = useState<AttributeName>(
    () =>
      // TODO: guarantee that loaded data is not empty
      last(dataAttributes) || ''
  );
  const [epochs, setEpochs] = useState('10');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      epochs: Number.parseInt(epochs, 10),
      inputAttributes,
      targetAttribute,
    });
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="input-attrs">Input attributes</InputLabel>
        <Select
          id="input-attrs"
          multiple
          input={<Input />}
          placeholder="Select attributes..."
          value={inputAttributes}
          onChange={({ target }) =>
            setInputAttributes(target.value as string[])
          }
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
        >
          {dataAttributes.map(attribute => (
            <MenuItem key={attribute} value={attribute}>
              <Checkbox checked={inputAttributes.includes(attribute)} />
              <ListItemText primary={attribute} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="target-attr">Target attribute</InputLabel>
        <Select
          id="target-attr"
          input={<Input />}
          value={targetAttribute}
          onChange={({ target }) => setTargetAttribute(target.value as string)}
          renderValue={selected => (
            <Chip label={selected as string} className={classes.chip} />
          )}
        >
          {dataAttributes.map(attribute => (
            <MenuItem key={attribute} value={attribute}>
              <ListItemText primary={attribute} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Epochs"
          value={epochs}
          onChange={({ target }) =>
            /^\d*$/.test(target.value) && setEpochs(target.value)
          }
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
