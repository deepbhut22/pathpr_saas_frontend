import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useParams } from "react-router-dom";
import { firmAPI } from "@/services/api";
import { IConsultantFirm } from "@/types/index";
import { useToast } from "@/hooks/use-toast";

export default function FirmSettings() {
    const [formData, setFormData] = useState<Partial<IConsultantFirm>>({
        name: '',
        description: '',
        logo: null,
        websiteUrl: '',
    });
    const [firm, setFirm] = useState<IConsultantFirm | null>(null);
    const { toast } = useToast();
    
    const { firmSlug } = useParams();

    const fetchFirm = async () => {
        const response = await firmAPI.getFirmBySlug(firmSlug as string);
        
        setFormData({
            name: response.name,
            description: response.description,
            logo: response.logo,
            websiteUrl: response.websiteUrl,
        });
        
    }

    useEffect(() => {
        fetchFirm();
    }, []);


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name as string);
        formDataToSend.append('description', formData.description as string);
        formDataToSend.append('logo', formData.logo as unknown as File);
        formDataToSend.append('websiteUrl', formData.websiteUrl as string);
        
        try {
            const response = await firmAPI.updateFirm(formDataToSend as unknown as Partial<IConsultantFirm>);
            if (response) {
                toast({
                    title: "Firm updated successfully",
                    description: "Firm updated successfully",
                });
            }
        } catch (error) {
            console.error(error);
        }

    }

    function handleInputChange(field: string, value: string | File): void {
        setFormData({ ...formData, [field]: value });
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
                                                <h1 className="text-2xl font-bold text-gray-900">Firm Information</h1>
                                                <p className="text-gray-600 mb-6">Keep your Firm Information up to date. this information will be shown to clients.</p>
                                            </div>
                                        </div>
                                        {/* {!consultant?.isPasswordChanged && <Card className="mb-6">
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
                                        </Card>} */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Update Your Profile</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="name">Firm Name</Label>
                                                            <Input
                                                                id="name"
                                                                placeholder="Firm Name"
                                                                value={formData.name}
                                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                                required
                                                            />
                                                        </div>

                                                        

                                                        {/* <div>
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
                                                        </div> */}

                                                        {/* <div>
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
                                                        </div> */}

                                                        <div>
                                                            <Label htmlFor="websiteUrl">Website URL</Label>
                                                            <Input
                                                                id="websiteUrl"
                                                                placeholder="Website URL"
                                                                value={formData.websiteUrl}
                                                                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                                                                required
                                                            />
                                                        </div>

                                                        {/* <div>
                                                            <Label htmlFor="bio">Bio</Label>
                                                            <Textarea
                                                                id="bio"
                                                                value={formData.bio}
                                                                placeholder="Enter Bio, this will be displayed on the consultant's profile"
                                                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                                                required
                                                            />
                                                        </div> */}

                                                        <div>
                                                            <Label htmlFor="description">Description</Label>
                                                            <Textarea
                                                                id="description"
                                                                placeholder="Enter Description"
                                                                value={formData.description}
                                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label htmlFor="image">Firm Image</Label>
                                                            <div className="flex justify-between items-center gap-4">
                                                                <Input
                                                                    type="file"
                                                                    id="image"
                                                                    accept="image/*"
                                                                    className="w-full h-20 border border-gray-300 rounded-md p-6"
                                                                    onChange={(e) => handleInputChange('logo', e.target.files?.[0])}
                                                                />
                                                                {formData?.logo && <img src={formData?.logo} alt="Profile" className="w-20 h-20 rounded-sm" />}
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