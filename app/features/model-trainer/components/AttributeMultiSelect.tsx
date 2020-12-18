import React from 'react';
import {
  Select,
  Input,
  Chip,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { AttributeName } from '@/features/data-loader';

const useStyles = makeStyles({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
});

type Props = {
  id?: string;
  required?: boolean;
  error?: boolean;
  attributes: AttributeName[];
  selectedAttributes: AttributeName[];
  onChange: (attrs: AttributeName[]) => void;
};

export const AttributeMultiSelect: React.FC<Props> = ({
  id,
  required,
  error,
  attributes,
  selectedAttributes,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <Select
      id={id}
      multiple
      error={error}
      required={required}
      input={<Input />}
      placeholder="Select attributes..."
      value={selectedAttributes}
      onChange={({ target }) => onChange(target.value as string[])}
      renderValue={selected => (
        <div className={classes.chips}>
          {(selected as string[]).map(value => (
            <Chip key={value} label={value} className={classes.chip} />
          ))}
        </div>
      )}
    >
      {attributes.map(attribute => (
        <MenuItem key={attribute} value={attribute}>
          <Checkbox checked={selectedAttributes.includes(attribute)} />
          <ListItemText primary={attribute} />
        </MenuItem>
      ))}
    </Select>
  );
};
