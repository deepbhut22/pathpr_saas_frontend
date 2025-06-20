
// Common types
export type ConsultantRole = 'owner' | 'team_leader' | 'consultant';

// Base interfaces for our models
export interface IConsultantFirm {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  websiteUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConsultant {
  _id: string;
  email: string;
  password: string;
  displayName: string;
  displayEmail?: string;
  role: ConsultantRole;
  type: 'consultant' | 'lawyer';
  image?: string;
  firmId: string;
  phone?: string;
  bio?: string;
  isPasswordChanged?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BasicInfo {
  fullName: string;
  email: string;
  gender: string;
  age: number;
  citizenCountry: string;
  residenceCountry: string;
  province?: string;
  mobileNumber: string;
}

// Language Info
export interface LanguageTest {
  type: string;
  clbScore: number;
}

export interface LanguageInfo {
  primaryLanguage: string;
  hasTakenTest: boolean;
  primaryLanguageTest: LanguageTest;
  hasSecondLanguage: boolean;
  secondLanguageTest: LanguageTest;
}

// Education Info
export interface Education {
  id: string;
  type: string;
  fieldOfStudy: string;
  inProgress: boolean;
  province?: string;
  country: string;
}

export interface EducationInfo {
  hasHighSchool: boolean;
  hasPostSecondary: boolean;
  educationList: Education[];
}

// Spouse Info
export interface SpouseInfo {
  maritalStatus: string;
  hasCanadianWorkExp: boolean;
  hasCanadianStudyExp: boolean;
  hasRelativeInCanada: boolean;
  educationLevel: string;
}

// Dependent Info
export interface Dependent {
  id: string;
  age: number;
  citizenCountry: string;
  residenceCountry: string;
  residencyStatus?: string;
}

export interface DependentInfo {
  hasDependents: boolean;
  dependentList: Dependent[];
}

// Connection Info
export interface Connection {
  relationship: string;
  province: string;
  residencyStartDate: string;
  residencyStatus: string;
}

export interface ConnectionInfo {
  doesUserHaveFamilyInCanadaWhoIsCitizenOrPermanentResident: boolean;
}

// Work Experience Info
export interface WorkExperience {
  id: string;
  jobTitle: string;
  isSelfEmployed: boolean;
  country: string;
  province?: string;
  workPermitType?: string;
  nocCode: string;
  isCurrentJob: boolean;
  numberOfMonths: number;
  teer: number;
}

export interface WorkInfo {
  hasWorkExperience: boolean;
  workExperienceList: WorkExperience[];
}

// Job Offer Info
export interface JobOffer {
  jobTitle: string;
  nocCode: string;
  province: string;
  startDate: string;
  teer: number;
}

export interface JobOfferInfo {
  hasJobOffer: boolean;
  jobOffer: JobOffer;
}

export interface IUserProfileModel {
  basicInfo: BasicInfo;
  languageInfo: LanguageInfo;
  educationInfo: EducationInfo;
  spouseInfo: SpouseInfo;
  dependentInfo: DependentInfo;
  connectionInfo: ConnectionInfo;
  workInfo: WorkInfo;
  jobOfferInfo: JobOfferInfo;
  createdAt: Date;
  updatedAt: Date;
} 

export interface IUserProfile {
  _id: string;
  consultantFirmId: string;
  fullName: string;
  email: string;
  profileData: IUserProfileModel;
  oneTimeToken?: string;
  expiresAt?: Date;
  createdByConsultantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReportContent {
  expressEntry: {
    expressEntry: {
    crsScore: number;
    scoreBreakdown: {
      coreHumanCapital: {
        score: number;
        maximum: number;
        reason: string[];
      };
      spouseFactors: {
        score: number;
        maximum: number;
        reason: string[];
      };
      skillTransferability: {
        score: number;
        maximum: number;
        reason: string[];
      };
      additionalPoints: {
        score: number;
        maximum: number;
        reason: string[];
      };
    };
    },
    eligibilityStatus: {
      program: string;
      isEligible: boolean;
      reason: string[];
    }[];
    categoryBasedEligibility: {
      program: string;
      isEligible: boolean;
      reason: string[];
    }[];
  };
  pnp: {
    pnpAssessment: {
      province: string;
      stream_name: string;
      status: string;
      reason: string[];
    }[];
    suggestions: {
      action: string;
      reason: string;
    }[];
  };
  alternativePathways: any[];
  nextSteps: any[];
  recommendations: {
    result: {
    question: string;
    answer: string;
  }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IReport {
  _id: string;
  userProfileId: string;
  consultantId: string;
  consultantFirmId: string;
  content: IReportContent;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response types
export interface JWTPayload {
  consultantId: string;
  firmId: string;
  role: ConsultantRole;
}

export interface CreateConsultantFirmDto {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface CreateConsultantDto {
  email: string;
  // password: string;
  // displayName: string;
  role: ConsultantRole;
  // firmId: string;
  // phone?: string;
  // bio?: string;
}

export interface CreateUserProfileDto {
  consultantFirmId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  formData: Record<string, any>;
}

export interface CreateReportDto {
  userProfileId: string;
  content: {
    summary: string;
    recommendations: string;
    [key: string]: any;
  };
}

// Query types
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ProfileSearchQuery extends PaginationQuery {
  firstName?: string;
  lastName?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
}

// Response types
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

// Error types
export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export type Step = 'basic' | 'language' | 'education' | 'spouse' | 'dependent' | 'connection' | 'work' | 'joboffer';

export interface NavigationStep {
  id: Step;
  title: string;
  description: string;
}

// Login response type
export interface LoginResponse {
  token: string;
  consultant: IConsultant;
  firm: IConsultantFirm;
  firmSlug: string;
}

// Filter types
export interface ClientFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ConsultantFilters {
  search?: string;
  role?: ConsultantRole;
  sortBy?: 'displayName' | 'email' | 'role' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
