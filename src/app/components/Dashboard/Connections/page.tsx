'use client';

import React, { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import {
  ConnectionManager,
  ConnectionHistory,
  ConnectionTemplateSelector
} from '../../widgets/connections';

interface Widget {
  id: string;
}

const ConnectionsPage: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'manager' },
    { id: 'template' },
    { id: 'history' }
  ]);

  const handleDragStart = (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', String(index));
  };

  const handleDrop = (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fromIndex = Number(event.dataTransfer.getData('text/plain'));
    if (fromIndex === index) return;
    const newWidgets = [...widgets];
    const [moved] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(index, 0, moved);
    setWidgets(newWidgets);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'manager':
        return <ConnectionManager showAddButton />;
      case 'history':
        return <ConnectionHistory connectionId="1" />;
      case 'template':
        return <ConnectionTemplateSelector />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Connections</h1>
        <p className="text-gray-600">Drag and drop widgets to customize your layout.</p>
        <div className="grid gap-4">
          {widgets.map((widget, index) => (
            <div
              key={widget.id}
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={handleDrop(index)}
              className="bg-white border rounded shadow-sm p-2"
            >
              {renderWidget(widget.id)}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConnectionsPage;
