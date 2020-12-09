import { Observable, merge } from 'rxjs';

import { epic as counterEpic } from '@/features/counter/events.main';
import { epic as dataLoaderEpic } from '@/features/data-loader/events.main';

import type { AppAction } from '../store.renderer/rootAction';
import type { BackendRootService } from '../rootService.main';

export type BackendEpic = (
  action$: Observable<AppAction>,
  service: BackendRootService
) => Observable<AppAction>;

const epics = [counterEpic, dataLoaderEpic];

export default function createRootEpic(): BackendEpic {
  return (action$, service) => merge(...epics.map(e => e(action$, service)));
}
