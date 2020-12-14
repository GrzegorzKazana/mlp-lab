import fs from 'fs';
import { Observable, from } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { dialog, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import { basename } from 'path';
import csv from 'csv-parser';

import { head } from '@/common/utils';

import { DatasetMetaData, CsvRow, Csv, Dataset } from '../models';

export class DatasetService {
  public loadCsvMetaData(): Observable<DatasetMetaData | null> {
    return this.showCsvFileDialog().pipe(
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

  public readCsv(path: string): Observable<Dataset> {
    return this.readCsvFromFs(path).pipe(
      map(rows => ({ attributes: Csv.getAttributes(rows), rows }))
    );
  }

  private showCsvFileDialog(): Observable<OpenDialogReturnValue> {
    const csvDialogOptions: OpenDialogOptions = {
      properties: ['openFile'],
      filters: [{ name: 'csvFilter', extensions: ['csv'] }],
    };

    return from(dialog.showOpenDialog(csvDialogOptions));
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
      map(rows => rows.map(CsvRow.fromRecord))
    );
  }
}
