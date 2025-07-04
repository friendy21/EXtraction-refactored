'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../app/components/ui/dialog';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Label } from '../../../app/components/ui/label';
import { Textarea } from '../../../app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Badge } from '../../../app/components/ui/badge';
import { 
  CheckCircle2, 
  X, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertTriangle,
  ArrowLeft,
  ArrowRight 
} from 'lucide-react';
import { toast } from 'sonner';
import { useConnection_create } from '../../../hooks/useConnections';
import { ConnectionType, CreateConnectionRequest } from '../../../types/connections';

interface ConnectionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ConnectionTypeOption {
  type: ConnectionType;
  name: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
}

const CONNECTION_TYPES: ConnectionTypeOption[] = [
  {
    type: 'microsoft365',
    name: 'Microsoft 365',
    description: 'Connect to Outlook, Teams, OneDrive, and SharePoint',
    popular: true,
    icon: (
      <div className="w-8 h-8 flex items-center justify-center rounded bg-[#0078d4]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M2 2h10v10H2V2zm12 0h8v4h-8V2zm0 6h8v6h-8V8zM2 14h10v8H2v-8z"/>
        </svg>
      </div>
    ),
  },
  {
    type: 'googleWorkspace',
    name: 'Google Workspace',
    description: 'Connect to Gmail, Google Drive, Calendar, and Meet',
    popular: true,
    icon: (
      <div className="w-8 h-8 flex items-center justify-center rounded bg-[#4285f4]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        </svg>
      </div>
    ),
  },
  {
    type: 'slack',
    name: 'Slack',
    description: 'Connect to Slack channels, messages, and files',
    popular: true,
    icon: (
      <div className="w-8 h-8 flex items-center justify-center rounded bg-[#4a154b]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"/>
        </svg>
      </div>
    ),
  },
  {
    type: 'dropbox',
    name: 'Dropbox',
    description: 'Connect to Dropbox files and folders',
    icon: (
      <div className="w-8 h-8 flex items-center justify-center rounded bg-[#0061ff]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M6 2L12 6L6 10L0 6L6 2Z"/>
        </svg>
      </div>
    ),
  },
  {
    type: 'zoom',
    name: 'Zoom',
    description: 'Connect to Zoom meetings and recordings',
    icon: (
      <div className="w-8 h-8 flex items-center justify-center rounded bg-[#2d8cff]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      </div>
    ),
  },
  {
    type: 'jira',
    name: 'Jira',
    description: 'Connect to Jira projects and issues',
    icon: (
      <div className="w-8 h-8 flex items-center justify-center rounded bg-[#0052cc]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M11.571 11.513H0a11.571 11.571 0 0 0 11.571 11.571V11.513z"/>
        </svg>
      </div>
    ),
  },
  {
    type: 'custom',
    name: 'Custom API',
    description: 'Connect to any REST API endpoint',
    icon: (
      <div className="w-8 h-8 flex items-center justify-center rounded bg-[#6366f1]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
    ),
  },
];

type WizardStep = 'select-type' | 'configure' | 'test' | 'complete';

