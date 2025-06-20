
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useClientsStore } from '@/stores/clientsStore';
import { firmAPI, clientsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/layout/Sidebar';
import ClientsList from '@/components/clients/ClientsList';
import ClientProfile from '@/components/clients/ClientProfile';
import ClientUpdateForm from '@/components/clients/ClientUpdateForm';
import ReportView from '@/components/reports/ReportView';
import ChatBox from '@/components/chat/ChatBox';
import { IUserProfile, PaginatedResponse } from '@/types';
import ConsultantSettings from '@/components/consultants/ConsultantSettings';

type ViewMode = 'list' | 'profile' | 'edit' | 'report' | 'consultants' | 'consultant-profile';

const FirmPage = () => {
  const { firmSlug } = useParams<{ firmSlug: string }>();
  const { toast } = useToast();
  const { firm, updateFirm } = useAuthStore();
  const { 
    clients, 
    selectedClient, 
    loading, 
    pagination, 
    filters,
    setClients,
    setSelectedClient,
    setLoading 
  } = useClientsStore();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (firmSlug && !firm) {
      loadFirmData();
    }
  }, [firmSlug, firm]);

  useEffect(() => {
    loadClients();
  }, [pagination.page, pagination.limit, filters]);

  const loadFirmData = async () => {
    if (!firmSlug) return;
    
    try {
      const firmData = await firmAPI.getFirmBySlug(firmSlug);
      updateFirm(firmData);
    } catch (error: any) {
      toast({
        title: "Error loading firm data",
        description: error.response?.data?.message || "Failed to load firm information",
        variant: "destructive",
      });
    }
  };

  const loadClients = async () => {
    setLoading(true);
    try {
      const response = await clientsAPI.getClients({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setClients(response as PaginatedResponse<IUserProfile>);
    } catch (error: any) {
      toast({
        title: "Error loading clients",
        description: error.response?.data?.message || "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = async (clientId: string) => {
    try {
      const client = await clientsAPI.getClientById(clientId);
      setSelectedClient(client);
      setViewMode('profile');
    } catch (error: any) {
      toast({
        title: "Error loading client",
        description: error.response?.data?.message || "Failed to load client details",
        variant: "destructive",
      });
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedClient(null);
  };

  const handleEditClient = () => {
    setViewMode('edit');
  };

  const handleViewReport = () => {
    setViewMode('report');
  };

  const handleBackToProfile = () => {
    setViewMode('profile');
  };

  if (!firmSlug) {
    return <div>Invalid firm URL</div>;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar firmSlug={firmSlug} />
      
      <div className="flex flex-1 flex-col overflow-hidden ml-64">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {viewMode === 'list' && (
                <ClientsList
                  clients={clients}
                  loading={loading}
                  pagination={pagination}
                  onClientSelect={handleClientSelect}
                  onRefresh={loadClients}
                />
              )}
              
              {viewMode === 'profile' && selectedClient && (
                <ClientProfile
                  client={selectedClient}
                  onBack={handleBackToList}
                  onEdit={handleEditClient}
                  onViewReport={handleViewReport}
                  onOpenChat={() => setIsChatOpen(true)}
                />
              )}
              
              {viewMode === 'edit' && selectedClient && (
                <ClientUpdateForm
                  client={selectedClient}
                  onBack={handleBackToProfile}
                  onSuccess={() => {
                    setViewMode('profile');
                    loadClients();
                  }}
                />
              )}
              
              {viewMode === 'report' && selectedClient && (
                <ReportView
                  clientId={selectedClient._id}
                  onBack={handleBackToProfile}
                  onOpenChat={() => setIsChatOpen(true)}
                />
              )}

              {viewMode === 'consultant-profile' && (
                <ConsultantSettings />
              )}
            </div>
          </div>
        </main>
      </div>
      
      {isChatOpen && (
        <ChatBox
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          clientId={selectedClient?._id}
          type="personal"
        />
      )}
    </div>
  );
};

export default FirmPage;
