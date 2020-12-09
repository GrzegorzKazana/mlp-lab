import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Action } from './store.renderer';

export default function DataLoader() {
  const dispatch = useDispatch();

  return (
    <div>
      <button
        type="button"
        onClick={() => dispatch(Action.DATA_FILE_REQUEST_PROMPT())}
      >
        Load
      </button>
    </div>
  );
}
