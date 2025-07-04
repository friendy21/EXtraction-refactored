# Extraction App v2.0.0 - Refactored with Widgetable Connections

## 🚀 What's New

This refactored version introduces:
- **Widgetable Connection Components**: Reusable, configurable connection widgets
- **React Query Integration**: Modern data fetching with caching and background updates
- **Shared Configuration**: Synchronized settings between setup and dashboard
- **Mock Data Support**: Development-friendly mock data with easy API switching
- **Type-Safe Architecture**: Full TypeScript support throughout

## 📦 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy and configure your environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.glynac.ai
NEXT_PUBLIC_API_VERSION=v2

# Development Settings (set to false for production)
NEXT_PUBLIC_USE_MOCK_DATA=true

# Feature Flags
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
```

### 3. Start Development Server
```bash
npm run dev
```

## 🧩 Widget Components

### ConnectionManager
The main widget for managing all connections.

```tsx
import { ConnectionManager } from './components/widgets/connections';

<ConnectionManager 
  showAddButton={true}
  maxConnections={10}
  onConnectionSelect={(connection) => {
    console.log('Selected:', connection.name);
  }}
  onConnectionEdit={(connection) => {
    console.log('Editing:', connection.name);
  }}
/>
```

**Props:**
- `className?: string` - Additional CSS classes
- `showAddButton?: boolean` - Show/hide add connection button
- `maxConnections?: number` - Maximum allowed connections
- `onConnectionSelect?: (connection) => void` - Selection callback
- `onConnectionEdit?: (connection) => void` - Edit callback

### ConnectionStatus
Displays connection status with visual indicators.

```tsx
import { ConnectionStatus } from './components/widgets/connections';

<ConnectionStatus 
  connection={connection}
  showDetails={true}
/>
```

### ConnectionWizard
Modal wizard for adding new connections.

```tsx
import { ConnectionWizard } from './components/widgets/connections';

<ConnectionWizard 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={(connection) => {
    console.log('Connection created:', connection);
  }}
/>
```

### ConnectionHistory
Shows historical connection activities.

```tsx
import { ConnectionHistory } from './components/widgets/connections';

<ConnectionHistory 
  connectionId="conn-123"
  maxItems={10}
/>
```

## 🔗 React Query Hooks

### useConnections_list
Fetch all connections with automatic caching.

```tsx
import { useConnections_list } from './hooks/useConnections';

const MyComponent = () => {
  const { data, isLoading, error, refetch } = useConnections_list();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.connections.map(conn => (
        <div key={conn.id}>{conn.name}</div>
      ))}
    </div>
  );
};
```

### useConnections_create
Create new connections with optimistic updates.

```tsx
import { useConnections_create } from './hooks/useConnections';

