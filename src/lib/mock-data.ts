import { 
  Connection, 
  ConnectionHistory, 
  ConnectionsListResponse, 
  ConnectionDetailResponse, 
  ConnectionHistoryResponse,
  MockConnectionData 
} from '../types/connections';

// Mock connections data
export const mockConnections: Connection[] = [
  {
    id: 'conn-1',
    name: 'Microsoft 365',
    type: 'microsoft365',
    status: 'connected',
    settings: {
      auto_sync: true,
      sync_frequency: 'daily',
      data_retention_days: 90,
      enabled_features: ['emails', 'calendar', 'teams', 'onedrive'],
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-07-01T14:30:00Z',
    last_sync_at: '2024-07-04T06:00:00Z',
  },
  {
    id: 'conn-2',
    name: 'Google Workspace',
    type: 'googleWorkspace',
    status: 'connected',
    settings: {
      auto_sync: true,
      sync_frequency: 'hourly',
      data_retention_days: 60,
      enabled_features: ['gmail', 'calendar', 'drive', 'meet'],
    },
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-06-28T11:45:00Z',
    last_sync_at: '2024-07-04T05:00:00Z',
  },
  {
    id: 'conn-3',
    name: 'Slack Workspace',
    type: 'slack',
    status: 'error',
    settings: {
      auto_sync: false,
      sync_frequency: 'daily',
      data_retention_days: 30,
      enabled_features: ['messages', 'channels', 'files'],
    },
    created_at: '2024-03-10T16:20:00Z',
    updated_at: '2024-07-03T08:15:00Z',
    error_message: 'Authentication token expired. Please reconnect.',
  },
  {
    id: 'conn-4',
    name: 'Dropbox Business',
    type: 'dropbox',
    status: 'connecting',
    settings: {
      auto_sync: true,
      sync_frequency: 'weekly',
      data_retention_days: 120,
      enabled_features: ['files', 'sharing'],
    },
    created_at: '2024-07-04T06:30:00Z',
    updated_at: '2024-07-04T06:30:00Z',
  },
  {
    id: 'conn-5',
    name: 'Zoom Pro',
    type: 'zoom',
    status: 'disconnected',
    settings: {
      auto_sync: false,
      sync_frequency: 'daily',
      data_retention_days: 45,
      enabled_features: ['meetings', 'recordings'],
    },
    created_at: '2024-04-20T12:00:00Z',
    updated_at: '2024-06-15T10:30:00Z',
  },
];

// Mock connection history
export const mockConnectionHistory: ConnectionHistory[] = [
  {
    id: 'hist-1',
    connection_id: 'conn-1',
    action: 'synced',
    timestamp: '2024-07-04T06:00:00Z',
    details: 'Successfully synced 1,234 emails and 45 calendar events',
    metadata: { emails: 1234, calendar_events: 45 },
  },
  {
    id: 'hist-2',
    connection_id: 'conn-1',
    action: 'updated',
    timestamp: '2024-07-01T14:30:00Z',
    details: 'Updated sync frequency to daily',
  },
  {
    id: 'hist-3',
    connection_id: 'conn-2',
    action: 'synced',
    timestamp: '2024-07-04T05:00:00Z',
    details: 'Successfully synced 892 emails and 23 drive files',
    metadata: { emails: 892, drive_files: 23 },
  },
  {
    id: 'hist-4',
    connection_id: 'conn-3',
    action: 'error',
    timestamp: '2024-07-03T08:15:00Z',
    details: 'Authentication failed: Token expired',
  },
  {
    id: 'hist-5',
    connection_id: 'conn-4',
    action: 'created',
    timestamp: '2024-07-04T06:30:00Z',
    details: 'Connection created and authentication initiated',
  },
];

// Mock API responses
export const mockApiResponses = {
  connectionsList: (): ConnectionsListResponse => ({
    connections: mockConnections,
    total: mockConnections.length,
    page: 1,
    per_page: 10,
  }),

  connectionDetail: (id: string): ConnectionDetailResponse => {
    const connection = mockConnections.find(c => c.id === id);
    if (!connection) {
      throw new Error(`Connection with id ${id} not found`);
    }
    return { connection };
  },

  connectionHistory: (id: string): ConnectionHistoryResponse => {
    const history = mockConnectionHistory.filter(h => h.connection_id === id);
    return {
      history,
      total: history.length,
    };
  },
};

// Mock API delay simulation
export const mockDelay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock error simulation
export const mockError = (message: string, status: number = 500) => {
  const error = new Error(message) as any;
  error.response = { status, data: { message } };
  return error;
};

