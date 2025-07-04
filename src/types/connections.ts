// Connection types based on integration map v2
export interface Connection {
  id: string;
  name: string;
  type: ConnectionType;
  status: ConnectionStatus;
  settings: ConnectionSettings;
  created_at: string;
  updated_at: string;
  last_sync_at?: string;
  error_message?: string;
}

export type ConnectionType = 
  | 'microsoft365'
  | 'googleWorkspace'
  | 'dropbox'
  | 'slack'
  | 'zoom'
  | 'jira'
  | 'custom';

export type ConnectionStatus = 
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'error'
  | 'syncing';

export interface ConnectionSettings {
  auto_sync: boolean;
  sync_frequency: 'hourly' | 'daily' | 'weekly';
  data_retention_days: number;
  enabled_features: string[];
  custom_config?: Record<string, any>;
}

export interface ConnectionHistory {
  id: string;
  connection_id: string;
  action: 'created' | 'updated' | 'synced' | 'error';
  timestamp: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface CreateConnectionRequest {
  name: string;
  type: ConnectionType;
  settings: Partial<ConnectionSettings>;
  credentials?: Record<string, any>;
}

export interface UpdateConnectionSettingsRequest {
  settings: Partial<ConnectionSettings>;
}

export interface SyncConnectionRequest {
  force?: boolean;
  data_types?: string[];
}

// Mock data interfaces
export interface MockConnectionData {
  connections: Connection[];
  history: ConnectionHistory[];
}

// API response types
export interface ConnectionsListResponse {
  connections: Connection[];
  total: number;
  page: number;
  per_page: number;
}

export interface ConnectionDetailResponse {
  connection: Connection;
}

export interface ConnectionHistoryResponse {
  history: ConnectionHistory[];
  total: number;
}

