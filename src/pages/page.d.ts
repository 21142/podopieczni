import { ComponentType, ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

export type NextPageWithLayout<T = {}> = NextPage<T> & {
  getLayout?: (_page: ReactElement) => ReactNode;
  layout?: ComponentType;
};
