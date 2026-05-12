import type {Mock as VitestMock} from 'vitest';

import type FetchMock from '../server/__test-helpers/fetch-mock';

declare global {
  // @ts-expect-error -- Compatibility global for tests that still use jest.* APIs.
  const jest: (typeof import('vitest'))['vi'];
  const fetchMock: typeof FetchMock;
  const IS_REACT_ACT_ENVIRONMENT: boolean;
}

export type JestMock<
  Fn extends (...args: any[]) => any = (...args: any[]) => any,
> = VitestMock<Fn>;

export {};
