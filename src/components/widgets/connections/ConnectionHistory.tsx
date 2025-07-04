'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Badge } from '../../../app/components/ui/badge';
import { Button } from '../../../app/components/ui/button';
import { 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Plus,
  Clock,
  Loader2 
} from 'lucide-react';
import { useConnection_history } from '../../../hooks/useConnections';
import { ConnectionHistory as ConnectionHistoryType } from '../../../types/connections';

interface ConnectionHistoryProps {
  connectionId: string;
  className?: string;
  maxItems?: number;
  showHeader?: boolean;
}

const ACTION_CONFIG = {
  created: {
    icon: Plus,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Created',
  },
  updated: {
    icon: RefreshCw,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    label: 'Updated',
  },
  synced: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Synced',
  },
  error: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Error',
  },
};

function HistoryItem({ item }: { item: ConnectionHistoryType }) {
  const config = ACTION_CONFIG[item.action];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 p-3 border-l-2 border-gray-100 hover:border-gray-200 transition-colors">
      <div className={`p-2 rounded-full ${config.bgColor} ${config.borderColor} border`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs">
            {config.label}
          </Badge>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(item.timestamp).toLocaleString()}
          </span>
        </div>
        
        <p className="text-sm text-gray-900 mb-1">{item.details}</p>
        
        {item.metadata && Object.keys(item.metadata).length > 0 && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(item.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key.replace(/_/g, ' ')}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ConnectionHistory({ 
  connectionId, 
  className = '', 
  maxItems = 10,
  showHeader = true 
}: ConnectionHistoryProps) {
  const { data: historyData, isLoading, error, refetch } = useConnection_history(connectionId);

  const history = historyData?.history || [];
  const displayHistory = maxItems ? history.slice(0, maxItems) : history;

  if (isLoading) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle className="text-lg">Connection History</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle className="text-lg">Connection History</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-red-600">
            <XCircle className="h-8 w-8 mb-2" />
            <span>Failed to load history</span>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Connection History</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {history.length} {history.length === 1 ? 'event' : 'events'}
            </span>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {displayHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <Clock className="h-8 w-8 mb-2" />
            <span>No history available</span>
            <p className="text-sm text-center mt-1">
              Connection events will appear here once they occur.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayHistory.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </div>
        )}
        
        {maxItems && history.length > maxItems && (
          <div className="p-4 border-t bg-gray-50 text-center">
            <span className="text-sm text-gray-600">
              Showing {maxItems} of {history.length} events
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for use in smaller spaces
export function ConnectionHistoryCompact({ 
  connectionId, 
  className = '' 
}: { 
  connectionId: string; 
  className?: string; 
}) {
  const { data: historyData, isLoading } = useConnection_history(connectionId);
  
  const history = historyData?.history || [];
  const recentHistory = history.slice(0, 3);

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-sm font-medium text-gray-700">Recent Activity</div>
        <div className="flex items-center text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </div>
      </div>
    );
  }

  if (recentHistory.length === 0) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-sm font-medium text-gray-700">Recent Activity</div>
        <div className="text-sm text-gray-500">No recent activity</div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-sm font-medium text-gray-700">Recent Activity</div>
      <div className="space-y-1">
        {recentHistory.map((item) => {
          const config = ACTION_CONFIG[item.action];
          const Icon = config.icon;
          
          return (
            <div key={item.id} className="flex items-center gap-2 text-sm">
              <Icon className={`h-3 w-3 ${config.color}`} />
              <span className="text-gray-900 truncate flex-1">{item.details}</span>
              <span className="text-xs text-gray-500">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

