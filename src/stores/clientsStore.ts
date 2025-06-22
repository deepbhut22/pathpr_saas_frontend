
import { create } from 'zustand';
import { IUserProfile, PaginatedResponse, ClientFilters } from '@/types';

interface ClientsState {
  clients: IUserProfile[];
  selectedClient: IUserProfile | null;
  clientsPageViewMode: string;
  setClientsPageViewMode: (viewMode: string) => void;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: ClientFilters;
  
  // Actions
  setClients: (response: PaginatedResponse<IUserProfile>) => void;
  setSelectedClient: (client: IUserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ClientFilters) => void;
  updateClient: (clientId: string, updatedClient: Partial<IUserProfile>) => void;
  clearFilters: () => void;
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {},
  clientsPageViewMode: 'list',
  setClientsPageViewMode: (viewMode: string) => set({ clientsPageViewMode: viewMode }),
  setClients: (response) => {
    set({
      clients: response.data,
      pagination: {
        page: response.page,
        limit: response.limit,
        total: response.total,
      },
    });
  },
  
  setSelectedClient: (client) => {
    set({ selectedClient: client });
  },
  
  setLoading: (loading) => {
    set({ loading });
  },
  
  setError: (error) => {
    set({ error });
  },
  
  setFilters: (filters) => {
    set({ filters });
  },
  
  updateClient: (clientId, updatedClient) => {
    const clients = get().clients;
    const updatedClients = clients.map(client =>
      client._id === clientId ? { ...client, ...updatedClient } : client
    );
    set({ clients: updatedClients });
    
    const selectedClient = get().selectedClient;
    if (selectedClient && selectedClient._id === clientId) {
      set({ selectedClient: { ...selectedClient, ...updatedClient } });
    }
  },
  
  clearFilters: () => {
    set({ filters: {} });
  },
}));
