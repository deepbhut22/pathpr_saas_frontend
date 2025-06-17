import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    IUserProfile, BasicInfo, LanguageInfo, EducationInfo,
    SpouseInfo, DependentInfo, ConnectionInfo, WorkInfo, JobOfferInfo,
    Education, Dependent, WorkExperience, IUserProfileModel
} from '../types';

const defaultBasicInfo: BasicInfo = {
    fullName: '',
    email: '',
    gender: '',
    age: null,
    citizenCountry: '',
    residenceCountry: '',
    province: '',
    mobileNumber: ''
};

const defaultLanguageInfo: LanguageInfo = {
    primaryLanguage: '',
    hasTakenTest: false,
    primaryLanguageTest: {
        type: '',
        clbScore: 0
    },
    hasSecondLanguage: false,
    secondLanguageTest: {
        type: '',
        clbScore: 0
    }
};

const defaultEducationInfo: EducationInfo = {
    hasHighSchool: null,
    hasPostSecondary: null,
    educationList: []
};

const defaultSpouseInfo: SpouseInfo = {
    maritalStatus: '',
    hasCanadianWorkExp: null,
    hasCanadianStudyExp: null,
    hasRelativeInCanada: null,
    educationLevel: ''
};

const defaultDependentInfo: DependentInfo = {
    hasDependents: null,
    dependentList: []
};

const defaultConnectionInfo: ConnectionInfo = {
    doesUserHaveFamilyInCanadaWhoIsCitizenOrPermanentResident: null
};

const defaultWorkInfo: WorkInfo = {
    hasWorkExperience: null,
    workExperienceList: []
};

const defaultJobOfferInfo: JobOfferInfo = {
    hasJobOffer: null,
    jobOffer: {
        jobTitle: '',
        nocCode: '',
        province: '',
        startDate: '',
        teer: 0
    }
};

const initialUserProfile: IUserProfile = {
    _id: '',
    consultantFirmId: '',
    fullName: '',
    email: '',
    profileData: {
        basicInfo: defaultBasicInfo,
        languageInfo: defaultLanguageInfo,
        educationInfo: defaultEducationInfo,
        spouseInfo: defaultSpouseInfo,
        dependentInfo: defaultDependentInfo,
        connectionInfo: defaultConnectionInfo,
        workInfo: defaultWorkInfo,
        jobOfferInfo: defaultJobOfferInfo,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    oneTimeToken: '',
    expiresAt: new Date(),
    createdByConsultantId: '',
    createdAt: new Date(),
    updatedAt: new Date()
};

interface UserFormDataState {
    userProfile: IUserProfile;
    setUserProfile: (profile: IUserProfileModel) => void;
    updateBasicInfo: (info: Partial<BasicInfo>) => void;
    updateLanguageInfo: (info: Partial<LanguageInfo>) => void;
    updateEducationInfo: (info: Partial<EducationInfo>) => void;
    addEducation: (education: Education) => void;
    removeEducation: (id: string) => void;
    updateSpouseInfo: (info: Partial<SpouseInfo>) => void;
    updateDependentInfo: (info: Partial<DependentInfo>) => void;
    addDependent: (dependent: Dependent) => void;
    removeDependent: (id: string) => void;
    updateConnectionInfo: (info: boolean) => void;
    updateWorkInfo: (info: Partial<WorkInfo>) => void;
    addWorkExperience: (workExperience: WorkExperience) => void;
    removeWorkExperience: (id: string) => void;
    updateJobOfferInfo: (info: Partial<JobOfferInfo>) => void;
    setProfileComplete: (isComplete: boolean) => void;
    resetUserProfile: () => void;
}

export const useUserFormDataStore = create<UserFormDataState>()(
    persist(
        (set) => ({
            userProfile: initialUserProfile,

            setUserProfile: (profile) =>
                set({
                    userProfile: {
                        ...initialUserProfile,
                        profileData: profile
                    }
                }),

            updateBasicInfo: (info) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            basicInfo: { ...state.userProfile.profileData.basicInfo, ...info }
                        }
                    }
                })),

            updateLanguageInfo: (info) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            languageInfo: { ...state.userProfile.profileData.languageInfo, ...info }
                        }
                    }
                })),

            updateEducationInfo: (info) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            educationInfo: { ...state.userProfile.profileData.educationInfo, ...info }
                        }
                    }
                })),

            addEducation: (education) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            educationInfo: {
                                ...state.userProfile.profileData.educationInfo,
                                educationList: [
                                    ...state.userProfile.profileData.educationInfo.educationList,
                                    education
                                ]
                            }
                        }
                    }
                })),

            removeEducation: (id) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            educationInfo: {
                                ...state.userProfile.profileData.educationInfo,
                                educationList: state.userProfile.profileData.educationInfo.educationList.filter(
                                    (edu) => edu.id !== id
                                )
                            }
                        }
                    }
                })),

            updateSpouseInfo: (info) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            spouseInfo: { ...state.userProfile.profileData.spouseInfo, ...info }
                        }
                    }
                })),

            updateDependentInfo: (info) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            dependentInfo: { ...state.userProfile.profileData.dependentInfo, ...info }
                        }
                    }
                })),

            addDependent: (dependent) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            dependentInfo: {
                                ...state.userProfile.profileData.dependentInfo,
                                dependentList: [
                                    ...state.userProfile.profileData.dependentInfo.dependentList,
                                    dependent
                                ]
                            }
                        }
                    }
                })),

            removeDependent: (id) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            dependentInfo: {
                                ...state.userProfile.profileData.dependentInfo,
                                dependentList: state.userProfile.profileData.dependentInfo.dependentList.filter(
                                    (dep) => dep.id !== id
                                )
                            }
                        }
                    }
                })),

            updateConnectionInfo: (info: boolean) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            connectionInfo: {
                                doesUserHaveFamilyInCanadaWhoIsCitizenOrPermanentResident: info
                            }
                        }
                    }
                })),

            updateWorkInfo: (info) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            workInfo: { ...state.userProfile.profileData.workInfo, ...info }
                        }
                    }
                })),

            addWorkExperience: (workExperience) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            workInfo: {
                                ...state.userProfile.profileData.workInfo,
                                workExperienceList: [
                                    ...state.userProfile.profileData.workInfo.workExperienceList,
                                    workExperience
                                ]
                            }
                        }
                    }
                })),

            removeWorkExperience: (id) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            workInfo: {
                                ...state.userProfile.profileData.workInfo,
                                workExperienceList: state.userProfile.profileData.workInfo.workExperienceList.filter(
                                    (work) => work.id !== id
                                )
                            }
                        }
                    }
                })),

            updateJobOfferInfo: (info) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            jobOfferInfo: { ...state.userProfile.profileData.jobOfferInfo, ...info }
                        }
                    }
                })),

            setProfileComplete: (isComplete) =>
                set((state) => ({
                    userProfile: {
                        ...state.userProfile,
                        profileData: {
                            ...state.userProfile.profileData,
                            isComplete
                        }
                    }
                })),

            resetUserProfile: () => set({ userProfile: initialUserProfile })
        }),
        {
            name: 'user-form-storage', // storage key
            version: 1
        }
    )
);

