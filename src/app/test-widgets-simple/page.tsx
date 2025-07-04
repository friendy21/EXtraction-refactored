'use client';

import React from 'react';
import { AppProviders } from '../../components/providers/AppProviders';
import { ConnectionManager } from '../../components/widgets/connections';

export default function TestWidgetsSimplePage() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Connection Widgets Test</h1>
            <p className="text-gray-600">Testing the new connection widgets with React Query and mock data</p>
          </div>
          
          <ConnectionManager 
            showAddButton={true}
            onConnectionSelect={(connection) => {
              console.log('Selected connection:', connection);
            }}
            onConnectionEdit={(connection) => {
              console.log('Edit connection:', connection);
            }}
          />
        </div>
      </div>
    </AppProviders>
  );
}

