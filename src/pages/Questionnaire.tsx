'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Step } from '@/types';
import { getNextStep } from '@/utils/helpers';
import { useUserFormDataStore } from '@/stores/userFormDataStore';
import QuestionnaireLayout from '@/components/questionnaire/QuestionnaireLayout';
import BasicInfo from '@/components/questionnaire/steps/BasicInfo';
import Language from '@/components/questionnaire/steps/Language';
import Education from '@/components/questionnaire/steps/Education';
import Spouse from '@/components/questionnaire/steps/Spouse';
import Dependent from '@/components/questionnaire/steps/Dependent';
import Connection from '@/components/questionnaire/steps/Connection';
import Work from '@/components/questionnaire/steps/Work';
import JobOffer from '@/components/questionnaire/steps/JobOffer';
// import { isProfileComplete } from '@/utils/profileUtils';
import { clientsAPI } from '@/services/api';

export default function Questionnaire() {
    const params = useParams();
    const step = typeof params.step === 'string' ? params.step : 'basic';
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setProfileComplete } = useUserFormDataStore();
    // console.log('Rendering step page');
    // console.log('Step:', step);

    const currentStep = step as Step;

    const handleValidationChange = (valid: boolean) => {
        setIsValid(valid);
    };

    const handleNext = async () => {
        
        // setIsSubmitting(true);
        // if (currentStep === 'joboffer' && isProfileComplete(useUserFormDataStore.getState().userProfile).isComplete) {
        //     handleSave();
        // }

        // Simulating saving to backend
        setTimeout(() => {
            const nextStep = getNextStep(currentStep);

            if (nextStep) {
                navigate(`/${params.slug}/data-form/${nextStep}/${params.token}`);
            } else {
                // This is the last step, mark profile as complete and redirect to report
                setProfileComplete(true);
                handleSave();
                // navigate('/');
            }

            setIsSubmitting(false);
        }, 500);
    };

    const handlePrevious = () => {
        const prevUrl = currentStep === 'basic' ? `/${params.slug}` : `/${params.slug}/data-form/${getPrevStep()}/${params.token}`;
        navigate(prevUrl);
    };

    const handleSave = async () => {
        try {
            // const response = await api.put(`/client/update-profile/${params.token}`, useUserFormDataStore.getState().userProfile.profileData);
            await clientsAPI.updateClient(params.token, useUserFormDataStore.getState().userProfile.profileData);

        } catch (error) {
            console.error('Error saving progress:', error);
            alert('Error saving progress!');
        }
    };

    const getPrevStep = (): string => {
        switch (currentStep) {
            case 'language':
                return 'basic';
            case 'education':
                return 'language';
            case 'spouse':
                return 'education';
            case 'dependent':
                return 'spouse';
            case 'connection':
                return 'dependent';
            case 'work':
                return 'connection';
            case 'joboffer':
                return 'work';
            default:
                return 'basic';
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'basic':
                return <BasicInfo onValidationChange={handleValidationChange} />;
            case 'language':
                return <Language onValidationChange={handleValidationChange} />;
            case 'education':
                return <Education onValidationChange={handleValidationChange} />;
            case 'spouse':
                return <Spouse onValidationChange={handleValidationChange} />;
            case 'dependent':
                return <Dependent onValidationChange={handleValidationChange} />;
            case 'connection':
                return <Connection onValidationChange={handleValidationChange} />;
            case 'work':
                return <Work onValidationChange={handleValidationChange} />;
            case 'joboffer':
                return <JobOffer onValidationChange={handleValidationChange} />;
            default:
                return <div>Invalid step</div>;
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
        <div className='bg-slate-950'>
            <div className='bg-slate-900 border border-slate-700 p-6 flex justify-between items-center gap-2 mx-10 my-2'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-white text-2xl font-bold'>firm name</h1>
                    <p className='text-white text-sm'>firm description</p>
                </div>
                <p>logo</p>
            </div>
            <QuestionnaireLayout
                currentStep={currentStep}
                isValid={isValid}
                isSubmitting={isSubmitting}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSave={handleSave}
            >
                {renderStepContent()}
            </QuestionnaireLayout>
        </div>
        </>
    );
}