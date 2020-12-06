import { BrowserWindow, ipcMain } from 'electron';
import { Subject, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import createRootEpic from '../events.main/rootEpic.main';
import { BackendAction } from '../events.main/rootEvents.main';
import { backendRootService } from '../rootService.main';

const PUBLISH_CHANNEL = 'app-action-main-to-renderer';
const SUB_CHANNEL = 'app-action-renderer-to-main';

export default function registerEpic(win: BrowserWindow) {
  const ipcMainSubject = new Subject<BackendAction>();
  const rootEpic = createRootEpic();

  fromEvent<[unknown, BackendAction]>(ipcMain, SUB_CHANNEL)
    .pipe(map(([, event]) => event))
    .subscribe(ipcMainSubject);

  rootEpic(ipcMainSubject, backendRootService).subscribe(event =>
    win.webContents.send(PUBLISH_CHANNEL, event)
  );
}
