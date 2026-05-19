"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Clock, Search, CheckSquare, ShieldAlert, Loader2 } from 'lucide-react';
// Import diplomaService (Điều chỉnh lại đường dẫn cho đúng với cấu trúc thư mục của bạn)
import { diplomaService } from '../../services/diploma.service'; 

export default function ApprovalsPage() {
    const [pendingList, setPendingList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // Hàm format và LỌC lại mảng dữ liệu chỉ lấy hồ sơ chờ duyệt
const formatResponseData = (data: any[]) => {
    if (!data) return [];
    
    // Chỉ giữ lại các hồ sơ có trạng thái chờ duyệt (PENDING_REVIEW hoặc PENDING)
    const pendingRecords = data.filter((item: any) => item.status === 'PENDING_REVIEW');

    return pendingRecords.map((item: any) => {
        const dateObj = new Date(item.createdAt);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

        return {
            id: item.id,
            studentName: item.studentName || "Chưa cập nhật",
            major: item.major || "Chưa cập nhật",
            uploadDate: formattedDate
        };
    });
};

    // useEffect xử lý tìm kiếm API kèm kỹ thuật Debounce (Chờ người dùng gõ xong 500ms mới gọi API)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let result;

                if (searchQuery.trim() === "") {
                    // Nếu ô tìm kiếm trống, gọi hàm lấy danh sách chờ duyệt mặc định
                    result = await diplomaService.getPending();
                } else {
                    // Nếu có từ khóa, chuyển hướng gọi API @Get('search') thông qua Service
                    result = await diplomaService.search(searchQuery.trim());
                }

                if (result && result.data) {
                    setPendingList(formatResponseData(result.data));
                } else {
                    setPendingList([]);
                }
            } catch (error) {
                console.error("Lỗi khi đồng bộ danh sách dữ liệu từ Server:", error);
                setPendingList([]);
            } finally {
                setLoading(false);
            }
        };

        // Thiết lập độ trễ 500ms giảm tải request cho hệ thống
        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-[#1E3A8A]">Phê duyệt văn bằng</h1>
                    <p className="text-sm text-slate-500">Thẩm định dữ liệu OCR trước khi ký số và lưu trữ vĩnh viễn.</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 text-[#1E3A8A] font-bold text-xs">
                    <CheckSquare size={16} /> {pendingList.length} Hồ sơ khớp kết quả
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm thời gian thực qua server (Tên hoặc mã hồ sơ)..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all shadow-sm"
                />
            </div>

            {/* Table Content */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-[#1E3A8A] gap-2">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-sm font-medium text-slate-500">Đang truy vấn dữ liệu từ máy chủ...</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Học viên / Ngành học</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày gửi</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {pendingList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-700 group-hover:text-[#1E3A8A] transition-colors uppercase">{item.studentName}</p>
                                            <p className="text-xs text-slate-400 font-medium">{item.major} • ID: {item.id}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                                <Clock size={14} className="text-slate-300" /> {item.uploadDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link
                                                href={`/approvals/${item.id}`}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl text-xs font-bold hover:bg-[#162a63] transition-all shadow-md shadow-blue-100 active:scale-95"
                                            >
                                                <Eye size={14} /> Kiểm duyệt
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {pendingList.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                            <ShieldAlert size={48} className="mb-2 opacity-20" />
                            <p className="font-bold">Không tìm thấy hồ sơ nào khớp với từ khóa</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}