// import { useParams } from "react-router-dom";
// import { consultantsAPI } from "@/services/api";
// import Sidebar from "../layout/Sidebar";
// import { useEffect, useState } from "react";
// import { useAuthStore } from "@/stores/authStore";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Button } from "../ui/button";
// import { Save, Lock, Loader2, Check, CheckCircle } from "lucide-react";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { IConsultant } from "@/types";
// import { Textarea } from "../ui/textarea";
// import { useToast } from "@/hooks/use-toast";
// export default function ConsultantSettings() {

//     const { firmSlug } = useParams();
//     const { consultant, updateConsultant } = useAuthStore();
//     const isOwner = consultant?.role === 'owner';

//     const { toast } = useToast();

//     const [isLoading, setIsLoading] = useState(false);
//     const isProfileCompleted = useAuthStore(state => state.isProfileCompleted);

//     const [password, setPassword] = useState('');
//     const [formData, setFormData] = useState<Partial<IConsultant>>({
//         email: consultant?.email || '',
//         role: consultant?.role || 'consultant',
//         displayName: consultant?.displayName || '',
//         bio: consultant?.bio || '',
//         image: consultant?.image || '',
//         phone: consultant?.phone || '',
//         displayEmail: consultant?.displayEmail || '',
//         type: consultant?.type || 'consultant',
//     });

