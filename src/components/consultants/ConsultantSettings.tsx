import { useParams } from "react-router-dom";
import { consultantsAPI } from "@/services/api";
import Sidebar from "../layout/Sidebar";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Save, Lock, Loader2, Check, CheckCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { IConsultant } from "@/types";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
export default function ConsultantSettings() {

    const { firmSlug } = useParams();
    const { consultant, updateConsultant } = useAuthStore();
    const isOwner = consultant?.role === 'owner';

    const [isLoading, setIsLoading] = useState(false);
    const isProfileCompleted = useAuthStore(state => state.isProfileCompleted);

    const [password, setPassword] = useState('');
    const [formData, setFormData] = useState<Partial<IConsultant>>({
        email: consultant?.email || '',
        role: consultant?.role || 'consultant',
        displayName: consultant?.displayName || '',
        bio: consultant?.bio || '',
        image: consultant?.image || '',
        phone: consultant?.phone || '',
        displayEmail: consultant?.displayEmail || '',
        type: consultant?.type || 'consultant',
    });

    const fetchConsultant = async () => {
        try {
            const consultant = await consultantsAPI.getConsultantInfo(firmSlug);
            updateConsultant(consultant);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchConsultant();
    }, [isLoading]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();

        if (!formData.displayName || !formData.phone || !formData.bio || !formData.image) {
            toast({
                title: "Please fill all the fields",
                description: "Please fill all the fields",
                variant: "destructive",
            });
            return;
        }

        const data = new FormData();
        data.append('displayName', formData.displayName);
        data.append('phone', formData.phone);
        data.append('bio', formData.bio);
        data.append('image', formData.image);
        data.append('displayEmail', formData.displayEmail);

        try {
            setIsLoading(true);
            await consultantsAPI.updateConsultant(data as Partial<IConsultant>);
            toast({
                title: "Profile updated",
                description: "Your profile has been updated",
            });
            fetchConsultant();
        } catch (error) {
            console.error(error);
            toast({
                title: "Profile update failed",
                description: "Your profile has not been updated",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    function handleInputChange(field: string, value: string | File): void {
        setFormData({ ...formData, [field]: value });
    }

    async function handlePasswordUpdate(): Promise<void> {
        try {
            await consultantsAPI.updateConsultantPassword(password);
            toast({
                title: "Password updated",
                description: "Your password has been updated",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Password update failed",
                description: "Your password has not been updated",
                variant: "destructive",
            });
        }
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-10 w-10 animate-spin" />
        </div>
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            <Sidebar firmSlug={firmSlug} />

            <div className="flex flex-1 flex-col overflow-hidden ml-64">
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <div className="space-y-6">
                                <div className="flex space-x-4 items-center">
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 justify-between">
                                            <div>
                                                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                                                <p className="text-gray-600 mb-6">Keep your profile up to date. this information will be shown to clients.</p>
                                            </div>
                                            {isProfileCompleted && <p className="text-green-500 flex items-center gap-2"><CheckCircle className="h-4 w-4 mr-2" /> Profile Completed</p>}
                                        </div>
                                        {!consultant?.isPasswordChanged && <Card className="mb-6">
                                            <CardHeader>
                                                <CardTitle>Update Your Password</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div>
                                                    <Label htmlFor="password">Password</Label>
                                                    <p className="text-gray-600 text-sm m-1">You will need to login again after updating your password</p>
                                                    <div className="flex space-x-2">
                                                        <Input
                                                            id="password"
                                                            placeholder="Password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                        />
                                                        <Button type="submit" onClick={handlePasswordUpdate}>
                                                            <Lock className="h-4 w-4 mr-2" />
                                                            Update Password
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Update Your Profile</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="displayName">Display Name</Label>
                                                            <Input
                                                                id="displayName"
                                                                placeholder="Display Name"
                                                                value={formData.displayName}
                                                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label htmlFor="displayEmail">Display Email</Label>
                                                            <Input
                                                                id="displayEmail"
                                                                placeholder="Display Email"
                                                                value={formData.displayEmail}
                                                                onChange={(e) => handleInputChange('displayEmail', e.target.value)}
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label htmlFor="email">Email</Label>
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                placeholder="Email"
                                                                disabled={!isOwner}
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
                                                                disabled={!isOwner}

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

                                                        <div>
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
                                                            <div className="flex justify-between items-center gap-4">
                                                                <Input 
                                                                type="file" 
                                                                id="image" 
                                                                accept="image/*" 
                                                                className="w-full h-20 border border-gray-300 rounded-md p-6"
                                                                onChange={(e) => handleInputChange('image', e.target.files?.[0])}
                                                            />
                                                                {consultant?.image && <img src={consultant?.image} alt="Profile" className="w-20 h-20 rounded-sm" />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end space-x-2 pt-4">
                                                        <Button variant="outline" type="button">
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}
                                                        >
                                                            <Save className="h-4 w-4 mr-2" />
                                                            Update Profile
                                                        </Button>
                                                    </div>

                                                </form>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}