'use client';

import React from 'react';
import { Badge } from '../../../app/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertTriangle,
  RefreshCw 
} from 'lucide-react';
import { ConnectionStatus as ConnectionStatusType } from '../../../types/connections';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

const STATUS_CONFIG = {
  connected: {
    variant: 'green' as const,
    icon: CheckCircle2,
    text: 'Connected',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  disconnected: {
    variant: 'gray' as const,
    icon: XCircle,
    text: 'Disconnected',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  connecting: {
    variant: 'blue' as const,
    icon: Loader2,
    text: 'Connecting',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  error: {
    variant: 'red' as const,
    icon: AlertTriangle,
    text: 'Error',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  syncing: {
    variant: 'yellow' as const,
    icon: RefreshCw,
    text: 'Syncing',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
};

const SIZE_CONFIG = {
  sm: {
    iconSize: 'h-3 w-3',
    textSize: 'text-xs',
    padding: 'px-2 py-1',
  },
  md: {
    iconSize: 'h-4 w-4',
    textSize: 'text-sm',
    padding: 'px-3 py-1',
  },
  lg: {
    iconSize: 'h-5 w-5',
    textSize: 'text-base',
    padding: 'px-4 py-2',
  },
};

export function ConnectionStatus({ 
  status, 
  size = 'md', 
  showIcon = true, 
  showText = true,
  className = '' 
}: ConnectionStatusProps) {
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  if (!showIcon && !showText) {
    return null;
  }

  // Badge variant
  if (showText && !showIcon) {
    return (
      <Badge 
        variant={config.variant} 
        className={`${sizeConfig.textSize} ${sizeConfig.padding} ${className}`}
      >
        {config.text}
      </Badge>
    );
  }

  // Icon only
  if (showIcon && !showText) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Icon 
          className={`${sizeConfig.iconSize} ${config.color} ${
            status === 'connecting' || status === 'syncing' ? 'animate-spin' : ''
          }`} 
        />
      </div>
    );
  }

  // Both icon and text
  return (
    <div 
      className={`inline-flex items-center gap-1.5 ${sizeConfig.padding} rounded-full border ${config.bgColor} ${config.borderColor} ${className}`}
    >
      <Icon 
        className={`${sizeConfig.iconSize} ${config.color} ${
          status === 'connecting' || status === 'syncing' ? 'animate-spin' : ''
        }`} 
      />
      {showText && (
        <span className={`${sizeConfig.textSize} font-medium ${config.color}`}>
          {config.text}
        </span>
      )}
    </div>
  );
}

// Extended status component with additional details
interface ConnectionStatusDetailedProps extends ConnectionStatusProps {
  lastSync?: string;
  errorMessage?: string;
  showLastSync?: boolean;
}

export function ConnectionStatusDetailed({ 
  status, 
  lastSync, 
  errorMessage, 
  showLastSync = true,
  ...props 
}: ConnectionStatusDetailedProps) {
  return (
    <div className="space-y-2">
      <ConnectionStatus status={status} {...props} />
      
      {showLastSync && lastSync && status === 'connected' && (
        <div className="text-xs text-gray-500">
          Last sync: {new Date(lastSync).toLocaleString()}
        </div>
      )}
      
      {status === 'error' && errorMessage && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

// Status indicator for lists/tables
export function ConnectionStatusIndicator({ 
  status, 
  className = '' 
}: { 
  status: ConnectionStatusType; 
  className?: string; 
}) {
  const config = STATUS_CONFIG[status];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`w-2 h-2 rounded-full ${
          status === 'connected' ? 'bg-green-500' :
          status === 'error' ? 'bg-red-500' :
          status === 'connecting' || status === 'syncing' ? 'bg-blue-500 animate-pulse' :
          'bg-gray-400'
        }`} 
      />
      <span className={`text-sm ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
}

