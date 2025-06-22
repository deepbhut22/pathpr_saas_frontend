import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Mail, Phone, User, Calendar, ChevronRight, Users } from 'lucide-react';
import { IConsultant, IUserProfile } from '@/types';

// Mock data for demonstration
// const mockConsultant = {
//     _id: '1',
//     displayName: 'Sarah Johnson',
//     email: 'sarah.johnson@immigrationhelp.com',
//     phone: '+1 (555) 123-4567',
//     bio: 'Experienced immigration consultant with over 8 years of helping clients navigate complex immigration processes. Specialized in family reunification, work permits, and permanent residency applications.',
//     displayEmail: 'sarah@immigrationhelp.com',
//     role: 'Senior Immigration Consultant',
//     type: 'Full-time',
//     avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face'
// };

// const mockClients = Array.from({ length: 12 }, (_, i) => ({
//     _id: `client-${i + 1}`,
//     fullName: `Client ${i + 1}`,
//     email: `client${i + 1}@example.com`,
//     createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
//     status: ['Active', 'Pending', 'Completed'][Math.floor(Math.random() * 3)],
//     caseType: ['Family Reunification', 'Work Permit', 'Student Visa', 'Permanent Residency'][Math.floor(Math.random() * 4)]
// }));

interface ConsultantProfileProps {
    consultant: IConsultant;
    clients: IUserProfile[];
    onBack?: () => void;
    onClientSelect?: (clientId: string) => void;
}

export default function ConsultantProfile({
    consultant,
    clients,
    onBack = () => console.log('Back clicked'),
    onClientSelect = (id) => console.log('Client selected:', id)
}: ConsultantProfileProps) {
    const [showAllClients, setShowAllClients] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const clientsPerPage = 10;
    const displayedClients = showAllClients
        ? clients.slice((currentPage - 1) * clientsPerPage, currentPage * clientsPerPage)
        : clients.slice(0, 6);

    const totalPages = Math.ceil(clients.length / clientsPerPage);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    console.log(consultant);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button onClick={onBack} variant="outline" size="sm" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Consultants
                    </Button>
                </div>

                {/* Consultant Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-12">
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                <img
                                    src={consultant.image || `https://ui-avatars.com/api/?name=${consultant.displayName}&background=f1f5f9&color=0f172a&size=96`}
                                    alt={consultant.displayName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-1 text-white">
                                <h1 className="text-3xl font-bold mb-2">{consultant.displayName}</h1>
                                <p className="text-slate-200 text-lg mb-4">{consultant.role}</p>
                                <div className="flex flex-wrap gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{consultant.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span>{consultant.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{consultant.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
                                <p className="text-gray-600 leading-relaxed">{consultant.bio}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Clients</span>
                                        <span className="font-semibold text-slate-900">{clients.length}</span>
                                    </div>
                                    {/* <div className="flex justify-between">
                                        <span className="text-gray-600">Active Cases</span>
                                        <span className="font-semibold text-slate-900">
                                            {clients.filter(c => c.status === 'Active').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Completed Cases</span>
                                        <span className="font-semibold text-slate-900">
                                            {clients.filter(c => c.status === 'Completed').length}
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clients Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-8 py-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Users className="h-6 w-6 text-slate-700" />
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Associated Clients ({clients.length})
                                </h2>
                            </div>
                            {clients.length > 6 && !showAllClients && (
                                <Button
                                    onClick={() => setShowAllClients(true)}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    Show All
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="p-8">
                        {clients.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No clients associated yet</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedClients.map((client) => (
                                        <div
                                            key={client._id}
                                            onClick={() => onClientSelect(client._id)}
                                            className="bg-white border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                                                        {client.fullName}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mt-1">{client.email}</p>
                                                </div>
                                                {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                                                    {client.status}
                                                </span> */}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Added {new Date(client.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {/* <div className="text-sm text-gray-600">
                                                    <span className="font-medium">Case Type:</span> {client.caseType}
                                                </div> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {showAllClients && totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-200">
                                        <Button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Previous
                                        </Button>

                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    className={currentPage === page ? "bg-slate-900 hover:bg-slate-800" : ""}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}

                                {showAllClients && (
                                    <div className="mt-6 text-center">
                                        <Button
                                            onClick={() => {
                                                setShowAllClients(false);
                                                setCurrentPage(1);
                                            }}
                                            variant="outline"
                                        >
                                            Show Less
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}