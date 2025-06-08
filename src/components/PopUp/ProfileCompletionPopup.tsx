import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate, useParams } from "react-router-dom";

interface ProfileCompletionPopupProps {
    isOpen: boolean;
    onClose: () => void;
}               

export default function ProfileCompletionPopup({ isOpen, onClose }: ProfileCompletionPopupProps) {

    if (!isOpen) return null;
    const navigate = useNavigate();
    const firmSlug = useParams().firmSlug;

    const isPasswordChanged = useAuthStore(state => state.consultant.isPasswordChanged);

    return (
        <div className="fixed inset-0 overflow-y-auto text-black z-50 flex items-center justify-center p-4">
            <div className="flex flex-col gap-2 mt-5 bg-white border-2 border-gray-200 shadow-lg shadow-slate-500 rounded-lg p-4">
                <p className="text-2xl font-bold">Profile Completion Pending!</p>
                <ul className="list-disc list-inside flex flex-col gap-2">
                    {!isPasswordChanged && <li className="text-red-500">You will need to change your password ASAP for security reasons.</li>}
                    <li className="text-gray-500">You will need to complete your profile to continue</li>
                    <li className="text-gray-500">Completing your profile is essential to display your profile to your clients</li>
                    <li className="text-gray-500">Please take a few minutes to complete your profile</li>
                </ul>
                <div className="flex justify-center gap-2 mt-5">
                    <Button onClick={onClose}>Close</Button>
                    <Button onClick={() => {
                        navigate(`/${firmSlug}/consultant-profile`);
                        onClose();
                    }}>Complete Profile</Button>
                </div>
            </div>
        </div>
    )
}