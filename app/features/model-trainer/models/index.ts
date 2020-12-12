import { AttributeName } from '@/features/data-loader';

export type Sth = unknown;

export type Traning = {
  epochs: number;
  inputAttributes: Array<AttributeName>;
  targetAttribute: AttributeName;
};
