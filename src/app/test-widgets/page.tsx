'use client';

import React from 'react';
import { AppProviders } from '../../components/providers/AppProviders';
import { ConnectionSetupRefactored } from '../../components/FirstTimeSetUp/ConnectionSetup/ConnectionSetupRefactored';

export default function TestWidgetsPage() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Widget Testing Page</h1>
            <p className="text-gray-600">Testing the new refactored connection widgets with React Query and shared configuration</p>
          </div>
          
          <ConnectionSetupRefactored />
        </div>
      </div>
    </AppProviders>
  );
}

