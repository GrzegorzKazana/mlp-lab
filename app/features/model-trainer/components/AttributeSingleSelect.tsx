import React from 'react';
import { Select, Input, Chip, MenuItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { AttributeName } from '@/features/data-loader';

const useStyles = makeStyles({
  chip: {
    margin: 2,
  },
});

type Props = {
  id?: string;
  required?: boolean;
  error?: boolean;
  selectedAttribute: AttributeName;
  attributes: AttributeName[];
  onChange: (attrs: AttributeName) => void;
};

export const AttributeSingleSelect: React.FC<Props> = ({
  id,
  required,
  error,
  attributes,
  selectedAttribute,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <Select
      id={id}
      required={required}
      error={error}
      input={<Input />}
      value={selectedAttribute}
      onChange={({ target }) => onChange(target.value as string)}
      renderValue={selected => (
        <Chip label={selected as string} className={classes.chip} />
      )}
    >
      {attributes.map(attribute => (
        <MenuItem key={attribute} value={attribute}>
          <ListItemText primary={attribute} />
        </MenuItem>
      ))}
    </Select>
  );
};
