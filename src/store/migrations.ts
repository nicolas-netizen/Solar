import { AuthState } from '../types/auth';

export const migrations = {
  0: (state: AuthState) => ({
    ...state,
    version: 1,
  }),
  1: (state: AuthState) => ({
    ...state,
    version: 2,
  }),
};

export const version = 2;
