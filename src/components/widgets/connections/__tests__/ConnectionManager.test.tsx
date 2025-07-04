process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';
jest.resetModules();
jest.doMock('../../../../lib/api-client', () => {
  const actual = jest.requireActual('../../../../lib/api-client');
  return { ...actual, USE_MOCK_DATA: true };
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectionManager } from '../ConnectionManager';
import { mockApiResponses } from '../../../../lib/mock-data';
import { queryKeys } from '../../../../lib/react-query';

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  client.setQueryData(queryKeys.connections.list({}), mockApiResponses.connectionsList());
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

describe('ConnectionManager', () => {
  it('renders list of connections from mock data', async () => {
    renderWithClient(<ConnectionManager showAddButton={false} />);

    expect(await screen.findByText('Microsoft 365')).toBeInTheDocument();
    expect(screen.getByText('Google Workspace')).toBeInTheDocument();
  });
});
