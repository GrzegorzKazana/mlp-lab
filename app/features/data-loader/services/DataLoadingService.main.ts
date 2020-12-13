import fs from 'fs';
import { Observable, from } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { dialog, OpenDialogOptions } from 'electron';
import { basename } from 'path';
import csv from 'csv-parser';

import { head, mapObject } from '@/common/utils';

import {
  MetaData,
  CsvRow,
  Csv,
  Data,
  Attribute,
  indexColumnName,
} from '../models';

export class DataLoadingService {
  private readonly csvDialogOptions: OpenDialogOptions = {
    properties: ['openFile'],
    filters: [{ name: 'csvFilter', extensions: ['csv'] }],
  };

  public loadCsvMetaData(): Observable<MetaData | null> {
    const dialog$ = from(dialog.showOpenDialog(this.csvDialogOptions));

    return dialog$.pipe(
      map(res => {
        const filePath = head(res.filePaths);

        if (res.canceled || !filePath) return null;

        return {
          name: basename(filePath),
          path: filePath,
        };
      })
    );
  }

  public readCsv(path: string): Observable<Data> {
    return this.readCsvFromFs(path).pipe(
      map(rows => ({ attributes: DataLoadingService.getHeaders(rows), rows }))
    );
  }

  private readCsvFromFs(path: string): Observable<Csv> {
    return new Observable<Record<string, string>>(observer => {
      const stream = fs.createReadStream(path);

      stream
        .pipe(csv())
        .on('data', chunk => observer.next(chunk))
        .on('error', err => observer.error(err))
        .on('end', () => observer.complete());

      return () => stream.close();
    }).pipe(
      toArray(),
      map(rows => rows.map(DataLoadingService.parseRow))
    );
  }

  private static getHeaders(data: Csv): Attribute[] {
    const firstRow = head(data);

    return firstRow ? Object.keys(firstRow).map(name => ({ name })) : [];
  }

  private static parseRow(row: Record<string, string>, index: number): CsvRow {
    return { [indexColumnName]: index, ...mapObject(row, Number.parseFloat) };
  }
}
