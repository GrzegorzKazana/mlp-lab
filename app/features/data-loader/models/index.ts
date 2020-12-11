export type MetaData = { name: string; path: string };

export type Attribute = { name: string };
export type CsvRow = Record<string, number> & { index: number };
export type Csv = Array<CsvRow>;

export type Data = {
  attributes: Array<Attribute>;
  rows: Csv;
};
