import { BrowserWindow, ipcMain } from 'electron';
import { Subject, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import createRootEpic from '../events.main/rootEpic.main';
import { AppAction } from '../store.renderer/rootAction';
import { backendRootService } from '../rootService.main';

const PUBLISH_CHANNEL = 'app-action-main-to-renderer';
const SUB_CHANNEL = 'app-action-renderer-to-main';

export default function registerEpic(win: BrowserWindow) {
  const ipcMainSubject = new Subject<AppAction>();
  const rootEpic = createRootEpic();

  fromEvent<[unknown, AppAction]>(ipcMain, SUB_CHANNEL)
    .pipe(map(([, event]) => event))
    .subscribe(ipcMainSubject);

  rootEpic(ipcMainSubject, backendRootService).subscribe(event =>
    win.webContents.send(PUBLISH_CHANNEL, event)
  );
}