export function ConnectionWizard({ isOpen, onClose, onSuccess }: ConnectionWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('select-type');
  const [selectedType, setSelectedType] = useState<ConnectionType | null>(null);
  const [connectionName, setConnectionName] = useState('');
  const [configuration, setConfiguration] = useState<Record<string, any>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const createMutation = useConnection_create();

  const handleTypeSelect = (type: ConnectionType) => {
    setSelectedType(type);
    const typeOption = CONNECTION_TYPES.find(t => t.type === type);
    setConnectionName(typeOption?.name || '');
    setCurrentStep('configure');
    
    // Initialize configuration based on type
    if (type === 'custom') {
      setConfiguration({
        apiUrl: '',
        apiKey: '',
        authType: 'Bearer',
        headers: '{"Content-Type": "application/json"}',
      });
    } else {
      setConfiguration({
        clientId: '',
        clientSecret: '',
        redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/auth/${type}/callback` : '',
      });
    }
  };

  const handleConfigurationChange = (key: string, value: string) => {
    setConfiguration(prev => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleTestConnection = async () => {
    if (!selectedType) return;

    setIsTestingConnection(true);
    setTestResult(null);

    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation logic
      const isValid = selectedType === 'custom' 
        ? !!(configuration.apiUrl && configuration.apiKey)
        : !!(configuration.clientId && configuration.clientSecret);

      if (isValid) {
        setTestResult({ success: true, message: 'Connection test successful!' });
        setCurrentStep('complete');
      } else {
        setTestResult({ success: false, message: 'Connection test failed. Please check your configuration.' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'An error occurred during testing.' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleCreateConnection = async () => {
    if (!selectedType) return;

    const request: CreateConnectionRequest = {
      name: connectionName,
      type: selectedType,
      settings: {
        auto_sync: true,
        sync_frequency: 'daily',
        data_retention_days: 90,
        enabled_features: [],
      },
      credentials: configuration,
    };

    try {
      await createMutation.mutateAsync(request);
      onSuccess?.();
      handleClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleClose = () => {
    setCurrentStep('select-type');
    setSelectedType(null);
    setConnectionName('');
    setConfiguration({});
    setShowPassword({});
    setTestResult(null);
    onClose();
  };

  const renderPasswordInput = (key: string, label: string, placeholder?: string) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <div className="relative">
        <Input
          id={key}
          type={showPassword[key] ? 'text' : 'password'}
          value={configuration[key] || ''}
          onChange={(e) => handleConfigurationChange(key, e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => togglePasswordVisibility(key)}
        >
          {showPassword[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'select-type':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Choose Connection Type</h3>
              <p className="text-gray-600 text-sm">Select the service you want to connect to</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {CONNECTION_TYPES.map((type) => (
                <Card
                  key={type.type}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleTypeSelect(type.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {type.icon}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{type.name}</h4>
                          {type.popular && (
                            <Badge variant="secondary" className="text-xs">Popular</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'configure':
        const selectedTypeOption = CONNECTION_TYPES.find(t => t.type === selectedType);
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep('select-type')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h3 className="text-lg font-semibold">Configure {selectedTypeOption?.name}</h3>
                <p className="text-gray-600 text-sm">Enter your connection details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="connectionName">Connection Name</Label>
                <Input
                  id="connectionName"
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                  placeholder="Enter a name for this connection"
                />
              </div>

              {selectedType === 'custom' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="apiUrl">API URL</Label>
                    <Input
                      id="apiUrl"
                      value={configuration.apiUrl || ''}
                      onChange={(e) => handleConfigurationChange('apiUrl', e.target.value)}
                      placeholder="https://api.example.com"
                    />
                  </div>
                  
                  {renderPasswordInput('apiKey', 'API Key', 'Enter your API key')}
                  
                  <div className="space-y-2">
                    <Label htmlFor="authType">Authentication Type</Label>
                    <Select
                      value={configuration.authType || 'Bearer'}
                      onValueChange={(value) => handleConfigurationChange('authType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bearer">Bearer Token</SelectItem>
                        <SelectItem value="ApiKey">API Key</SelectItem>
                        <SelectItem value="Basic">Basic Auth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="headers">Headers (JSON)</Label>
                    <Textarea
                      id="headers"
                      value={configuration.headers || ''}
                      onChange={(e) => handleConfigurationChange('headers', e.target.value)}
                      placeholder='{"Content-Type": "application/json"}'
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input
                      id="clientId"
                      value={configuration.clientId || ''}
                      onChange={(e) => handleConfigurationChange('clientId', e.target.value)}
                      placeholder="Enter your client ID"
                    />
                  </div>
                  
                  {renderPasswordInput('clientSecret', 'Client Secret', 'Enter your client secret')}
                  
                  <div className="space-y-2">
                    <Label htmlFor="redirectUri">Redirect URI</Label>
                    <Input
                      id="redirectUri"
                      value={configuration.redirectUri || ''}
                      onChange={(e) => handleConfigurationChange('redirectUri', e.target.value)}
                      placeholder="Redirect URI for OAuth"
                    />
                  </div>

                  {selectedType === 'googleWorkspace' && (
                    <div className="space-y-2">
                      <Label htmlFor="accountId">Domain</Label>
                      <Input
                        id="accountId"
                        value={configuration.accountId || ''}
                        onChange={(e) => handleConfigurationChange('accountId', e.target.value)}
                        placeholder="example.com"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'test':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Test Connection</h3>
              <p className="text-gray-600 text-sm">Verifying your connection settings</p>
            </div>

            {isTestingConnection && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2">Testing connection...</span>
              </div>
            )}

            {testResult && (
              <div className={`p-4 rounded-md border ${
                testResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start">
                  {testResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                  )}
                  <div>
                    <h4 className={`font-medium ${
                      testResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                    </h4>
                    <p className={`text-sm ${
                      testResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {testResult.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Ready to Create Connection</h3>
              <p className="text-gray-600 text-sm">
                Your connection has been tested successfully and is ready to be created.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (currentStep) {
      case 'select-type':
        return (
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        );

      case 'configure':
        const canProceed = connectionName.trim() && (
          selectedType === 'custom' 
            ? configuration.apiUrl && configuration.apiKey
            : configuration.clientId && configuration.clientSecret
        );

        return (
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('select-type')}>
              Back
            </Button>
            <Button 
              onClick={handleTestConnection}
              disabled={!canProceed}
            >
              Test Connection
            </Button>
          </div>
        );

      case 'test':
        return (
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('configure')}>
              Back
            </Button>
            <Button 
              onClick={handleTestConnection}
              disabled={isTestingConnection}
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                'Retry Test'
              )}
            </Button>
          </div>
        );

      case 'complete':
        return (
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('configure')}>
              Back
            </Button>
            <Button 
              onClick={handleCreateConnection}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Connection'
              )}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Connection</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {renderStepContent()}
        </div>
        
        <div className="border-t pt-4">
          {renderFooter()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

