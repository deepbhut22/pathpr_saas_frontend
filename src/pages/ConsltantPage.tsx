import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import { Plus, RefreshCw } from 'lucide-react';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ConsultantList from "@/components/consultants/ConsultantList";
import { useClientsStore } from "@/stores/clientsStore";
import { clientsAPI, consultantsAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { IConsultant, IUserProfile, PaginatedResponse } from "@/types";
import ConsultantModal from "@/components/consultants/CreateConsultant";
import { useConsultantsStore } from "@/stores/consultantsStore";
import ConsultantProfile from "@/components/consultants/ConsultantProfile";

type ViewMode = string;

export default function ConstultantPage() {

    const { firmSlug } = useParams<{ firmSlug: string }>();

    const [refresh, setRefresh] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('list');


    // const {
    //     clients,
    //     selectedClient,
    //     // loading,
    //     // pagination,
    //     // filters,
    //     // setClients,
    //     // setSelectedClient,
    //     // setLoading
    // } = useClientsStore();

    const { 
        loading,
        consultants,
        selectedConsultant,
        setConsultants,
        setSelectedConsultant,
        setLoading: setConsultantsLoading,
        filters,
        setFilters,
        pagination,
    } = useConsultantsStore();
    
    const [consultantClients, setConsultantClients] = useState<IUserProfile[]>([]);

    // const loadClients = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await clientsAPI.getClients({
    //             page: pagination.page,
    //             limit: pagination.limit,
    //             ...filters,
    //         });
    //         setClients(response as PaginatedResponse<IUserProfile>);
    //     } catch (error: any) {
    //         toast({
    //             title: "Error loading clients",
    //             description: error.response?.data?.message || "Failed to load clients",
    //             variant: "destructive",
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const loadConsultants = async () => {
        setConsultantsLoading(true);
        try {
            const response = await consultantsAPI.getConsultants({
                ...filters,
            });
            setConsultants(response as PaginatedResponse<IConsultant>);
        } catch (error: any) {
            toast({
                title: "Error loading consultants",
                description: error.response?.data?.message || "Failed to load consultants",
                variant: "destructive",
            });
        } finally {
            setConsultantsLoading(false);
        }
    };
    

    const handleConsultantSelect = async (consultantId: string) => {
        try {
            const response = await consultantsAPI.getConsultantById(consultantId);
            setSelectedConsultant(response.consultant);
            setViewMode('profile');
            setConsultantClients(response.clients);
        } catch (error: any) {
            toast({
                title: "Error loading consultant",
                description: error.response?.data?.message || "Failed to load consultant details",
                variant: "destructive",
            });
        }
    };

    const handleCreateConsultant = () => {
        setViewMode('create');
    }

    useEffect(() => {
        if (firmSlug) {
            loadConsultants();
        }
    }, [firmSlug]);

    // useEffect(() => {
    //     loadClients();
    // }, [pagination.page, pagination.limit, filters]);   

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            <Sidebar firmSlug={firmSlug} />

            <div className="flex flex-1 flex-col overflow-hidden ml-64">
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <div className="space-y-6">
                                {/* <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Consultants</h1>
                                        <p className="text-gray-600">Manage Consultants In Your Firm.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleCreateConsultant} variant="outline" size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Consultant
                                        </Button>
                                        <Button onClick={() => setRefresh(prev => !prev)} variant="outline" size="sm">
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Refresh
                                        </Button>
                                    </div>
                                </div> */}
                            </div>
                            {viewMode === 'list' && (
                                <ConsultantList
                                    onCreateConsultant={handleCreateConsultant}
                                    consultants={consultants}
                                    loading={loading}
                                    pagination={pagination}
                                    onConsultantSelect={handleConsultantSelect}
                                    onRefresh={loadConsultants}
                                />
                            )}
                            {viewMode === 'create' && (
                                <ConsultantModal
                                    onBack={() => setViewMode('list')}
                                    onSuccess={loadConsultants}
                                />
                            )}
                            {viewMode === 'profile' && (
                                <ConsultantProfile
                                    consultant={selectedConsultant}
                                    clients={consultantClients}
                                    onBack={() => setViewMode('list')}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}