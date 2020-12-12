import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Action, stateSelector } from './store.renderer';

export default function ModelCreator() {
  const dispatch = useDispatch();
  const model = useSelector(stateSelector);

  const [layerSize, setLayerSize] = useState(10);

  return (
    <article>
      <h3>Model creator</h3>
      {model.layers.map(({ id, numPerceptrons }) => (
        <p key={id}>{numPerceptrons}</p>
      ))}
      <label>
        Number of perceptrons
        <input
          type="number"
          min="1"
          max="100"
          value={layerSize}
          onChange={e => setLayerSize(Number.parseInt(e.target.value, 10))}
        />
      </label>
      <button
        type="button"
        onClick={() =>
          dispatch(Action.MODEL_ADD_LAYER({ numPerceptrons: layerSize }))
        }
      >
        Add
      </button>
    </article>
  );
}