const AddConnectionForm = () => {
  const createMutation = useConnections_create();
  
  const handleSubmit = (formData) => {
    createMutation.mutate({
      name: formData.name,
      type: formData.type,
      config: formData.config
    }, {
      onSuccess: (connection) => {
        console.log('Created:', connection);
      },
      onError: (error) => {
        console.error('Failed:', error);
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Creating...' : 'Create Connection'}
      </button>
    </form>
  );
};
```

### useConnections_test
Test connection configurations.

```tsx
import { useConnections_test } from './hooks/useConnections';

const TestConnection = ({ config }) => {
  const testMutation = useConnections_test();
  
  const handleTest = () => {
    testMutation.mutate(config, {
      onSuccess: (result) => {
        if (result.success) {
          console.log('Connection successful!');
        } else {
          console.log('Connection failed:', result.error);
        }
      }
    });
  };
  
  return (
    <button onClick={handleTest} disabled={testMutation.isPending}>
      {testMutation.isPending ? 'Testing...' : 'Test Connection'}
    </button>
  );
};
```

## ⚙️ Configuration Context

### Using the Config Context
```tsx
import { useConfig, useSetupConfig } from './contexts/ConfigContext';

const MyComponent = () => {
  const { config, updateConfig, syncConnections } = useConfig();
  const { setupConfig, completeSetupStep } = useSetupConfig();
  
  // Access current configuration
  console.log('Current connections:', config.connections);
  
  // Update configuration
  updateConfig({ theme: 'dark' });
  
  // Sync connections from API
  syncConnections(newConnections);
  
  // Mark setup step as complete
  completeSetupStep('connections');
  
  return <div>Configuration ready!</div>;
};
```

## 🔄 Mock Data vs Real API

### Development Mode (Mock Data)
Set in `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

Mock data provides:
- Realistic connection scenarios
- Instant responses for development
- No external API dependencies
- Consistent test data

### Production Mode (Real API)
Set in `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
```

## 🏗️ Architecture

### Provider Setup
Wrap your app with the providers:

```tsx
// app/layout.tsx or _app.tsx
import { AppProviders } from './components/providers/AppProviders';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
```

### Type Definitions
All types are defined in `src/types/connections.ts`:

```typescript
interface Connection {
  id: string;
  name: string;
  type: ConnectionType;
  status: ConnectionStatus;
  config: ConnectionConfig;
  createdAt: string;
  updatedAt: string;
}

type ConnectionType = 
  | 'microsoft365' 
  | 'google_workspace' 
  | 'slack' 
  | 'dropbox' 
  | 'zoom' 
  | 'jira' 
  | 'custom';

type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'testing';
```

## 🧪 Testing

### Test Pages
Two test pages are included:

1. **Simple Widget Test**: `/test-widgets-simple`
   - Tests individual ConnectionManager widget
   - Minimal dependencies

2. **Full Integration Test**: `/test-widgets`
   - Tests complete refactored setup page
   - Full context integration

### Running Tests
```bash
# Start development server
npm run dev

# Visit test pages
open http://localhost:3000/test-widgets-simple
open http://localhost:3000/test-widgets
```

## 📱 Responsive Design

All widgets are fully responsive and include:
- Mobile-first design approach
- Touch-friendly interactions
- Flexible layouts
- Accessibility features

## 🔧 Customization

### Styling
Widgets use Tailwind CSS classes and can be customized via:
- `className` props
- CSS custom properties
- Tailwind configuration

### Behavior
Customize widget behavior through:
- Props configuration
- Event callbacks
- Context providers

## 🚨 Migration Guide

### From Original Components
1. Replace connection setup imports:
```tsx
// Before
import ConnectionSetup from './ConnectionSetup/page';

// After
import { ConnectionSetupRefactored } from './ConnectionSetup/ConnectionSetupRefactored';
```

2. Wrap with providers:
```tsx
// Before
<ConnectionSetup />

// After
<AppProviders>
  <ConnectionSetupRefactored />
</AppProviders>
```

3. Update data fetching:
```tsx
// Before
const [connections, setConnections] = useState([]);
useEffect(() => {
  fetchConnections().then(setConnections);
}, []);

// After
const { data: connectionsData } = useConnections_list();
const connections = connectionsData?.connections || [];
```

## 📚 API Reference

### Connection Service Endpoints
When using real API mode, the following endpoints are expected:

- `GET /api/v2/connections` - List connections
- `POST /api/v2/connections` - Create connection
- `PUT /api/v2/connections/:id` - Update connection
- `DELETE /api/v2/connections/:id` - Delete connection
- `POST /api/v2/connections/test` - Test connection

### Request/Response Formats
See `src/types/connections.ts` for complete type definitions.

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all UI components are properly imported from `src/app/components/ui/`
2. **Provider Missing**: Make sure `AppProviders` wraps your app
3. **Environment Variables**: Check `.env.local` configuration
4. **Mock Data**: Verify `NEXT_PUBLIC_USE_MOCK_DATA` setting

### Debug Mode
Enable React Query DevTools:
```env
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
```

## 📄 License
Same as original project license.

## 🤝 Contributing
Follow the existing code style and patterns established in this refactoring.

