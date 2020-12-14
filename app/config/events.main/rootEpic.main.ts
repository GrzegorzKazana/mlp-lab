import { Observable, merge } from 'rxjs';

import { backendEpic as dataLoaderEpic } from '@/features/data-loader/store';

import type { AppAction } from '../store.renderer/rootAction';
import type { BackendRootService } from '../rootService.main';

export type BackendEpic = (
  action$: Observable<AppAction>,
  service: BackendRootService
) => Observable<AppAction>;

const epics = [dataLoaderEpic];

export default function createRootEpic(): BackendEpic {
  return (action$, service) => merge(...epics.map(e => e(action$, service)));
}
