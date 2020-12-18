import { useState } from 'react';

import { init, last } from '@/common/utils';
import { AttributeName } from '@/features/data-loader';

export function useTrainingFormState(dataAttributes: AttributeName[]) {
  const [state, setState] = useState(() => ({
    epochs: 10,
    inputAttributes: init(dataAttributes),
    targetAttribute: last(dataAttributes) || '',
  }));

  const setEpochs = (epochs: number) => setState(s => ({ ...s, epochs }));

  const setInputAttributes = (inputAttributes: AttributeName[]) =>
    setState(s => ({ ...s, inputAttributes }));

  const setTargetAttribute = (targetAttribute: AttributeName) =>
    setState(s => ({ ...s, targetAttribute }));

  return { ...state, setEpochs, setInputAttributes, setTargetAttribute };
}
