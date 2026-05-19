'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { diplomaService } from '@/services/diploma.service';

// Định nghĩa kiểu dữ liệu cho bản ghi thô trả về từ API nhằm bóc tách ngày tháng
interface ApiRecord {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
}

// Định nghĩa kiểu dữ liệu cho Context
interface AppContextType {
    pendingCount: number;
    totalDiplomas: number;
    monthlyDiplomas: number;
    rejectedCount: number; // Trường dữ liệu hồ sơ bị từ chối công khai cho UI sử dụng
    syncData: () => void;  // Hàm ép hệ thống gọi API re-fetch tính toán lại các số liệu thống kê
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [totalDiplomas, setTotalDiplomas] = useState<number>(0);
    const [monthlyDiplomas, setMonthlyDiplomas] = useState<number>(0);
    const [rejectedCount, setRejectedCount] = useState<number>(0);

    // Hàm gọi đồng thời các API để cập nhật số liệu thời gian thực từ Cơ sở dữ liệu
    const syncData = async () => {
        try {
            // Sử dụng Promise.all để gọi song song 3 API giúp tối ưu hóa tốc độ phản hồi mạng
            // Đồng thời bọc .catch cho từng request để tránh việc 1 API lỗi làm sập toàn bộ ứng dụng
            const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
                diplomaService.getPending().catch(() => ({ data: [] })),
                diplomaService.getApproved().catch(() => ({ data: [] })),
                diplomaService.getRejected().catch(() => ({ data: [] }))
            ]);

            // Trích xuất dữ liệu mảng an toàn (Xử lý linh hoạt việc Backend trả thẳng mảng hoặc bọc trong tầng thuộc tính .data)
            const pendingList: ApiRecord[] = pendingRes?.data || (Array.isArray(pendingRes) ? pendingRes : []);
            const approvedList: ApiRecord[] = approvedRes?.data || (Array.isArray(approvedRes) ? approvedRes : []);
            const rejectedList: ApiRecord[] = rejectedRes?.data || (Array.isArray(rejectedRes) ? rejectedRes : []);

            // 1. Đếm số lượng hồ sơ đang CHỜ PHÊ DUYỆT
            setPendingCount(pendingList.length);

            // 2. Đếm tổng số lượng VĂN BẰNG ĐÃ CẤP (Kho lưu trữ)
            setTotalDiplomas(approvedList.length);

            // 3. Đếm số lượng HỒ SƠ BỊ TỪ CHỐI CẤP
            setRejectedCount(rejectedList.length);

            // 4. Tính toán số lượng văn bằng được cấp trong THÁNG HIỆN TẠI
            // Ưu tiên lấy trường 'updatedAt' vì đây là thời điểm trạng thái chuyển sang APPROVED chính thức
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            const countThisMonth = approvedList.filter((item: ApiRecord) => {
                const dateTarget = item.updatedAt || item.createdAt;
                if (!dateTarget) return false;
                
                const approvedDate = new Date(dateTarget);
                // Kiểm tra ngày hợp lệ và so khớp Tháng/Năm hiện tại
                return (
                    !isNaN(approvedDate.getTime()) &&
                    approvedDate.getMonth() === currentMonth && 
                    approvedDate.getFullYear() === currentYear
                );
            }).length;

            setMonthlyDiplomas(countThisMonth);

        } catch (error) {
            console.error("Lỗi đồng bộ thống kê AppContext từ API:", error);
        }
    };

    // Chạy tự động tính toán số liệu ngay khi tải trang và thiết lập lắng nghe các sự kiện nội bộ ứng dụng
    useEffect(() => {
        syncData(); // Kích hoạt nạp dữ liệu lần đầu (Initial load)

        // Lắng nghe các Custom Event được phát ra (trigger) thủ công từ các trang thành phần khi thực hiện Approve/Reject thành công
        window.addEventListener('sync_pending_count', syncData);
        window.addEventListener('sync_app_data', syncData);

        return () => {
            // Dọn dẹp bộ nhớ loại bỏ lắng nghe sự kiện khi Component bị hủy (Unmount)
            window.removeEventListener('sync_pending_count', syncData);
            window.removeEventListener('sync_app_data', syncData);
        };
    }, []);

    return (
        <AppContext.Provider value={{ pendingCount, totalDiplomas, monthlyDiplomas, rejectedCount, syncData }}>
            {children}
        </AppContext.Provider>
    );
};

// Hook tùy biến tiêu thụ nhanh trạng thái Context ở các tầng UI con không cần khai báo lại useContext
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext phải được sử dụng bên trong cấu trúc bọc của AppProvider');
    }
    return context;
};