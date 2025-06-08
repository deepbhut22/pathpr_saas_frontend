import { X } from "lucide-react";

interface GenericPopUpProps {
    isOpen: boolean;
    onClose: () => void;
    link: string;
    size: "sm" | "md" | "lg" | "xl" | "2xl";
    title?: string;
    description?: string;
    illustration: React.ReactNode;
}


export default function GenericPopUp({ isOpen, onClose, link, size = "md", title, description, illustration }: GenericPopUpProps) {
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl'
    };
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 overflow-y-auto text-black z-50 flex items-center justify-center p-4">
                    <div className={`bg-white rounded-lg text-black shadow-lg p-1 flex flex-col shadow-lg shadow-slate-500 border border-gray-200 ${maxWidthClasses[size]}`}>
                        <div className="flex justify-end">
                            <X className="w-5 h-5 cursor-pointer" onClick={onClose} />
                        </div>
                        <div className="flex flex-col p-6 py-1 rounded-lg">
                            <h1 className="text-2xl font-bold">{title}</h1>
                            <h2 className="text-sm text-slate-500 mt-1 text-wrap">{description}</h2>
                            {illustration}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}