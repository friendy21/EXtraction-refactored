'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { Badge } from '../../../app/components/ui/badge';
import { 
  CheckCircle2, 
  Cog, 
  Plus, 
  RefreshCw, 
  AlertTriangle,
  Loader2,
  Info 
} from 'lucide-react';
import { toast } from 'sonner';
import { useConnections_list, useConnection_sync } from '../../../hooks/useConnections';
import { Connection, ConnectionType } from '../../../types/connections';
import { ConnectionStatus } from './ConnectionStatus';
import { ConnectionWizard } from './ConnectionWizard';

interface ConnectionManagerProps {
  className?: string;
  showAddButton?: boolean;
  onConnectionSelect?: (connection: Connection) => void;
  onConnectionEdit?: (connection: Connection) => void;
  maxConnections?: number;
}

const CONNECTION_ICONS: Record<ConnectionType, React.ReactNode> = {
  microsoft365: (
    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-[#0078d4]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M2 2h10v10H2V2zm12 0h8v4h-8V2zm0 6h8v6h-8V8zM2 14h10v8H2v-8z"/>
      </svg>
    </div>
  ),
  googleWorkspace: (
    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-[#4285f4]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    </div>
  ),
  dropbox: (
    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-[#0061ff]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M6 2L12 6L6 10L0 6L6 2ZM18 2L24 6L18 10L12 6L18 2ZM0 14L6 10L12 14L6 18L0 14ZM12 14L18 10L24 14L18 18L12 14ZM6 19L12 15L18 19L12 23L6 19Z"/>
      </svg>
    </div>
  ),
  slack: (
    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-[#4a154b]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    </div>
  ),
  zoom: (
    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-[#2d8cff]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 14.432a1.44 1.44 0 0 1-1.44 1.44H7.872a1.44 1.44 0 0 1-1.44-1.44V9.568a1.44 1.44 0 0 1 1.44-1.44h8.256a1.44 1.44 0 0 1 1.44 1.44v4.864z"/>
      </svg>
    </div>
  ),
  jira: (
    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-[#0052cc]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M11.571 11.513H0a11.571 11.571 0 0 0 11.571 11.571V11.513zm.857-11.513v11.571H24A11.571 11.571 0 0 0 12.428 0z"/>
      </svg>
    </div>
  ),
  custom: (
    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-[#6366f1]">
      <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white" />
        <circle cx="50" cy="50" r="40" fill="#ede9fe" />
        <polyline points="40,40 30,50 40,60" stroke="#7c3aed" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="60,40 70,50 60,60" stroke="#7c3aed" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="45" y1="65" x2="55" y2="35" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  ),
};

export function ConnectionManager({ 
  className = '', 
  showAddButton = true, 
  onConnectionSelect,
  onConnectionEdit,
  maxConnections 
}: ConnectionManagerProps) {
  const [showWizard, setShowWizard] = useState(false);
  const { data: connectionsData, isLoading, error, refetch } = useConnections_list();
  const syncMutation = useConnection_sync();

  const connections = connectionsData?.connections || [];

  const handleSync = async (connection: Connection) => {
    try {
      await syncMutation.mutateAsync({ id: connection.id });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Connections refreshed');
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading connections...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="flex items-center justify-center p-8 text-red-600">
          <AlertTriangle className="h-8 w-8 mr-2" />
          <span>Failed to load connections</span>
        </div>
        <div className="flex justify-center">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const canAddMore = !maxConnections || connections.length < maxConnections;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Connections</h2>
          <p className="text-gray-600">
            Manage your data source connections ({connections.length} active)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {showAddButton && canAddMore && (
            <Button onClick={() => setShowWizard(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Connection
            </Button>
          )}
        </div>
      </div>

      {connections.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No connections yet</h3>
            <p className="text-gray-600 mb-4">
              Connect your data sources to start extracting and analyzing your organizational data.
            </p>
            {showAddButton && (
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Connection
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <Card 
              key={connection.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onConnectionSelect?.(connection)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                {CONNECTION_ICONS[connection.type]}
                <div className="flex-1">
                  <CardTitle className="text-lg">{connection.name}</CardTitle>
                  <p className="text-sm text-gray-600 capitalize">
                    {connection.type.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
                <ConnectionStatus status={connection.status} />
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Last sync:</span>
                    <span>
                      {connection.last_sync_at 
                        ? new Date(connection.last_sync_at).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto sync:</span>
                    <span>{connection.settings.auto_sync ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span className="capitalize">{connection.settings.sync_frequency}</span>
                  </div>
                </div>

                {connection.error_message && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {connection.error_message}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSync(connection);
                    }}
                    disabled={syncMutation.isPending}
                    className="flex-1"
                  >
                    {syncMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-1">Sync</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConnectionEdit?.(connection);
                    }}
                  >
                    <Cog className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle view details
                    }}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showWizard && (
        <ConnectionWizard
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

