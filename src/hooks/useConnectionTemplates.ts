import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ConnectionSettings } from '../types/connections';

export interface ConnectionTemplate {
  id: string;
  name: string;
  settings: ConnectionSettings;
}

const STORAGE_KEY = 'connection_templates';

function readTemplates(): ConnectionTemplate[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeTemplates(templates: ConnectionTemplate[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }
}

export function useConnectionTemplates() {
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ['connectionTemplates'],
    queryFn: async () => readTemplates(),
    initialData: readTemplates(),
  });

  const addTemplateMutation = useMutation({
    mutationFn: async (template: ConnectionTemplate) => {
      const current = readTemplates();
      writeTemplates([...current, template]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectionTemplates'] });
    },
  });

  return {
    templates: data,
    addTemplate: addTemplateMutation.mutate,
  };
}
