'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

// Định nghĩa kiểu dữ liệu cho Context
interface AppContextType {
    pendingCount: number;
    totalDiplomas: number;
    monthlyDiplomas: number;
    syncData: () => void; // Hàm để ép hệ thống tính toán lại bằng tay nếu cần
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [totalDiplomas, setTotalDiplomas] = useState<number>(0);
    const [monthlyDiplomas, setMonthlyDiplomas] = useState<number>(0);

    // Hàm quét LocalStorage và tính toán mọi con số
    const syncData = () => {
        // 1. Đếm số hồ sơ CHỜ DUYỆT
        const pendingList = JSON.parse(localStorage.getItem('uhs_pending_approvals') || '[]');
        setPendingCount(pendingList.length);

        // 2. Lấy dữ liệu KHO VĂN BẰNG (ĐÃ DUYỆT)
        const approvedList = JSON.parse(localStorage.getItem('uhs_approved_diplomas') || '[]');

        // Đếm tổng số văn bằng đã cấp
        setTotalDiplomas(approvedList.length);

        // Tính số văn bằng cấp trong THÁNG HIỆN TẠI
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const countThisMonth = approvedList.filter((item: any) => {
            if (!item.approvedAt) return false;
            const approvedDate = new Date(item.approvedAt);
            return approvedDate.getMonth() === currentMonth && approvedDate.getFullYear() === currentYear;
        }).length;

        setMonthlyDiplomas(countThisMonth);
    };

    // Chạy tự động khi load trang và lắng nghe sự kiện
    useEffect(() => {
        syncData(); // Tính ngay lần đầu

        // Lắng nghe thay đổi (Bao gồm cả event cũ sync_pending_count để không làm hỏng code trước đó)
        window.addEventListener('storage', syncData);
        window.addEventListener('sync_pending_count', syncData);
        window.addEventListener('sync_app_data', syncData);

        return () => {
            window.removeEventListener('storage', syncData);
            window.removeEventListener('sync_pending_count', syncData);
            window.removeEventListener('sync_app_data', syncData);
        };
    }, []);

    return (
        <AppContext.Provider value={{ pendingCount, totalDiplomas, monthlyDiplomas, syncData }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext phải được sử dụng bên trong AppProvider');
    }
    return context;
};