//     const fetchConsultant = async () => {
//         try {
//             const consultant = await consultantsAPI.getConsultantInfo(firmSlug);
//             updateConsultant(consultant);
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     useEffect(() => {
//         fetchConsultant();
//     }, [isLoading]);

//     async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
//         e.preventDefault();

//         if (!formData.displayName || !formData.phone || !formData.bio || !formData.image) {
//             toast({
//                 title: "Please fill all the fields",
//                 description: "Please fill all the fields",
//                 variant: "destructive",
//             });
//             return;
//         }

//         const data = new FormData();
//         data.append('displayName', formData.displayName);
//         data.append('phone', formData.phone);
//         data.append('bio', formData.bio);
//         data.append('image', formData.image);
//         data.append('displayEmail', formData.displayEmail);

//         try {
//             setIsLoading(true);
//             await consultantsAPI.updateConsultant(data as Partial<IConsultant>);
//             toast({
//                 title: "Profile updated",
//                 description: "Your profile has been updated",
//             });
//             fetchConsultant();
//         } catch (error) {
//             console.error(error);
//             toast({
//                 title: "Profile update failed",
//                 description: "Your profile has not been updated",
//                 variant: "destructive",
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     function handleInputChange(field: string, value: string | File): void {
//         setFormData({ ...formData, [field]: value });
//     }

//     async function handlePasswordUpdate(): Promise<void> {
//         try {
//             await consultantsAPI.updateConsultantPassword(password);
//             toast({
//                 title: "Password updated",
//                 description: "Your password has been updated",
//             });
//         } catch (error) {
//             console.error(error);
//             toast({
//                 title: "Password update failed",
//                 description: "Your password has not been updated",
//                 variant: "destructive",
//             });
//         }
//     }

//     if (isLoading) {
//         return <div className="flex justify-center items-center h-screen">
//             <Loader2 className="h-10 w-10 animate-spin" />
//         </div>
//     }

//     return (
//         <div className="h-screen flex overflow-hidden bg-gray-100">
//             <Sidebar firmSlug={firmSlug} />

//             <div className="flex flex-1 flex-col overflow-hidden ml-64">
//                 <main className="flex-1 relative overflow-y-auto focus:outline-none">
//                     <div className="py-6">
//                         <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
//                             <div className="space-y-6">
//                                 <div className="flex space-x-4 items-center">
//                                     <div className="w-full">
//                                         <div className="flex items-center gap-2 justify-between">
//                                             <div>
//                                                 <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
//                                                 <p className="text-gray-600 mb-6">Keep your profile up to date. this information will be shown to clients.</p>
//                                             </div>
//                                             {isProfileCompleted && <p className="text-green-500 flex items-center gap-2"><CheckCircle className="h-4 w-4 mr-2" /> Profile Completed</p>}
//                                         </div>
//                                         {!consultant?.isPasswordChanged && <Card className="mb-6">
//                                             <CardHeader>
//                                                 <CardTitle>Update Your Password</CardTitle>
//                                             </CardHeader>
//                                             <CardContent>
//                                                 <div>
//                                                     <Label htmlFor="password">Password</Label>
//                                                     <p className="text-gray-600 text-sm m-1">You will need to login again after updating your password</p>
//                                                     <div className="flex space-x-2">
//                                                         <Input
//                                                             id="password"
//                                                             placeholder="Password"
//                                                             value={password}
//                                                             onChange={(e) => setPassword(e.target.value)}
//                                                             required
//                                                         />
//                                                         <Button type="submit" onClick={handlePasswordUpdate}>
//                                                             <Lock className="h-4 w-4 mr-2" />
//                                                             Update Password
//                                                         </Button>
//                                                     </div>
//                                                 </div>
//                                             </CardContent>
//                                         </Card>}
//                                         <Card>
//                                             <CardHeader>
//                                                 <CardTitle>Update Your Profile</CardTitle>
//                                             </CardHeader>
//                                             <CardContent>
//                                                 <form onSubmit={handleSubmit} className="space-y-4">
//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                         <div>
//                                                             <Label htmlFor="displayName">Display Name</Label>
//                                                             <Input
//                                                                 id="displayName"
//                                                                 placeholder="Display Name"
//                                                                 value={formData.displayName}
//                                                                 onChange={(e) => handleInputChange('displayName', e.target.value)}
//                                                                 required
//                                                             />
//                                                         </div>

//                                                         <div>
//                                                             <Label htmlFor="displayEmail">Display Email</Label>
//                                                             <Input
//                                                                 id="displayEmail"
//                                                                 placeholder="Display Email"
//                                                                 value={formData.displayEmail}
//                                                                 onChange={(e) => handleInputChange('displayEmail', e.target.value)}
//                                                                 required
//                                                             />
//                                                         </div>

//                                                         <div>
//                                                             <Label htmlFor="email">Email</Label>
//                                                             <Input
//                                                                 id="email"
//                                                                 type="email"
//                                                                 placeholder="Email"
//                                                                 disabled={!isOwner}
//                                                                 value={formData.email}
//                                                                 onChange={(e) => handleInputChange('email', e.target.value)}
//                                                                 required
//                                                             />
//                                                         </div>

//                                                         <div>
//                                                             <Label htmlFor="role">Role</Label>
//                                                             <Select
//                                                                 value={formData.role}
//                                                                 onValueChange={(value) => handleInputChange('role', value)}
//                                                                 required
//                                                                 disabled={!isOwner}

//                                                             >
//                                                                 <SelectTrigger>
//                                                                     <SelectValue placeholder="Select Role" />
//                                                                 </SelectTrigger>
//                                                                 <SelectContent>
//                                                                     <SelectItem value="consultant">Consultant</SelectItem>
//                                                                     <SelectItem value="team_leader">Team Leader</SelectItem>
//                                                                     <SelectItem value="owner">Owner</SelectItem>
//                                                                 </SelectContent>
//                                                             </Select>
//                                                         </div>

//                                                         <div>
//                                                             <Label htmlFor="phone">Phone</Label>
//                                                             <Input
//                                                                 id="phone"
//                                                                 placeholder="Mobile Number"
//                                                                 value={formData.phone}
//                                                                 onChange={(e) => handleInputChange('phone', e.target.value)}
//                                                                 required
//                                                             />
//                                                         </div>

//                                                         <div>
//                                                             <Label htmlFor="bio">Bio</Label>
//                                                             <Textarea
//                                                                 id="bio"
//                                                                 value={formData.bio}
//                                                                 placeholder="Enter Bio, this will be displayed on the consultant's profile"
//                                                                 onChange={(e) => handleInputChange('bio', e.target.value)}
//                                                                 required
//                                                             />
//                                                         </div>

//                                                         <div>
//                                                             <Label htmlFor="image">Image</Label>
//                                                             <div className="flex justify-between items-center gap-4">
//                                                                 <Input 
//                                                                 type="file" 
//                                                                 id="image" 
//                                                                 accept="image/*" 
//                                                                 className="w-full h-20 border border-gray-300 rounded-md p-6"
//                                                                 onChange={(e) => handleInputChange('image', e.target.files?.[0])}
//                                                             />
//                                                                 {consultant?.image && <img src={consultant?.image} alt="Profile" className="w-20 h-20 rounded-sm" />}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex justify-end space-x-2 pt-4">
//                                                         <Button variant="outline" type="button">
//                                                             Cancel
//                                                         </Button>
//                                                         <Button
//                                                             onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}
//                                                         >
//                                                             <Save className="h-4 w-4 mr-2" />
//                                                             Update Profile
//                                                         </Button>
//                                                     </div>

//                                                 </form>
//                                             </CardContent>
//                                         </Card>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     )
// }


import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { consultantsAPI } from "@/services/api";
import Sidebar from "../layout/Sidebar";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { Save, Lock, Loader2, CheckCircle, User, Mail, Phone, FileText, Image, Shield, Eye, Camera, Upload } from 'lucide-react';
import { IConsultant } from "@/types";

export default function ConsultantSettings() {
    const { firmSlug } = useParams();
    const { consultant, updateConsultant } = useAuthStore();
    const { toast } = useToast();
    const isOwner = consultant?.role === 'owner';
    const isProfileCompleted = useAuthStore(state => state.isProfileCompleted);

    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [imagePreview, setImagePreview] = useState(consultant?.image || '');
    const [isDragOver, setIsDragOver] = useState(false);

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
            setIsLoading(true);
            const consultantData = await consultantsAPI.getConsultantInfo(firmSlug);
            updateConsultant(consultantData);
            setFormData({
                email: consultantData?.email || '',
                role: consultantData?.role || 'consultant',
                displayName: consultantData?.displayName || '',
                bio: consultantData?.bio || '',
                image: consultantData?.image || '',
                phone: consultantData?.phone || '',
                displayEmail: consultantData?.displayEmail || '',
                type: consultantData?.type || 'consultant',
            });
            setImagePreview(consultantData?.image || '');
        } catch (error) {
            console.error(error);
            toast({
                title: "Error loading profile",
                description: "Failed to load consultant profile data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultant();
    }, [firmSlug]);

    const handleSubmit = async (e: React.FormEvent) => {
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
    };

    const handleInputChange = (field: string, value: string | File) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            handleInputChange('image', file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            handleInputChange('image', file);
        }
    };

    const handlePasswordUpdate = async (): Promise<void> => {
        try {
            await consultantsAPI.updateConsultantPassword(password);
            toast({
                title: "Password updated",
                description: "Your password has been updated",
            });
            setPassword('');
        } catch (error) {
            console.error(error);
            toast({
                title: "Password update failed",
                description: "Your password has not been updated",
                variant: "destructive",
            });
        }
    };

    // useEffect(() => {

    // }, [isLoading])

    if (isLoading) {
        return (
            <div className="h-screen flex overflow-hidden bg-gray-100">
                <Sidebar firmSlug={firmSlug} />
                <div className="flex flex-1 flex-col overflow-hidden ml-64">
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100">
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-900" />
                            <p className="text-gray-600 font-medium">Loading your profile...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            <Sidebar firmSlug={firmSlug} />

            <div className="flex flex-1 flex-col overflow-hidden ml-64">
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-100 py-8 px-4">
                        <div className="max-w-5xl mx-auto">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                                        <p className="text-gray-600">Manage your professional profile and account settings</p>
                                    </div>
                                    {isProfileCompleted && (
                                        <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            <span className="font-medium">Profile Complete</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-8">
                                {/* Password Update Card - Only show if password hasn't been changed */}
                                {!consultant?.isPasswordChanged && (
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                        <div className="bg-slate-800 px-6 py-4">
                                            <div className="flex items-center">
                                                <Lock className="h-6 w-6 text-white mr-3" />
                                                <div>
                                                    <h2 className="text-xl font-semibold text-white">Security Update Required</h2>
                                                    <p className="text-blue-200 text-sm">Please update your password to continue</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <input
                                                        type="password"
                                                        placeholder="Enter new password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none transition-all"
                                                    />
                                                    <p className="text-sm text-gray-500 mt-2">You'll need to sign in again after updating</p>
                                                </div>
                                                <button
                                                    onClick={handlePasswordUpdate}
                                                    className="px-6 bg-slate-800 text-white h-12 font-medium rounded-lg transition-all duration-200 flex items-center"
                                                >
                                                    <Lock className="h-4 w-4 mr-2" />
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Main Profile Form */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                    <div className="bg-slate-800 px-6 py-6">
                                        <div className="flex items-center">
                                            <User className="h-6 w-6 text-white mr-3" />
                                            <div>
                                                <h2 className="text-xl font-semibold text-white">Consultant Profile</h2>
                                                <p className="text-blue-200 text-sm">This information will be visible to your clients</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Profile Image Section */}
                                        <div className="mb-8">
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">Profile Picture</label>
                                            <div className="flex items-start space-x-6">
                                                <div className="relative">
                                                    <div className="w-32 h-32 rounded-md overflow-hidden bg-gray-100 border-4 border-gray-400 shadow-lg">
                                                        {imagePreview ? (
                                                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                                                <User className="h-8 w-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div
                                                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                        onDrop={handleDrop}
                                                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                                        onDragLeave={() => setIsDragOver(false)}
                                                    >
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                            id="image-upload"
                                                        />
                                                        <label htmlFor="image-upload" className="cursor-pointer">
                                                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                            <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 1MB</p>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Display Name */}
                                            <div className="lg:col-span-1">
                                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                                    <User className="h-4 w-4 mr-2 text-gray-500" />
                                                    Display Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.displayName}
                                                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none transition-all"
                                                    placeholder="Your professional name"
                                                    required
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="lg:col-span-1">
                                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none transition-all"
                                                    placeholder="+1 (555) 123-4567"
                                                    required
                                                />
                                            </div>

                                            {/* Display Email */}
                                            <div className="lg:col-span-1">
                                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                                    <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                                    Display Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.displayEmail}
                                                    onChange={(e) => handleInputChange('displayEmail', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none transition-all"
                                                    placeholder="Email shown to clients"
                                                    required
                                                />
                                            </div>

                                            {/* Account Email */}
                                            <div className="lg:col-span-1">
                                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                                    Account Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    disabled={!isOwner}
                                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all ${isOwner
                                                            ? 'focus:ring-2 focus:ring-blue-800 focus:border-transparent'
                                                            : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    placeholder="Account login email"
                                                    required
                                                />
                                                {!isOwner && <p className="text-xs text-gray-500 mt-1">Only owners can modify account email</p>}
                                            </div>

                                            {/* Role */}
                                            <div className="lg:col-span-1">
                                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                                    <Shield className="h-4 w-4 mr-2 text-gray-500" />
                                                    Role
                                                </label>
                                                <select
                                                    value={formData.role}
                                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                                    disabled={!isOwner}
                                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-all ${isOwner
                                                            ? 'focus:ring-2 focus:ring-blue-800 focus:border-transparent'
                                                            : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    required
                                                >
                                                    <option value="consultant">Consultant</option>
                                                    <option value="team_leader">Team Leader</option>
                                                    <option value="owner">Owner</option>
                                                </select>
                                                {!isOwner && <p className="text-xs text-gray-500 mt-1">Only owners can modify roles</p>}
                                                {isOwner && <p className="text-xs text-gray-500 mt-1">NOTE: Do not de-grade your role unless you are sure about it, once you changed your role lower then owner you will lose access to owner specific features.</p>}

                                            </div>

                                            {/* Bio */}
                                            <div className="lg:col-span-2">
                                                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                                    Professional Bio
                                                </label>
                                                <textarea
                                                    value={formData.bio}
                                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none transition-all resize-none"
                                                    placeholder="Tell clients about your expertise, experience, and what makes you unique..."
                                                    required
                                                />
                                                <p className="text-xs text-gray-500 mt-1">This will be shown on your public profile</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                                            <button
                                                type="button"
                                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isLoading}
                                                className="px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:from-blue-900 hover:to-blue-800 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4 mr-2" />
                                                )}
                                                {isLoading ? 'Updating...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}