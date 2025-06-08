
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { clientsAPI } from '@/services/api';
import { IUserProfile } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

interface ClientUpdateFormProps {
  client: IUserProfile;
  onBack: () => void;
  onSuccess: () => void;
}

const ClientUpdateForm = ({ client, onBack, onSuccess }: ClientUpdateFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: client.profileData.basicInfo.fullName,
    email: client.profileData.basicInfo.email,
    age: client.profileData.basicInfo.age,
    mobileNumber: client.profileData.basicInfo.mobileNumber,
    citizenCountry: client.profileData.basicInfo.citizenCountry,
    residenceCountry: client.profileData.basicInfo.residenceCountry,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await clientsAPI.updateClient(client._id, {
        basicInfo: {
          ...client.profileData.basicInfo,
          ...formData,
        },
      } as any);

      toast({
        title: "Profile updated",
        description: "Client profile has been successfully updated.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Update Client Profile</h1>
          <p className="text-gray-600">Modify client information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="citizenCountry">Citizen Country</Label>
                <Input
                  id="citizenCountry"
                  value={formData.citizenCountry}
                  onChange={(e) => handleInputChange('citizenCountry', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="residenceCountry">Residence Country</Label>
                <Input
                  id="residenceCountry"
                  value={formData.residenceCountry}
                  onChange={(e) => handleInputChange('residenceCountry', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={onBack} variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientUpdateForm;
