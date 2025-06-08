
import { create } from 'zustand';
import { IReport } from '@/types';

interface ReportsState {
  reports: IReport[];
  selectedReport: IReport | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setReports: (reports: IReport[]) => void;
  setSelectedReport: (report: IReport | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: [],
  selectedReport: null,
  loading: false,
  error: null,
  
  setReports: (reports) => {
    set({ reports });
  },
  
  setSelectedReport: (report) => {
    set({ selectedReport: report });
  },
  
  setLoading: (loading) => {
    set({ loading });
  },
  
  setError: (error) => {
    set({ error });
  },
}));
