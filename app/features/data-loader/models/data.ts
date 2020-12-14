import { Attribute, Csv } from './csv';

export type DatasetMetaData = { name: string; path: string };

export type Dataset = {
  attributes: Array<Attribute>;
  rows: Csv;
};
