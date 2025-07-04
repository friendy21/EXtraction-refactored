'use client';

import React from 'react';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ConfigProvider } from '../../contexts/ConfigContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
      <ConfigProvider>
        {children}
      </ConfigProvider>
    </ReactQueryProvider>
  );
}

