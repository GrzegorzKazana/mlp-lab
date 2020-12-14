import { nanoid } from 'nanoid';

export type LayerId = string;
export type Layer = { id: LayerId; numPerceptrons: number };

export const Layer = {
  ofSize: (numPerceptrons: number): Layer => ({ id: nanoid(), numPerceptrons }),
};
