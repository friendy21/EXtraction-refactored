import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, API_ENDPOINTS, USE_MOCK_DATA } from '../lib/api-client';
import { queryKeys } from '../lib/react-query';
import { mockApiResponses, mockDelay, mockError } from '../lib/mock-data';
import {
  Connection,
  ConnectionsListResponse,
  ConnectionDetailResponse,
  ConnectionHistoryResponse,
  CreateConnectionRequest,
  UpdateConnectionSettingsRequest,
  SyncConnectionRequest,
} from '../types/connections';

// Hook: List all connections
export const useConnections_list = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: queryKeys.connections.list(filters),
    queryFn: async (): Promise<ConnectionsListResponse> => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        return mockApiResponses.connectionsList();
      }
      
      const response = await api.get<ConnectionsListResponse>(
        API_ENDPOINTS.connections.list,
        { params: filters }
      );
      return response.data;
    },
  });
};

// Hook: Get connection details
export const useConnection_detail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.connections.detail(id),
    queryFn: async (): Promise<ConnectionDetailResponse> => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        return mockApiResponses.connectionDetail(id);
      }
      
      const response = await api.get<ConnectionDetailResponse>(
        API_ENDPOINTS.connections.detail(id)
      );
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook: Get connection history
export const useConnection_history = (id: string) => {
  return useQuery({
    queryKey: queryKeys.connections.history(id),
    queryFn: async (): Promise<ConnectionHistoryResponse> => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        return mockApiResponses.connectionHistory(id);
      }
      
      const response = await api.get<ConnectionHistoryResponse>(
        API_ENDPOINTS.connections.history(id)
      );
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook: Create new connection
export const useConnection_create = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateConnectionRequest): Promise<Connection> => {
      if (USE_MOCK_DATA) {
        await mockDelay(1000);
        // Simulate random success/failure for demo
        if (Math.random() > 0.8) {
          throw mockError('Failed to create connection', 400);
        }
        
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          name: data.name,
          type: data.type,
          status: 'connecting',
          settings: {
            auto_sync: true,
            sync_frequency: 'daily',
            data_retention_days: 90,
            enabled_features: [],
            ...data.settings,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        return newConnection;
      }
      
      const response = await api.post<Connection>(
        API_ENDPOINTS.connections.create,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch connections list
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.lists() });
      toast.success(`Connection "${data.name}" created successfully`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create connection';
      toast.error(message);
    },
  });
};

// Hook: Update connection settings
export const useConnection_updateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      settings 
    }: { 
      id: string; 
      settings: UpdateConnectionSettingsRequest 
    }): Promise<Connection> => {
      if (USE_MOCK_DATA) {
        await mockDelay(800);
        
        const existingConnection = mockApiResponses.connectionDetail(id).connection;
        const updatedConnection: Connection = {
          ...existingConnection,
          settings: { ...existingConnection.settings, ...settings.settings },
          updated_at: new Date().toISOString(),
        };
        
        return updatedConnection;
      }
      
      const response = await api.put<Connection>(
        API_ENDPOINTS.connections.updateSettings(id),
        settings
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific connection in cache
      queryClient.setQueryData(
        queryKeys.connections.detail(variables.id),
        { connection: data }
      );
      // Invalidate connections list to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.lists() });
      toast.success('Connection settings updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update connection settings';
      toast.error(message);
    },
  });
};

// Hook: Sync connection
export const useConnection_sync = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      options = {} 
    }: { 
      id: string; 
      options?: SyncConnectionRequest 
    }): Promise<{ message: string; sync_id: string }> => {
      if (USE_MOCK_DATA) {
        await mockDelay(1500);
        
        // Simulate sync process
        return {
          message: 'Sync initiated successfully',
          sync_id: `sync-${Date.now()}`,
        };
      }
      
      const response = await api.post<{ message: string; sync_id: string }>(
        API_ENDPOINTS.connections.sync(id),
        options
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate connection details and history to refresh status
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.history(variables.id) });
      toast.success(data.message);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to sync connection';
      toast.error(message);
    },
  });
};

// Hook: Delete connection (not in original spec but commonly needed)
export const useConnection_delete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK_DATA) {
        await mockDelay(600);
        return;
      }
      
      await api.delete(API_ENDPOINTS.connections.detail(id));
    },
    onSuccess: (_, id) => {
      // Remove from cache and invalidate list
      queryClient.removeQueries({ queryKey: queryKeys.connections.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.lists() });
      toast.success('Connection deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete connection';
      toast.error(message);
    },
  });
};

