import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { clientsAPI, consultantsAPI, dashboardAPI } from '@/services/api';
import { IConsultant, IConsultantFirm, IUserProfile, IUserProfileModel } from '@/types';
import { ArrowLeft, Edit, MessageSquare, Save } from 'lucide-react';
import { useUserFormDataStore } from '@/stores/userFormDataStore';
import QuestionnaireLayout from '../questionnaire/QuestionnaireLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { Step } from '@/types';
import { getNextStep } from '@/utils/helpers';
import BasicInfo from '../questionnaire/steps/BasicInfo';
import Language from '../questionnaire/steps/Language';
import Education from '../questionnaire/steps/Education';
import Spouse from '../questionnaire/steps/Spouse';
import Dependent from '../questionnaire/steps/Dependent';
import Connection from '../questionnaire/steps/Connection';
import Work from '../questionnaire/steps/Work';
import JobOffer from '../questionnaire/steps/JobOffer';
import { isProfileComplete } from '@/stores/userFormDataStore';
import { useReportsStore } from '@/stores/reportsStore';

interface ClientUpdateFormProps {
  client: IUserProfile;
  onBack: () => void;
  onSuccess: () => void;
}

const ClientUpdateForm = ({ client, onBack, onSuccess }: ClientUpdateFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { setUserProfile } = useUserFormDataStore();

  // console.log(client);

  const params = useParams();
  const step = typeof params.step === 'string' ? params.step : 'basic';
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentStepState, setCurrentStepState] = useState(step as Step);

  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
  };

  const handleNext = async (stepId?: Step) => {

    if (stepId !== null) {
      handleSave();
      setCurrentStepState(stepId);
    } else {
      handleSave();
      setCurrentStepState(getNextStep(currentStepState));
    }
  };

  const handlePrevious = () => {
    // const prevUrl = currentStep === 'basic' ? `/${params.slug}` : `/${params.slug}/data-form/${getPrevStep()}/${params.token}`;
    // navigate(prevUrl);
    setCurrentStepState(getPrevStep() as Step);
  };

  const handleSave = async () => {
    try {
      const response = await consultantsAPI.updateClientProfile(client._id, useUserFormDataStore.getState().userProfile.profileData[getStepName(currentStepState)], currentStepState);
      setUserProfile(response.profileData  as IUserProfileModel);
      toast({
        title: "Profile updated",
        description: "Client profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Error saving progress!');
    }
  };

  const regenerateReport = async () => {
    console.log('regenerating report');
    try {
      // const response = await api.put(`/client/update-profile/${params.token}`, useUserFormDataStore.getState().userProfile.profileData);
      const response = await consultantsAPI.reGenerateReport(client._id);
      toast({
        title: "Report Re-Generation has been started",
        description: "Please wait for some time, report will be generated in background."
      })

    } catch (error) {
      // console.error('Error saving progress:', error);
      // alert('Error saving progress!');
      toast({
        title: "Failed to regenerate report",
        description: "User profile has been updated since last report generation.",
        variant: "destructive",
      });
    }
  }

  const getPrevStep = (): string => {
    switch (currentStepState) {
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

  const getStepName = (step: Step) => {
    switch (step) {
      case 'basic':
        return 'basicInfo';
      case 'language':
        return 'languageInfo';
      case 'education':
        return 'educationInfo';
      case 'spouse':
        return 'spouseInfo';
      case 'dependent':
        return 'dependentInfo';
      case 'connection':
        return 'connectionInfo';
      case 'work':
        return 'workInfo';
      case 'joboffer':
        return 'jobOfferInfo';
      default:
        return 'basic';
    }
  };

  const renderStepContent = () => {
    switch (currentStepState) {
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
    setUserProfile(client.profileData as IUserProfileModel);
  }, [currentStepState]);
  

  // const [formData, setFormData] = useState({
  //   fullName: client.profileData.basicInfo.fullName,
  //   email: client.profileData.basicInfo.email,
  //   age: client.profileData.basicInfo.age,
  //   mobileNumber: client.profileData.basicInfo.mobileNumber,
  //   citizenCountry: client.profileData.basicInfo.citizenCountry,
  //   residenceCountry: client.profileData.basicInfo.residenceCountry,
  // });

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     await clientsAPI.updateClient(client._id, {
  //       basicInfo: {
  //         ...client.profileData.basicInfo,
  //         ...formData,
  //       },
  //     } as any);

  //     toast({
  //       title: "Profile updated",
  //       description: "Client profile has been successfully updated.",
  //     });
      
  //     onSuccess();
  //   } catch (error: any) {
  //     toast({
  //       title: "Update failed",
  //       description: error.response?.data?.message || "Failed to update profile",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleInputChange = (field: string, value: string | number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  // return (
  //   <div className="space-y-6">
  //     <div className="flex items-center space-x-4">
  //       <Button onClick={onBack} variant="outline" size="sm">
  //         <ArrowLeft className="h-4 w-4 mr-2" />
  //         Back to Profile
  //       </Button>
  //       <div>
  //         <h1 className="text-2xl font-bold text-gray-900">Update Client Profile</h1>
  //         <p className="text-gray-600">Modify client information</p>
  //       </div>
  //     </div>

  //     <Card>
  //       <CardHeader>
  //         <CardTitle>Basic Information</CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <form onSubmit={handleSubmit} className="space-y-4">
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //             <div>
  //               <Label htmlFor="fullName">Full Name</Label>
  //               <Input
  //                 id="fullName"
  //                 value={formData.fullName}
  //                 onChange={(e) => handleInputChange('fullName', e.target.value)}
  //                 required
  //               />
  //             </div>
              
  //             <div>
  //               <Label htmlFor="email">Email</Label>
  //               <Input
  //                 id="email"
  //                 type="email"
  //                 value={formData.email}
  //                 onChange={(e) => handleInputChange('email', e.target.value)}
  //                 required
  //               />
  //             </div>
              
  //             <div>
  //               <Label htmlFor="age">Age</Label>
  //               <Input
  //                 id="age"
  //                 type="number"
  //                 value={formData.age}
  //                 onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
  //                 required
  //               />
  //             </div>
              
  //             <div>
  //               <Label htmlFor="mobileNumber">Mobile Number</Label>
  //               <Input
  //                 id="mobileNumber"
  //                 value={formData.mobileNumber}
  //                 onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
  //                 required
  //               />
  //             </div>
              
  //             <div>
  //               <Label htmlFor="citizenCountry">Citizen Country</Label>
  //               <Input
  //                 id="citizenCountry"
  //                 value={formData.citizenCountry}
  //                 onChange={(e) => handleInputChange('citizenCountry', e.target.value)}
  //                 required
  //               />
  //             </div>
              
  //             <div>
  //               <Label htmlFor="residenceCountry">Residence Country</Label>
  //               <Input
  //                 id="residenceCountry"
  //                 value={formData.residenceCountry}
  //                 onChange={(e) => handleInputChange('residenceCountry', e.target.value)}
  //                 required
  //               />
  //             </div>
  //           </div>
            
  //           <div className="flex justify-end space-x-2 pt-4">
  //             <Button onClick={onBack} variant="outline" type="button">
  //               Cancel
  //             </Button>
  //             <Button type="submit" disabled={isLoading}>
  //               <Save className="h-4 w-4 mr-2" />
  //               {isLoading ? "Saving..." : "Save Changes"}
  //             </Button>
  //           </div>
  //         </form>
  //       </CardContent>
  //     </Card>
  //   </div>
  // );
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.fullName}</h1>
            <p className="text-gray-600">{client.email}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            disabled={!isProfileComplete(useUserFormDataStore.getState().userProfile).isComplete}
            onClick={regenerateReport}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Re-Generate Report
          </Button>
          <Button 
            // onClick={onOpenChat}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with MapleAI
          </Button>
        </div>
      </div>
    <div className='w-full'>
      <QuestionnaireLayout

        currentStep={currentStepState}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSave={handleSave}
        // consultant={consultant}
        // firm={firm}
      >
        {renderStepContent()}
      </QuestionnaireLayout>
    </div>
    </div>
  )
};

export default ClientUpdateForm;
