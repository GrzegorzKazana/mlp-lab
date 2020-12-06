import { Observable, merge } from 'rxjs';

import { epic } from '@/features/counter/events.main';

import type { BackendAction } from './rootEvents.main';
import type { BackendRootService } from '../rootService.main';

export type BackendEpic = (
  action$: Observable<BackendAction>,
  service: BackendRootService
) => Observable<BackendAction>;

const epics = [epic];

export default function createRootEpic(): BackendEpic {
  return (action$, service) => merge(...epics.map(e => e(action$, service)));
}
