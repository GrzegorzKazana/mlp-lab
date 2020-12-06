import { IpcRenderer } from 'electron';
import { fromEvent, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { BackendAction } from '../events.main/rootEvents.main';

export default class IpcService {
  private readonly PUBLISH_CHANNEL = 'app-action-renderer-to-main';

  private readonly SUB_CHANNEL = 'app-action-main-to-renderer';

  constructor(private ipc: IpcRenderer) {}

  public publish(event: BackendAction): Observable<BackendAction> {
    this.ipc.send(this.PUBLISH_CHANNEL, event);

    return this.events();
  }

  private events(): Observable<BackendAction> {
    return fromEvent<[unknown, BackendAction]>(this.ipc, this.SUB_CHANNEL).pipe(
      map(([, event]) => event)
    );
  }
}
