export type MetaData = { name: string; path: string };

export const indexColumnName = 'index';

export type AttributeName = string;
export type Attribute = { name: AttributeName };
export type CsvRow = Record<string, number> & { [indexColumnName]: number };
export type Csv = Array<CsvRow>;

export type Data = {
  attributes: Array<Attribute>;
  rows: Csv;
};
