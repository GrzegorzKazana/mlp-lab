import { IpcRenderer } from 'electron';
import { Middleware } from 'redux';

const PUBLISH_CHANNEL = 'app-action-renderer-to-main';
const SUB_CHANNEL = 'app-action-main-to-renderer';

export default function createIpcMiddleware(ipc: IpcRenderer): Middleware {
  return ({ dispatch }) => {
    ipc.on(SUB_CHANNEL, (_, action) => dispatch(action));

    return next => action => {
      ipc.send(PUBLISH_CHANNEL, action);

      return next(action);
    };
  };
}
