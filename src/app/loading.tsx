import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#1E3A8A] animate-spin" />
                <div className="absolute w-12 h-12 border-4 border-[#10B981]/20 rounded-full"></div>
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#1E3A8A]">Hệ thống UHS đang tải...</h2>
        </div>
    );
}