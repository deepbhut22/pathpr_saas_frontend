import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useClientsStore } from '@/stores/clientsStore';
import { IConsultant } from '@/types';
import { Search, Filter, X, RefreshCw, Plus, Copy, ExternalLink } from 'lucide-react';
import GenericPopUp from '../PopUp/GenericPopUp';
import { consultantsAPI } from '@/services/api';
import { useConsultantsStore } from '@/stores/consultantsStore';
interface ConsultantsListProps {
    consultants: IConsultant[];
    loading: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
    onConsultantSelect: (consultantId: string) => void;
    onRefresh: () => void;
    onCreateConsultant: () => void;
}

const ConsultantList = ({
    consultants,
    loading,
    pagination,
    onCreateConsultant,
    onConsultantSelect,
    onRefresh
}: ConsultantsListProps) => {
    const { filters, setFilters, clearFilters } = useConsultantsStore();
    const [localSearch, setLocalSearch] = useState(filters.search || '');
    const [isClientLinkPopupOpen, setIsClientLinkPopupOpen] = useState(false);
    const [link, setLink] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ ...filters, search: localSearch });
    };

    const handleSortChange = (sortBy: string) => {
        const [field, order] = sortBy.split('-') as [string, 'asc' | 'desc'];
        setFilters({ ...filters, sortBy: field as any, sortOrder: order });
    };

    const handleClearFilters = () => {
        setLocalSearch('');
        clearFilters();
    };

    const hasActiveFilters = Object.keys(filters).length > 0;
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Consultants</h1>
                    <p className="text-gray-600">Manage your consultants</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onCreateConsultant} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Consultant
                    </Button>
                    <Button onClick={onRefresh} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                        <Filter className="h-5 w-5 mr-2" />
                        Filters & Search
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSearchSubmit} className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by name or email..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>

                    <div className="flex gap-4 items-center">
                        <Select onValueChange={handleSortChange}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Sort by..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                                <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                                <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>

                        {hasActiveFilters && (
                            <Button
                                onClick={handleClearFilters}
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Showing {consultants?.length} of {pagination.total} consultants
                </p>
                {hasActiveFilters && (
                    <Badge variant="secondary">Filters Applied</Badge>
                )}
            </div>

            {/* Clients Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : consultants?.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-gray-500">No consultants found</p>
                        <Button onClick={onRefresh} variant="outline" className="mt-4">
                            Refresh
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {consultants?.map((consultant) => (
                        <Card
                            key={consultant._id}
                            className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => onConsultantSelect(consultant._id)}
                        >
                            <CardContent className="p-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{consultant.displayName}</h3>
                                    <p className="text-gray-600">{consultant.email}</p>
                                    <div className="flex justify-between items-center pt-2">
                                        <Badge variant="outline">
                                            {consultant.role}
                                        </Badge>
                                        <p className="text-sm text-gray-500">
                                            {new Date(consultant.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        {pagination.page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setFilters({ ...filters })}
                                />
                            </PaginationItem>
                        )}

                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i + 1}>
                                <PaginationLink
                                    onClick={() => setFilters({ ...filters })}
                                    isActive={pagination.page === i + 1}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {pagination.page < totalPages && (
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setFilters({ ...filters })}
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
            <GenericPopUp
                isOpen={isClientLinkPopupOpen}
                onClose={() => setIsClientLinkPopupOpen(false)}
                link="https://www.google.com/sdf/sdgdsgd/sgdsfgdsgfdgfdg/dhfd"
                size="md"
                title="New Client Added Successfully"
                description="Copy the link below to share with the client, or open it in a new tab. client will have to fill the data form to generate the report. hbhjsbfj dsjf jd v fd sfd v fdv j vcx vjbdfhvbh  dn jfd j d vj dfjv dfjnv s cvn dsjv jdf dsn v df fdg f"
                illustration={<div>
                    <p className="text-white bg-slate-900 border border-slate-700 rounded-md p-4 text-wrap break-all text-center mt-4">{link}</p>
                    <div className="flex justify-center mt-4 gap-8">
                        <Button
                            onClick={() => navigator.clipboard.writeText(link)}
                            variant="outline" size="sm" className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800">
                            Copy link <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={() => window.open(link, '_blank')}
                            variant="outline" size="sm" className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800">
                            Open in new tab <ExternalLink className="w-4 h-4" />
                        </Button>
                    </div>
                </div>}
            />
        </div>
    );
};

export default ConsultantList;