export const isProfileComplete = (profile: IUserProfile): { isComplete: boolean, status: { [key: string]: boolean } } => {
    const {
        profileData: {
            basicInfo,
            educationInfo,
            workInfo,
            languageInfo,
            spouseInfo,
            dependentInfo,
            connectionInfo,
            jobOfferInfo
        }
    } = profile;

    // Check basic info completeness
    const basicComplete: boolean = !!(
        basicInfo.fullName &&
        basicInfo.email &&
        basicInfo.citizenCountry &&
        basicInfo.residenceCountry &&
        basicInfo.mobileNumber
    );

    // Education checks
    const educationComplete: boolean = !!(
        (typeof educationInfo.hasHighSchool === 'boolean') &&
        (typeof educationInfo.hasPostSecondary === 'boolean') &&
        (!educationInfo.hasPostSecondary || (educationInfo.hasPostSecondary && educationInfo.educationList.length > 0))
    );

    // Work experience checks
    const workComplete: boolean = !!(
        (typeof workInfo.hasWorkExperience === 'boolean') &&
        (!workInfo.hasWorkExperience ||
            (workInfo.hasWorkExperience && workInfo.workExperienceList.length > 0))
    );

    // Language checks
    const languageComplete: boolean = !!(
        languageInfo.primaryLanguage &&
        (typeof languageInfo.hasTakenTest === 'boolean') &&
        (!languageInfo.hasTakenTest ||
            (languageInfo.hasTakenTest &&
                languageInfo.primaryLanguageTest.type &&
                languageInfo.primaryLanguageTest.clbScore)) &&
        (typeof languageInfo.hasSecondLanguage === 'boolean') &&
        (!languageInfo.hasSecondLanguage ||
            (languageInfo.hasSecondLanguage &&
                languageInfo.secondLanguageTest.type &&
                languageInfo.secondLanguageTest.clbScore))
    );

    // Spouse checks
    const spouseComplete: boolean = !!(
        spouseInfo.maritalStatus &&
        (spouseInfo.maritalStatus !== 'married' ||
            (typeof spouseInfo.hasCanadianWorkExp === 'boolean' &&
                typeof spouseInfo.hasCanadianStudyExp === 'boolean' &&
                typeof spouseInfo.hasRelativeInCanada === 'boolean' &&
                spouseInfo.educationLevel))
    );

    // Dependent checks
    const dependentComplete: boolean = !!(
        (typeof dependentInfo.hasDependents === 'boolean') &&
        (!dependentInfo.hasDependents ||
            (dependentInfo.hasDependents && dependentInfo.dependentList.length > 0))
    );

    // Connection checks
    const connectionComplete: boolean = !!(
        (typeof connectionInfo?.doesUserHaveFamilyInCanadaWhoIsCitizenOrPermanentResident === 'boolean')
    );

    // Job offer checks
    const jobOfferComplete: boolean = !!(
        (typeof jobOfferInfo.hasJobOffer === 'boolean') &&
        (!jobOfferInfo.hasJobOffer ||
            (jobOfferInfo.hasJobOffer &&
                jobOfferInfo.jobOffer.jobTitle &&
                jobOfferInfo.jobOffer.nocCode &&
                // typeof jobOfferInfo.jobOffer.isPaid === 'boolean' &&
                // jobOfferInfo.jobOffer.hoursPerWeek !== null &&
                jobOfferInfo.jobOffer.province &&
                // typeof jobOfferInfo.jobOffer.isLMIA === 'boolean' &&
                jobOfferInfo.jobOffer.startDate
                // typeof jobOfferInfo.jobOffer.hasEndDate === 'boolean' &&
                // (!jobOfferInfo.jobOffer.hasEndDate || jobOfferInfo.jobOffer.endDate)
            ))
    );

    const status = {
        basic: basicComplete,
        education: educationComplete,
        work: workComplete,
        language: languageComplete,
        spouse: spouseComplete,
        dependent: dependentComplete,
        connection: connectionComplete,
        jobOffer: jobOfferComplete
    };


    const isComplete = Object.values(status).every(value => value);
    return {
        isComplete,
        status
    };
};
