import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Grid } from '@material-ui/core';

import { LayerCard } from './components';
import { LayerForm } from './containers';
import { Layer } from './models';
import { Action, Selectors } from './store';

export default function ModelCreator() {
  const dispatch = useDispatch();
  const model = useSelector(Selectors.stateSelector);

  const addLayer = (layer: Layer) => dispatch(Action.MODEL_ADD_LAYER(layer));

  const deleteLayer = (layer: Layer) => () =>
    dispatch(Action.MODEL_REMOVE_LAYER(layer));

  const moveLayerUp = (layer: Layer) => () =>
    dispatch(Action.MODEL_MOVE_LAYER_UP(layer));

  const moveLayerDown = (layer: Layer) => () =>
    dispatch(Action.MODEL_MOVE_LAYER_DOWN(layer));

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      style={{ flexGrow: 1 }}
    >
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        style={{ flexGrow: 1, padding: 16, maxWidth: 640 }}
      >
        <Typography variant="h4">Layers</Typography>
        {model.layers.map((layer, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === model.layers.length - 1;

          return (
            <LayerCard
              key={layer.id}
              layer={layer}
              canMoveUp={!isFirst}
              canMoveDown={!isLast}
              onDelete={deleteLayer(layer)}
              onMoveUp={moveLayerUp(layer)}
              onMoveDown={moveLayerDown(layer)}
            />
          );
        })}
        <LayerForm handleSubmit={addLayer} />
      </Grid>
    </Grid>
  );
}
