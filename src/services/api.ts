
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  LoginResponse, 
  IConsultantFirm, 
  IUserProfile, 
  IReport, 
  IConsultant,
  PaginatedResponse,
  ProfileSearchQuery,
  ConsultantFilters,
  CreateConsultantDto,
  IUserProfileModel,
  CreateUserProfileDto
} from '@/types';
// import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

// const { toast } = useToast();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://saasapi.pathpr.ca/api';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('pathpr_saas_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('pathpr_saas_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/consultants/login', { email, password });
    console.log(response);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    Cookies.remove('pathpr_saas_token');
  },
};

export const firmAPI = {
  getFirmBySlug: async (slug: string): Promise<IConsultantFirm> => {
    const response = await api.get(`/firms/${slug}`);
    return response.data.data;
  },
  
  updateFirm: async (data: Partial<IConsultantFirm>): Promise<IConsultantFirm> => {
    try {
      const response = await api.put(`/firms`, data);
      if (response.status === 200) {
        return response.data;
      } else {
        // toast({
        //   title: "Error updating firm",
        //   description: response.data.message
        // });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export const clientsAPI = {
  getClients: async (params: ProfileSearchQuery): Promise<PaginatedResponse<IUserProfile>> => {
    const response = await api.get('/consultants/clients', { params });
    return response.data.data as PaginatedResponse<IUserProfile>;
  },
  
  getClientById: async (clientId: string): Promise<IUserProfile> => {
    try {
      const response = await api.get(`/clients/${clientId}`);      
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  updateClient: async (token: string, data: Partial<IUserProfileModel>): Promise<IUserProfile> => {
    try {
      const response = await api.put(`/clients/update-profile/${token}`, data);
      if (response.status === 200) {
        alert("Client updated successfully");
        return response.data;
      } else {
        // toast({
        //   title: "Error updating client",
        //   description: response.data.message
        // });
        alert("Client updated successfully");
      }
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createClient: async (): Promise<string> => {
    try {
      const response = await api.get('/consultants/add-new-client');
      console.log(response);
      
      if (response.data.status === "success") {
        return response.data.link;
      } else {
        // toast({
        //   title: "Error creating client",
        //   description: response.data.message
        // });
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getFirmAndConsultant: async (token: string): Promise<{ firm: IConsultantFirm, consultant: IConsultant }> => {
    const response = await api.get(`/clients/get-firm-and-consultant/${token}`);
    return response.data.data;
  },
};

export const reportsAPI = {
  getReportsByClientId: async (clientId: string): Promise<IReport[]> => {
    try {
      const response = await api.get(`/clients/${clientId}/reports`);
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  getReportById: async (reportId: string): Promise<IReport> => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },
};

export const consultantsAPI = {
  getConsultants: async (params: ConsultantFilters & { search?: string, role?: string, page?: number | 1, limit?: number | 10, sortBy?: string, sortOrder?: string }): Promise<PaginatedResponse<IConsultant>> => {
    const response = await api.get('/consultants/all-consultants', { params });
    console.log(response);
    return response.data.data;
  },

  getConsultantInfo: async (firmSlug: string): Promise<IConsultant> => {
    try {
      const reponse = await api.get(`/consultants/get-consultant-info/${firmSlug}`);
      
      return reponse.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  getConsultantById: async (consultantId: string): Promise<IConsultant> => {
    const response = await api.get(`/consultants/${consultantId}`);
    return response.data;
  },
  
  createConsultant: async (data: CreateConsultantDto): Promise<IConsultant> => {
    const response = await api.post('/consultants/add-new-consultant', data);
    return response.data;
  },
  
  updateConsultant: async (data: Partial<IConsultant>): Promise<IConsultant> => {
    const response = await api.put('/consultants/update-profile', data);
    console.log(response);
    return response.data;
  },

  updateConsultantPassword: async (password: string): Promise<void> => {
    const response = await api.put('/consultants/change-password', { password });
    if (response.data.status !== 'success') {
      throw new Error(response.data.message);
    }
    useAuthStore.getState().logout();
    Cookies.remove('pathpr_saas_token');
    return response.data;
  },
  
  deleteConsultant: async (consultantId: string): Promise<void> => {
    await api.delete(`/consultants/${consultantId}`);
  },
};

export const dashboardAPI = {
  getDashboardStats: async (): Promise<any> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};
