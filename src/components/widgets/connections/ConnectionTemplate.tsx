'use client';

import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Label } from '../../../app/components/ui/label';
import { ConnectionSettings } from '../../../types/connections';
=======
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { ConnectionSettings } from '../../types/connections';
import { useConnectionTemplates, ConnectionTemplate } from '../../../hooks/useConnectionTemplates';

const DEFAULT_TEMPLATES: ConnectionTemplate[] = [
  {
    id: 'daily',
    name: 'Daily Sync',
    settings: {
      auto_sync: true,
      sync_frequency: 'daily',
      data_retention_days: 90,
      enabled_features: []
    }
  },
  {
    id: 'weekly',
    name: 'Weekly Sync',
    settings: {
      auto_sync: true,
      sync_frequency: 'weekly',
      data_retention_days: 30,
      enabled_features: []
    }
  }
];

export function ConnectionTemplateSelector() {
  const { templates, addTemplate } = useConnectionTemplates();
  const [selected, setSelected] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (templates.length === 0) {
      DEFAULT_TEMPLATES.forEach(t => addTemplate(t));
    }
  }, [templates.length, addTemplate]);

  const handleAddTemplate = () => {
    if (!newName.trim()) return;
    const newTemplate: ConnectionTemplate = {
      id: newName.toLowerCase().replace(/\s+/g, '-'),
      name: newName,
      settings: DEFAULT_TEMPLATES[0].settings
    };
    addTemplate(newTemplate);
    setNewName('');
  };

  const selectedTemplate = templates.find(t => t.id === selected);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Setting Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template">Select Template</Label>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTemplate && (
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
{JSON.stringify(selectedTemplate.settings, null, 2)}
          </pre>
        )}

        <div className="space-y-2">
          <Label htmlFor="newTemplate">New Template Name</Label>
          <Input id="newTemplate" value={newName} onChange={e => setNewName(e.target.value)} placeholder="My Template" />
          <Button onClick={handleAddTemplate} size="sm">Add Template</Button>
        </div>
      </CardContent>
    </Card>
  );
}
