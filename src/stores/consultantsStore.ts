
import { create } from 'zustand';
import { IConsultant, PaginatedResponse, ConsultantFilters } from '@/types';

interface ConsultantsState {
  consultants: IConsultant[];
  selectedConsultant: IConsultant | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: ConsultantFilters;
  
  // Actions
  setConsultants: (response: PaginatedResponse<IConsultant>) => void;
  setSelectedConsultant: (consultant: IConsultant | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ConsultantFilters) => void;
  updateConsultant: (consultantId: string, updatedConsultant: Partial<IConsultant>) => void;
  removeConsultant: (consultantId: string) => void;
  clearFilters: () => void;
}

export const useConsultantsStore = create<ConsultantsState>((set, get) => ({
  consultants: [],
  selectedConsultant: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {},
  
  setConsultants: (response) => {
    set({
      consultants: response.data,
      pagination: {
        page: response.page,
        limit: response.limit,
        total: response.total,
      },
    });
  },
  
  setSelectedConsultant: (consultant) => {
    set({ selectedConsultant: consultant });
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
  
  updateConsultant: (consultantId, updatedConsultant) => {
    const consultants = get().consultants;
    const updatedConsultants = consultants.map(consultant =>
      consultant._id === consultantId ? { ...consultant, ...updatedConsultant } : consultant
    );
    set({ consultants: updatedConsultants });
    
    const selectedConsultant = get().selectedConsultant;
    if (selectedConsultant && selectedConsultant._id === consultantId) {
      set({ selectedConsultant: { ...selectedConsultant, ...updatedConsultant } });
    }
  },
  
  removeConsultant: (consultantId) => {
    const consultants = get().consultants.filter(c => c._id !== consultantId);
    set({ consultants });
    
    const selectedConsultant = get().selectedConsultant;
    if (selectedConsultant && selectedConsultant._id === consultantId) {
      set({ selectedConsultant: null });
    }
  },
  
  clearFilters: () => {
    set({ filters: {} });
  },
}));
