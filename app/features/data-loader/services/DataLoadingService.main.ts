import { Observable, from, of } from 'rxjs';
import { map, mergeMap, reduce } from 'rxjs/operators';
import { dialog, OpenDialogOptions } from 'electron';
import fs from 'fs';
import csv from 'csv-parser';

import { head } from '@/common/utils';

import { Data } from '../models';

type CsvRow = Record<string, string>;
type Csv = Array<CsvRow>;

export default class DataLoadingService {
  private readonly csvDialogOptions: OpenDialogOptions = {
    properties: ['openFile'],
    filters: [{ name: 'csvFilter', extensions: ['csv'] }],
  };

  public loadCsv(): Observable<{ filePath: string; data: Data } | null> {
    const dialog$ = from(dialog.showOpenDialog(this.csvDialogOptions));

    return dialog$.pipe(
      mergeMap(res => {
        const filePath = head(res.filePaths);

        if (res.canceled || !filePath) return of(null);

        return this.readCsvFromFs(filePath).pipe(
          map(data => ({ filePath, data }))
        );
      })
    );
  }

  private readCsvFromFs(path: string): Observable<Csv> {
    return new Observable<CsvRow>(observer => {
      fs.createReadStream(path)
        .pipe(csv())
        .on('data', chunk => observer.next(chunk))
        .on('error', err => observer.error(err))
        .on('end', () => observer.complete());
    }).pipe(reduce((table, row) => [...table, row], [] as Csv));
  }
}
