import React from 'react';
import { TextField } from '@material-ui/core';

type Props = {
  value: number;
  label: string;
  required?: boolean;
  error?: boolean;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (num: number) => void;
};

export const NumberField: React.FC<Props> = ({
  value,
  label,
  error,
  required,
  onChange,
  ...inputProps
}) => {
  return (
    <TextField
      type="number"
      label={label}
      required={required}
      inputProps={{ pattern: '\\d+', ...inputProps }}
      error={error}
      value={Number.isNaN(value) ? '' : value}
      onChange={({ target }) =>
        onChange && onChange(Number.parseInt(target.value, 10))
      }
    />
  );
};
