import React, { useEffect, useState } from 'react';
import { Building2, User, Mail, Phone, Globe, Calendar, FileText, ExternalLink } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientsAPI } from '@/services/api';

// Types based on your interfaces
interface IConsultantFirm {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    websiteUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IConsultant {
    _id: string;
    email: string;
    displayName: string;
    role: string;
    type: 'consultant' | 'lawyer';
    firmId: string;
    phone?: string;
    image?: string;
    displayEmail?: string;
    bio?: string;
    isPasswordChanged?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FirmInfo = () => {
    const params = useParams();
    const token = params.token;
    const [firm, setFirm] = useState<IConsultantFirm | null>(null);
    const [consultant, setConsultant] = useState<IConsultant | null>(null);

    const navigate = useNavigate();

    const handleFillData = () => {
        navigate(`/${firm?.slug}/data-form/basic/${token}`, { state: { firm: firm, consultant: consultant } });
    }

    const fetchData = async () => {
        try {
            const response = await clientsAPI.getFirmAndConsultant(token as string);
            console.log(response);
            
            setFirm(response.firm);
            setConsultant(response.consultant);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);


    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (!firm || !consultant) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header with Top Fill Data Button */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                            Consultancy Information
                        </h1>
                        <p className="text-secondary-600">
                            Review the details below before proceeding with your consultation
                        </p>
                    </div>
                    <button
                        onClick={handleFillData}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                        Fill Data
                    </button>
                </div>

                {/* Firm Information Card */}
                <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <Building2 className="w-6 h-6 text-primary-foreground" />
                            <h2 className="text-xl font-semibold text-primary-foreground">
                                Firm Information
                            </h2>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-start space-x-4 mb-6">
                            {firm?.logo ? (
                                <img
                                    src={firm.logo}
                                    alt={`${firm.name} logo`}
                                    className="w-20 h-20 rounded-lg object-cover border-2 border-secondary-200"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center border-2 border-primary/20">
                                    <span className="text-primary font-bold text-lg">
                                        {getInitials(firm.name)}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                                    {firm.name}
                                </h3>
                                <div className="flex items-center text-secondary-600 mb-2">
                                    <span className="text-sm bg-secondary-100 py-1 rounded">
                                        @{firm.slug}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {firm?.description && (
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-3">
                                    <FileText className="w-4 h-4 text-secondary-500" />
                                    <span className="font-medium text-secondary-700">Description</span>
                                </div>
                                <p className="text-secondary-600 leading-relaxed pl-6">
                                    {firm.description}
                                </p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                            {firm?.websiteUrl && (
                                <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                                    <Globe className="w-5 h-5 text-secondary-500" />
                                    <div>
                                        <span className="text-sm font-medium text-secondary-700 block">Website</span>
                                        <a
                                            href={firm.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80 text-sm flex items-center space-x-1"
                                        >
                                            <span>{firm.websiteUrl}</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-secondary-500" />
                                <div>
                                    <span className="text-sm font-medium text-secondary-700 block">With Pathpr From</span>
                                    <span className="text-sm text-secondary-600">
                                        {formatDate(firm.createdAt)}
                                    </span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Consultant Information Card */}
                <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-accent to-accent/80 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <User className="w-6 h-6 text-accent-foreground" />
                            <h2 className="text-xl font-semibold text-accent-foreground">
                                Consultant Information
                            </h2>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            {consultant?.image ? (
                                <img
                                    src={consultant.image}
                                    alt={`${consultant.displayName}`}
                                    className="w-32 h-32 rounded-md object-cover border-2 border-secondary-200"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center border-2 border-accent/20">
                                    <span className="text-accent font-bold text-lg">
                                        {getInitials(consultant.displayName)}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-secondary-900 mb-2">
                                    {consultant.displayName}
                                </h3>
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="bg-accent/10 py-1 rounded-full text-sm font-medium">
                                        {consultant.type === 'consultant' ? 'Consultant' : 'Lawyer'} @{firm.name}
                                    </span>
                                    {/* <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm">
                                        {consultant.role}
                                    </span> */}
                                </div>
                            </div>
                        </div>

                        {consultant?.bio && (
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 mb-3">
                                    <FileText className="w-4 h-4 text-secondary-500" />
                                    <span className="font-medium text-secondary-700">Biography</span>
                                </div>
                                <p className="text-secondary-600 leading-relaxed pl-6">
                                    {consultant.bio}
                                </p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                                <Mail className="w-5 h-5 text-secondary-500" />
                                <div>
                                    <span className="text-sm font-medium text-secondary-700 block">Email</span>
                                    <a
                                        href={`mailto:${consultant.displayEmail || consultant.email}`}
                                        className="text-primary hover:text-primary/80 text-sm"
                                    >
                                        {consultant.displayEmail || consultant.email}
                                    </a>
                                </div>
                            </div>

                            {consultant?.phone && (
                                <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                                    <Phone className="w-5 h-5 text-secondary-500" />
                                    <div>
                                        <span className="text-sm font-medium text-secondary-700 block">Phone</span>
                                        <a
                                            href={`tel:${consultant.phone}`}
                                            className="text-primary hover:text-primary/80 text-sm"
                                        >
                                            {consultant.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Fill Data Button */}
                <div className="text-center">
                    <button
                            onClick={handleFillData}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                        Proceed to Fill Data
                    </button>
                    <p className="text-secondary-600 text-sm mt-3">
                        Click the button above to start your consultation process
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FirmInfo;

// Example usage with sample data
// const ExampleUsage = () => {
//     const sampleFirm: IConsultantFirm = {
//         _id: "507f1f77bcf86cd799439011",
//         name: "Strategic Legal Solutions",
//         slug: "strategic-legal-solutions",
//         description: "We are a premier consultancy firm specializing in corporate law, business strategy, and regulatory compliance. With over 15 years of experience, we provide comprehensive legal and business consulting services to help organizations navigate complex challenges and achieve their objectives.",
//         logo: "", // Empty to show initials fallback
//         websiteUrl: "https://strategiclegal.example.com",
//         createdAt: new Date("2020-03-15"),
//         updatedAt: new Date("2024-12-01")
//     };

//     const sampleConsultant: IConsultant = {
//         _id: "507f1f77bcf86cd799439012",
//         email: "sarah.johnson@strategiclegal.com",
//         password: "", // Not displayed
//         displayName: "Sarah Johnson",
//         role: "Senior Partner",
//         type: "lawyer",
//         firmId: "507f1f77bcf86cd799439011",
//         phone: "+1 (555) 123-4567",
//         image: "", // Empty to show initials fallback
//         displayEmail: "s.johnson@strategiclegal.com",
//         bio: "Sarah is a seasoned legal professional with expertise in corporate governance, mergers & acquisitions, and regulatory compliance. She has successfully guided numerous Fortune 500 companies through complex legal challenges and strategic transformations.",
//         isPasswordChanged: true,
//         createdAt: new Date("2020-03-20"),
//         updatedAt: new Date("2024-11-15")
//     };

//     return (
//         <ConsultancyInfoPage
//             firm={sampleFirm}
//             consultant={sampleConsultant}
//             onFillData={() => alert('Navigating to data form...')}
//         />
//     );
// };

// export default ExampleUsage;