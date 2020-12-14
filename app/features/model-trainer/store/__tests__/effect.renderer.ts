/* this eslint rule does not detect rxjs-marbles assertions */
/* eslint-disable jest/expect-expect */
import { of, throwError, Observable } from 'rxjs';
import { ActionsObservable, StateObservable } from 'redux-observable';
import { marbles, configure } from 'rxjs-marbles/jest';

import {
  AppAction,
  AppRootService,
  AppState,
} from '@/config/store.renderer/store';
import { createUnknownError } from '@/common/errors';
import { zip } from '@/common/utils';
import { AppSelectors } from '@/config/store.renderer/selectors';
import { Model } from '@/features/model-creator';
import { DatasetMetaData } from '@/features/data-loader';

import { Action, appEpic } from '../index';
import { ModelService } from '../../services';
import {
  Metrics,
  Training,
  TrainingHistoryEntry,
  TrainingProgress,
} from '../../models';

/**
 * loosely checks action equality,
 * allows for specyfying only subset of expected properties
 * useful when mocking whole payload is inconvinient
 */
const { marbles: marblesAssertLoose } = configure({
  assertDeepEqual: (receivedFrames, expectedFrames) => {
    type Frame = { notification: { value: unknown } };

    if (receivedFrames.length !== expectedFrames.length)
      throw new Error(
        `Observable do not have same number of emissions: ${receivedFrames.length} / ${expectedFrames.length}`
      );

    zip<Frame, Frame>(
      receivedFrames,
      expectedFrames
    ).forEach(([received, expected]) =>
      expect(received.notification.value).toEqual(
        expect.objectContaining(expected.notification.value)
      )
    );
  },
});

describe('data-loader effect', () => {
  const mockState$ = of(null);
  const mockTraining = {} as Training;
  const mockMetrics = {} as Metrics;
  const mockModel = {} as Model;
  const mockMetaData = {} as DatasetMetaData;
  const mockHistoryEntry = {} as TrainingHistoryEntry;

  const epic = (
    a$: Observable<AppAction>,
    deps: { services: AppRootService; selectors: AppSelectors }
  ) =>
    appEpic(
      a$ as ActionsObservable<AppAction>,
      (mockState$ as unknown) as StateObservable<AppState>,
      deps
    );

  it(
    'should do nothing if model or data is unavailable',
    marbles(m => {
      const values = {
        a: Action.TRAIN_MODEL_REQUEST(mockTraining),
      };

      const input$ = m.hot('   -a-', values);
      const expected$ = m.hot('---');

      const modelService = {} as ModelService;

      const selectors = ({
        model: { modelSelector: () => null },
        data: { dataSelector: () => null },
      } as unknown) as AppSelectors;

      const deps = {
        services: { modelService },
        selectors,
      };

      m.expect(epic(input$, deps)).toBeObservable(expected$);
    })
  );

  it(
    'should detect training error',
    marbles(m => {
      const values = {
        a: Action.TRAIN_MODEL_REQUEST(mockTraining),
        b: Action.TRAIN_MODEL_ERROR(createUnknownError(42)),
      };

      const input$ = m.hot('   -a-', values);
      const expected$ = m.hot('-b-', values);

      const modelService = ({
        trainModel: () => throwError(42),
      } as unknown) as ModelService;

      const selectors = ({
        model: { modelSelector: () => ({}) },
        data: { dataSelector: () => ({}) },
      } as unknown) as AppSelectors;

      const deps = {
        services: { modelService },
        selectors,
      };

      m.expect(epic(input$, deps)).toBeObservable(expected$);
    })
  );

  it(
    'should handle model emitting progress',
    marblesAssertLoose(m => {
      const values = {
        a: Action.TRAIN_MODEL_REQUEST(mockTraining),
        b: Action.TRAIN_MODEL_PROGRESS({ value: 0 }),
        c: Action.TRAIN_MODEL_PROGRESS({ value: 0.5 }),
        d: Action.TRAIN_MODEL_FINISHED(mockHistoryEntry),
      };

      const trainingProgress: Record<string, TrainingProgress> = {
        a: { completed: false, progress: { value: 0 } },
        b: { completed: false, progress: { value: 0.5 } },
        c: { completed: true, metrics: mockMetrics },
      };

      const input$ = m.hot('   -a-', values);
      const training$ = m.hot('-a-b-c', trainingProgress);
      const expected$ = m.hot('-b-c-d', values);

      const modelService = ({
        trainModel: () => training$,
      } as unknown) as ModelService;

      const selectors = ({
        model: { modelSelector: () => mockModel },
        data: { dataSelector: () => ({ meta: mockMetaData }) },
      } as unknown) as AppSelectors;

      const deps = {
        services: { modelService },
        selectors,
      };

      m.expect(epic(input$, deps)).toBeObservable(expected$);
    })
  );

  it(
    'should allow for training cancelling',
    marblesAssertLoose(m => {
      const values = {
        a: Action.TRAIN_MODEL_REQUEST(mockTraining),
        b: Action.TRAIN_MODEL_PROGRESS({ value: 0 }),
        c: Action.TRAIN_MODEL_PROGRESS({ value: 0.5 }),
        d: Action.TRAIN_MODEL_FINISHED(mockHistoryEntry),
        e: Action.TRAIN_MODEL_CANCEL(),
      };

      const trainingProgress: Record<string, TrainingProgress> = {
        a: { completed: false, progress: { value: 0 } },
        b: { completed: false, progress: { value: 0.5 } },
        c: { completed: true, metrics: mockMetrics },
      };

      const input$ = m.hot('   -a--e-', values);
      const training$ = m.hot('-a-b-c', trainingProgress);
      const expected$ = m.hot('-b-c--', values);

      const modelService = ({
        trainModel: () => training$,
      } as unknown) as ModelService;

      const selectors = ({
        model: { modelSelector: () => mockModel },
        data: { dataSelector: () => ({ meta: mockMetaData }) },
      } as unknown) as AppSelectors;

      const deps = {
        services: { modelService },
        selectors,
      };

      m.expect(epic(input$, deps)).toBeObservable(expected$);
    })
  );

  it(
    'should dissallow starting new training while previous is not finished',
    marblesAssertLoose(m => {
      const values = {
        a: Action.TRAIN_MODEL_REQUEST(mockTraining),
        b: Action.TRAIN_MODEL_PROGRESS({ value: 0 }),
        c: Action.TRAIN_MODEL_PROGRESS({ value: 0.5 }),
        d: Action.TRAIN_MODEL_FINISHED(mockHistoryEntry),
      };

      const trainingProgress: Record<string, TrainingProgress> = {
        a: { completed: false, progress: { value: 0 } },
        b: { completed: false, progress: { value: 0.5 } },
        c: { completed: true, metrics: mockMetrics },
      };

      const input$ = m.hot('   -a--a-', values);
      const training$ = m.hot('-a-b-c', trainingProgress);
      const expected$ = m.hot('-b-c-d', values);

      const modelService = ({
        trainModel: () => training$,
      } as unknown) as ModelService;

      const selectors = ({
        model: { modelSelector: () => mockModel },
        data: { dataSelector: () => ({ meta: mockMetaData }) },
      } as unknown) as AppSelectors;

      const deps = {
        services: { modelService },
        selectors,
      };

      m.expect(epic(input$, deps)).toBeObservable(expected$);
    })
  );
});
