import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Query keys factory
export const queryKeys = {
  // Connection queries
  connections: {
    all: ['connections'] as const,
    lists: () => [...queryKeys.connections.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.connections.lists(), { filters }] as const,
    details: () => [...queryKeys.connections.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.connections.details(), id] as const,
    history: (id: string) => [...queryKeys.connections.detail(id), 'history'] as const,
  },
  // Auth queries
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    sessions: () => [...queryKeys.auth.all, 'sessions'] as const,
  },
  // Organization queries
  org: {
    all: ['org'] as const,
    accounts: () => [...queryKeys.org.all, 'accounts'] as const,
    users: () => [...queryKeys.org.all, 'users'] as const,
    organizations: () => [...queryKeys.org.all, 'organizations'] as const,
    datasources: () => [...queryKeys.org.all, 'datasources'] as const,
    extractions: () => [...queryKeys.org.all, 'extractions'] as const,
  },
} as const;

