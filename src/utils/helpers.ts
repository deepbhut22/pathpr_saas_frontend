import { Step, NavigationStep } from '@/types';
import { useUserFormDataStore } from '@/stores/userFormDataStore';

export const navigationSteps: NavigationStep[] = [
  { id: 'basic', title: 'Basic Information', description: 'Personal details and background' },
  { id: 'language', title: 'Language Proficiency', description: 'English and French language skills' },
  { id: 'education', title: 'Education', description: 'Academic qualifications and history' },
  { id: 'spouse', title: 'Spouse Information', description: 'Details about your spouse or partner' },
  { id: 'dependent', title: 'Dependents', description: 'Information about your dependent children' },
  { id: 'connection', title: 'Canadian Connections', description: 'Family members in Canada' },
  { id: 'work', title: 'Work Experience', description: 'Your employment history' },
  { id: 'joboffer', title: 'Job Offer', description: 'Details about any Canadian job offers' }
];

export const getStepIndex = (currentStep: Step): number => {
  return navigationSteps.findIndex(step => step.id === currentStep);
};

export const getNextStep = (currentStep: Step): Step | null => {
  const currentIndex = getStepIndex(currentStep);
  if (currentIndex < navigationSteps.length - 1) {
    return navigationSteps[currentIndex + 1].id;
  }
  return null;
};

export const getPreviousStep = (currentStep: Step): Step | null => {
  const currentIndex = getStepIndex(currentStep);
  if (currentIndex > 0) {
    return navigationSteps[currentIndex - 1].id;
  }
  return null;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const getProvinceOptions = () => [
  { value: 'alberta', label: 'Alberta' },
  { value: 'british_columbia', label: 'British Columbia' },
  { value: 'manitoba', label: 'Manitoba' },
  { value: 'new_brunswick', label: 'New Brunswick' },
  { value: 'newfoundland', label: 'Newfoundland and Labrador' },
  { value: 'nova_scotia', label: 'Nova Scotia' },
  { value: 'ontario', label: 'Ontario' },
  { value: 'pei', label: 'Prince Edward Island' },
  { value: 'quebec', label: 'Quebec' },
  { value: 'saskatchewan', label: 'Saskatchewan' }
];

export const getCurrentStepName = (step: Step) => {
  switch (step) {
    case 'basic':
      return useUserFormDataStore.getState().userProfile.profileData.basicInfo;
    case 'language':
      return useUserFormDataStore.getState().userProfile.profileData.languageInfo;
    case 'education':
      return useUserFormDataStore.getState().userProfile.profileData.educationInfo;
    case 'spouse':
      return useUserFormDataStore.getState().userProfile.profileData.spouseInfo;
    case 'dependent':
      return useUserFormDataStore.getState().userProfile.profileData.dependentInfo;
    case 'connection':
      return useUserFormDataStore.getState().userProfile.profileData.connectionInfo;
    case 'work':
      return useUserFormDataStore.getState().userProfile.profileData.workInfo;
    case 'joboffer':
      return useUserFormDataStore.getState().userProfile.profileData.jobOfferInfo;
  }
};