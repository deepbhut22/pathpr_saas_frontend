
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReportsStore } from '@/stores/reportsStore';
import { reportsAPI } from '@/services/api';
import { IUserProfile, IUserProfileModel } from '@/types';
import { 
  ArrowLeft, 
  Edit, 
  MessageSquare, 
  User, 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserFormDataStore } from '@/stores/userFormDataStore';

interface ClientProfileProps {
  client: IUserProfile;
  onBack: () => void;
  onEdit: () => void;
  onViewReport: () => void;
  onOpenChat: () => void;
}

const ClientProfile = ({ 
  client, 
  onBack, 
  onEdit, 
  onViewReport, 
  onOpenChat 
}: ClientProfileProps) => {
  const { reports, setReports, setSelectedReport, loading, setLoading } = useReportsStore();
  const { toast } = useToast();

  useEffect(() => {
    loadReports();    
  }, [client._id]);


  const { userProfile, setUserProfile } = useUserFormDataStore();

  const handleEdit = () => {
    setUserProfile(client.profileData as IUserProfileModel);
    onEdit();
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const clientReports = await reportsAPI.getReportsByClientId(client._id);
      setReports(clientReports);
    } catch (error: any) {
      toast({
        title: "Error loading reports",
        description: error.response?.data?.message || "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = (reportId: string) => {
    const report = reports.find(r => r._id === reportId);
    if (report) {
      setSelectedReport(report);
      onViewReport();
    }
  };

  const { profileData } = client;

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
          <Button onClick={handleEdit} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Update Profile
          </Button>
          <Button onClick={onOpenChat}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with MapleAI
          </Button>
        </div>
      </div>

      {/* Immigration Reports Slider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Immigration Reports
            {reports.length > 0 && (
              <Badge variant="secondary">{reports.length} reports</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex space-x-4 overflow-x-auto">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-80 h-40 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No immigration reports available</p>
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {reports?.map((report) => (
                <Card 
                  key={report._id}
                  className="flex-shrink-0 w-80 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleReportClick(report._id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">Immigration Assessment</h4>
                        <Badge variant="outline">
                          CRS: {report?.content?.expressEntry?.expressEntry?.crsScore}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Generated on {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                      </p>
                      <div className="pt-2">
                        <p className="text-sm font-medium text-blue-600">
                          Click to view full report →
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-sm">{profileData.basicInfo.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="text-sm">{profileData.basicInfo.age}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="text-sm">{profileData.basicInfo.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Mobile</p>
                <p className="text-sm">{profileData.basicInfo.mobileNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Citizen Country</p>
                <p className="text-sm">{profileData.basicInfo.citizenCountry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Residence Country</p>
                <p className="text-sm">{profileData.basicInfo.residenceCountry}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Information */}
        <Card>
          <CardHeader>
            <CardTitle>Language Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Primary Language</p>
              <p className="text-sm">{profileData.languageInfo.primaryLanguage}</p>
            </div>
            {profileData.languageInfo.hasTakenTest && (
              <div>
                <p className="text-sm font-medium text-gray-500">Primary Language Test</p>
                <p className="text-sm">
                  {profileData.languageInfo.primaryLanguageTest.type} - 
                  CLB Score: {profileData.languageInfo.primaryLanguageTest.clbScore}
                </p>
              </div>
            )}
            {profileData.languageInfo.hasSecondLanguage && (
              <div>
                <p className="text-sm font-medium text-gray-500">Second Language Test</p>
                <p className="text-sm">
                  {profileData.languageInfo.secondLanguageTest.type} - 
                  CLB Score: {profileData.languageInfo.secondLanguageTest.clbScore}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education Information */}
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileData.educationInfo.educationList.map((education, index) => (
              <div key={education.id} className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">{education.type}</p>
                <p className="text-sm text-gray-600">{education.fieldOfStudy}</p>
                <p className="text-sm text-gray-500">{education.country}</p>
                {education.inProgress && (
                  <Badge variant="secondary" className="mt-1">In Progress</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileData.workInfo.workExperienceList.map((work, index) => (
              <div key={work.id} className="border-l-4 border-green-500 pl-4">
                <p className="font-medium">{work.jobTitle}</p>
                <p className="text-sm text-gray-600">NOC: {work.nocCode}</p>
                <p className="text-sm text-gray-500">
                  {work.country} • {work.numberOfMonths} months
                </p>
                {work.isCurrentJob && (
                  <Badge variant="secondary" className="mt-1">Current</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfile;
