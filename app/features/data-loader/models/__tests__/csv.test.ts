import { Csv, CsvRow, indexColumnName } from '../csv';

describe('Csv models', () => {
  it('should extract correct attribute info from csv', () => {
    const input: Csv = [
      { [indexColumnName]: 0, foo: 1, bar: 42 },
      { [indexColumnName]: 1, foo: 12, bar: 99 },
    ];

    expect(Csv.getAttributes(input)).toEqual(
      expect.arrayContaining([{ name: 'foo' }, { name: 'bar' }])
    );
  });

  it('should properly parse csv from record', () => {
    const input = { foo: '123', bar: '11' };
    const index = 2;

    expect(CsvRow.fromRecord(input, index)).toEqual({
      foo: 123,
      bar: 11,
      [indexColumnName]: 2,
    });
  });
});
