'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { Badge } from '../../../app/components/ui/badge';
import { 
  CheckCircle2, 
  ArrowRight, 
  Info,
  AlertCircle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ConnectionManager } from '../../widgets/connections';
import { useConnections_list } from '../../../hooks/useConnections';
import { useConfig, useSetupConfig } from '../../../contexts/ConfigContext';
import { useStep } from '../StepContext';

interface ConnectionSetupRefactoredProps {
  className?: string;
}

export function ConnectionSetupRefactored({ className = '' }: ConnectionSetupRefactoredProps) {
  const router = useRouter();
  const { setCurrentStep } = useStep();
  const { config, syncConnections } = useConfig();
  const { setupConfig, completeSetupStep } = useSetupConfig();
  
  const { data: connectionsData, isLoading } = useConnections_list();
  const connections = connectionsData?.connections || [];
  const connectedCount = connections.filter(conn => conn.status === 'connected').length;
  const hasConnections = connectedCount > 0;

  // Sync connections with global config
  useEffect(() => {
    if (connections.length > 0) {
      syncConnections(connections);
    }
  }, [connections, syncConnections]);

  // Auto-complete step when connections are established
  useEffect(() => {
    if (hasConnections && !setupConfig.completedSteps.includes('connections')) {
      completeSetupStep('connections');
      toast.success('Connection setup completed!');
    }
  }, [hasConnections, setupConfig.completedSteps, completeSetupStep]);

  const handleContinue = () => {
    if (hasConnections) {
      completeSetupStep('connections');
      setCurrentStep(3); // Move to next step
      router.push('/first-time-setup/data-extraction');
    } else {
      toast.error('Please connect at least one data source to continue.');
    }
  };

  const handleSkip = () => {
    // Allow skipping but warn user
    toast.warning('You can add connections later from the dashboard.');
    setCurrentStep(3);
    router.push('/first-time-setup/data-extraction');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            hasConnections ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {hasConnections ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-dashed" />
            )}
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Connect Your Data Sources</h1>
          <p className="text-lg text-gray-600 mt-2">
            Connect to your organization's tools to start extracting and analyzing data
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-600">Organization Setup</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              hasConnections ? 'bg-green-500' : 'bg-blue-500'
            }`} />
            <span className={hasConnections ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
              Data Connections
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="text-gray-400">Data Extraction</span>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <Card className="border-2 border-dashed border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${
                hasConnections ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {hasConnections ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {hasConnections ? 'Connections Established' : 'No Connections Yet'}
                </h3>
                <p className="text-gray-600">
                  {hasConnections 
                    ? `${connectedCount} data ${connectedCount === 1 ? 'source' : 'sources'} connected`
                    : 'Connect your first data source to get started'
                  }
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <Badge variant={hasConnections ? 'green' : 'gray'} className="mb-2">
                {hasConnections ? 'Ready' : 'Pending'}
              </Badge>
              {hasConnections && (
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Manager Widget */}
      <ConnectionManager
        className="min-h-[400px]"
        showAddButton={true}
        maxConnections={undefined}
        onConnectionSelect={(connection) => {
          toast.info(`Selected ${connection.name}`);
        }}
        onConnectionEdit={(connection) => {
          toast.info(`Editing ${connection.name}`);
        }}
      />

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            Why Connect Data Sources?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>Automatically extract organizational data from your tools</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>Get insights into communication patterns and collaboration</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>Track productivity metrics and team performance</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600" />
              <span>Generate comprehensive reports and analytics</span>
            </li>
          </ul>
          
          <div className="mt-4 p-3 bg-blue-100 rounded border border-blue-300">
            <p className="text-sm font-medium">
              <strong>Security Note:</strong> All connections use secure OAuth authentication. 
              We only access the data you explicitly authorize and never store your credentials.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentStep(1);
            router.push('/first-time-setup/organization');
          }}
        >
          Back to Organization Setup
        </Button>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-600"
          >
            Skip for Now
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={!hasConnections}
            className={hasConnections ? '' : 'opacity-50 cursor-not-allowed'}
          >
            {hasConnections ? 'Continue to Data Extraction' : 'Connect a Data Source First'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Need help? Check our{' '}
          <a href="/docs/connections" className="text-blue-600 hover:underline">
            connection guide
          </a>{' '}
          or{' '}
          <a href="/support" className="text-blue-600 hover:underline">
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}

