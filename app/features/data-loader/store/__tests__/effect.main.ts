/* this eslint rule does not detect rxjs-marbles assertions */
/* eslint-disable jest/expect-expect */
import { EMPTY, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { marbles } from 'rxjs-marbles/jest';

import { createUnknownError } from '@/common/errors';

import { Action, backendEpic } from '../index';
import { DatasetService } from '../../services';
import { Dataset, DatasetMetaData, indexColumnName } from '../../models';

describe('data-loader effect', () => {
  const mockMetaData: DatasetMetaData = { name: 'asd', path: 'foo' };
  const mockDataset: Dataset = {
    attributes: [{ name: 'a' }, { name: 'index' }],
    rows: [{ a: 1, [indexColumnName]: 0 }],
  };

  const delayByNFrames = (n: number) => delay(n);

  it(
    'should allow for loading file metadata',
    marbles(m => {
      const values = {
        a: Action.DATA_PROMPT_REQUEST(),
        b: Action.DATA_PROMPT_SUBMIT(mockMetaData),
      };

      const datasetService = ({
        loadCsvMetaData: () => of(mockMetaData),
        readCsv: () => EMPTY,
      } as unknown) as DatasetService;

      const input$ = m.hot('   -a--', values);
      const expected$ = m.hot('-b--', values);

      m.expect(backendEpic(input$, { datasetService })).toBeObservable(
        expected$
      );
    })
  );

  it(
    'should handle error when presenting file dialog',
    marbles(m => {
      const values = {
        a: Action.DATA_PROMPT_REQUEST(),
        b: Action.DATA_PROMPT_ERROR(createUnknownError(42)),
      };

      const datasetService = ({
        loadCsvMetaData: () => throwError(createUnknownError(42)),
      } as unknown) as DatasetService;

      const input$ = m.hot('   -a--', values);
      const expected$ = m.hot('-b--', values);

      m.expect(backendEpic(input$, { datasetService })).toBeObservable(
        expected$
      );
    })
  );

  it(
    'should handle prompt being canceled',
    marbles(m => {
      const values = {
        a: Action.DATA_PROMPT_REQUEST(),
        b: Action.DATA_PROMPT_CANCEL(),
      };

      const datasetService: DatasetService = Object.assign(
        new DatasetService(),
        {
          showCsvFileDialog: (): ReturnType<
            DatasetService['showCsvFileDialog']
          > => of({ canceled: true, filePaths: [] }),
        }
      );

      const input$ = m.hot('   -a--', values);
      const expected$ = m.hot('-b--', values);

      m.expect(backendEpic(input$, { datasetService })).toBeObservable(
        expected$
      );
    })
  );

  it(
    'should emit both prompt submit and loaded if all goes well',
    marbles(m => {
      const values = {
        a: Action.DATA_PROMPT_REQUEST(),
        b: Action.DATA_PROMPT_SUBMIT(mockMetaData),
        c: Action.DATA_FILE_LOADED(mockDataset),
      };

      const datasetService = ({
        loadCsvMetaData: () => of(mockMetaData),
        readCsv: () => of(mockDataset),
      } as unknown) as DatasetService;

      const input$ = m.hot('   -a--', values);
      const expected$ = m.hot('-(bc)--', values);

      m.expect(backendEpic(input$, { datasetService })).toBeObservable(
        expected$
      );
    })
  );

  it(
    'should ignore result of the first request if next one happend before',
    marbles(m => {
      const values = {
        a: Action.DATA_PROMPT_REQUEST(),
        b: Action.DATA_PROMPT_SUBMIT(mockMetaData),
        c: Action.DATA_FILE_LOADED(mockDataset),
      };

      const datasetService = ({
        loadCsvMetaData: () => of(mockMetaData).pipe(delayByNFrames(3)),
        readCsv: () => of(mockDataset).pipe(delayByNFrames(1)),
      } as unknown) as DatasetService;

      const input$ = m.hot('   a-a------', values);
      const expected$ = m.hot('-----bc--', values);

      m.expect(backendEpic(input$, { datasetService })).toBeObservable(
        expected$
      );
    })
  );
});
