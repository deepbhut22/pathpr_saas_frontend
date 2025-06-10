
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IConsultant, IConsultantFirm, ConsultantRole } from '@/types';
import Cookies from 'js-cookie';

interface AuthState {
  isAuthenticated: boolean;
  consultant: IConsultant | null;
  firm: IConsultantFirm | null;
  role: ConsultantRole | null;
  isProfileCompleted: boolean;
  isProfileComletionPopupOpen: boolean;
  // token: string | null;
  
  // Actions
  login: (consultant: IConsultant, firm: IConsultantFirm, token: string) => void;
  logout: () => void;
  updateConsultant: (consultant: Partial<IConsultant>) => void;
  updateFirm: (firm: Partial<IConsultantFirm>) => void;
  updateIsProfileCompleted: (isProfileCompleted: boolean) => void;
  updateIsProfileComletionPopupOpen: (isProfileComletionPopupOpen: boolean) => void;
  initializeApp: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      consultant: null,
      firm: null,
      role: null,
      isProfileCompleted: false,
      isProfileComletionPopupOpen: false,
      // token: null,
      
      login: (consultant, firm, token) => {
        Cookies.set('pathpr_auth_token', token, { expires: 1 });
        set({
          isAuthenticated: true,
          consultant,
          firm,
          role: consultant.role,
          // token,
        });
      },
      
      logout: () => {
        Cookies.remove('pathpr_auth_token');
        set({
          isAuthenticated: false,
          consultant: null,
          firm: null,
          role: null,
          // token: null,
        });
      },
      
      updateConsultant: (updatedConsultant) => {
        const currentConsultant = get().consultant;
        if (currentConsultant) {
          set({
            consultant: { ...currentConsultant, ...updatedConsultant },
          });
        }
      },
      
      updateFirm: (updatedFirm) => {
        const currentFirm = get().firm;
        if (currentFirm) {
          set({
            firm: { ...currentFirm, ...updatedFirm },
          });
        }
      },
      updateIsProfileCompleted: (isProfileCompleted: boolean) => {
        set({
          isProfileCompleted,
        });
      },
      updateIsProfileComletionPopupOpen: (isProfileComletionPopupOpen: boolean) => {
        set({
          isProfileComletionPopupOpen,
        });
      },
      initializeApp: () => {
        const consultant = get().consultant;

        if (!consultant) {
          return;
        }

        if (!isProfileCompleted(consultant)) {
          setTimeout(() => {
            get().updateIsProfileComletionPopupOpen(true);
          }, 3000);
        }

        get().updateIsProfileCompleted(isProfileCompleted(consultant));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

const isProfileCompleted = (consultant: IConsultant) => {
  return (
    consultant.displayEmail && consultant.displayEmail !== "" &&
    consultant.phone && consultant.phone !== "" &&
    consultant.email && consultant.email !== "" &&
    consultant.displayName && consultant.displayName !== "" &&
    consultant.role &&
    consultant.bio && consultant.bio !== "" &&
    consultant.image && consultant.image !== "" &&
    consultant.isPasswordChanged && consultant.isPasswordChanged === true
  )
}