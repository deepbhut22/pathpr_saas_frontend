
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { consultantsAPI } from '@/services/api';
import { IConsultant, CreateConsultantDto } from '@/types';
import { AppleIcon, ArrowLeft, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
interface ClientUpdateFormProps {
    // consultant: IConsultant;
    onBack: () => void;
    onSuccess: () => void;
}

const ConsultantModal = ({ onBack, onSuccess }: ClientUpdateFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { firmSlug } = useParams();


    const [formData, setFormData] = useState({
        email: '',
        role: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.email || !formData.role) {
            toast({
                title: "Create Consultant Operation Failed",
                description: "Please enter email and role.",
                variant: "destructive",
            });
        }

        try {

            const isProfileCompleted = useAuthStore.getState().isProfileCompleted;

            if (!isProfileCompleted) {
                toast({
                    title: 'Please complete your profile',
                    description: 'Please complete your profile to create a consultant',
                    variant: 'destructive',
                });
                return;
            }
            const data =await consultantsAPI.createConsultant(formData as CreateConsultantDto);

            setFormData({
                email: '',
                role: '',
            });
            
            toast({
                title: "New Consultant Added Successfully!",
                variant: "default"
            })

            onSuccess();
        } catch (error: any) {
            toast({
                title: "Create Consultant Operation Failed",
                description: error.response?.data?.message || "Server Error, Please Try After Some Time!",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string | number | File) => {
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
                    Back to Consultants List
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Consultant To Your Firm</h1>
                </div>
            </div>
            <p className="text-gray-600 bg-gray-100 p-4 rounded-md">
                <span className="font-bold italic">Note: </span>
                Please enter the email that will be the primary credential for the consultant to get access to the platform. The consultant will be able to change their password after their first login and will be asked to update their profile information after login. 
                <span className="font-bold italic">This email might be used to send important mails to the consultant.</span>
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>Consultant Primary Credential</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* <div>
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input
                                    id="displayName"
                                    placeholder="Display Name"
                                    value={formData.displayName}
                                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                                    required
                                />
                            </div> */}

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => handleInputChange('role', value)}
                                    required

                                >   
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="consultant">Consultant</SelectItem>
                                        <SelectItem value="team_leader">Team Leader</SelectItem>
                                        <SelectItem value="owner">Owner</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    placeholder="Mobile Number"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    placeholder="Enter Bio, this will be displayed on the consultant's profile"
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="image">Image</Label>
                                <Input 
                                    type="file" 
                                    id="image" 
                                    accept="image/*" 
                                    className="w-full h-max border border-gray-300 rounded-md p-6"
                                    onChange={(e) => handleInputChange('image', e.target.files?.[0])}
                                />
                            </div> */}
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button onClick={onBack} variant="outline" type="button">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? "Creating..." : "Create Consultant"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ConsultantModal;
