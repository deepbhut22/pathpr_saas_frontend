import { IConsultant, IUserProfile } from "@/types";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface ConsultantProfileProps {
    consultant: IConsultant;
    clients: IUserProfile[];
    onBack: () => void;
}

export default function ConsultantProfile({ consultant, clients, onBack }: ConsultantProfileProps) {
    
    return (
        <div className="space-y-6">
            <div className="flex space-x-4 items-center">
                <div className="w-full">
                    <div className="flex items-center gap-2 justify-start">
                        <Button onClick={onBack} variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Consultants
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{consultant.displayName}</h1>
                            <p className="text-gray-600 mb-6">{consultant.email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex space-x-4 items-center">
                <div className="w-full">
                    <div className="flex flex-col items-start gap-2 justify-start">
                        <h1 className="text-2xl font-bold text-gray-900">{clients.length} Clients associated with {consultant.displayName}</h1>
                        <div className="flex items-start gap-2 justify-start overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {clients.map((client) => (
                                <div key={client._id} className="border-2 border-gray-300 p-4 rounded-md cursor-pointer flex flex-col items-start gap-2 justify-start">
                                    <p className="text-lg font-bold text-gray-900">{client.fullName}</p>
                                    <p className="text-gray-600">{client.email}</p>
                                    <p className="text-sm text-gray-600">Added on {new Date(client.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                        {/* display consultant information */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Consultant Information</h1>
                            <p className="text-gray-600">{consultant.email}</p>
                            <p className="text-gray-600">{consultant.phone}</p>
                            <p className="text-gray-600">{consultant.bio}</p>
                            <p className="text-gray-600">{consultant.displayEmail}</p>
                            <p className="text-gray-600">{consultant.displayName}</p>
                            <p className="text-gray-600">{consultant.phone}</p>
                            <p className="text-gray-600">{consultant.role}</p>
                            <p className="text-gray-600">{consultant.type}</p>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
}