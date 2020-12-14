import { head, mapObject } from '@/common/utils';

export const indexColumnName = 'index';

export type AttributeName = string;
export type Attribute = { name: AttributeName };

export type CsvRow = Record<string, number> & { [indexColumnName]: number };
export type Csv = Array<CsvRow>;

export const Csv = {
  getAttributes: (data: Csv): Attribute[] => {
    const firstRow = head(data);

    return firstRow ? Object.keys(firstRow).map(name => ({ name })) : [];
  },
};

export const CsvRow = {
  fromRecord: (rawRow: Record<string, string>, index: number): CsvRow => ({
    [indexColumnName]: index,
    ...mapObject(rawRow, Number.parseFloat),
  }),
};
