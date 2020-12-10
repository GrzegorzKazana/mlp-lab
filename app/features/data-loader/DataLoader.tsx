import React from 'react';
import { useDispatch } from 'react-redux';

import { Action } from './store.renderer';

export default function DataLoader() {
  const dispatch = useDispatch();

  return (
    <article>
      <h3>Data page</h3>
      <button
        type="button"
        onClick={() => dispatch(Action.DATA_FILE_REQUEST_PROMPT())}
      >
        Load
      </button>
    </article>
  );
}
