import { ipcRenderer } from 'electron';

import IpcService from './ipc/ipc.renderer';

const ipcService = new IpcService(ipcRenderer);

export const appRootService = {
  ipcService,
};

export type AppRootService = typeof appRootService;
