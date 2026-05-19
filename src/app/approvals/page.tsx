"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Clock, Search, CheckSquare, ShieldAlert } from 'lucide-react';

export default function ApprovalsPage() {
    // 1. Khởi tạo danh sách bằng mảng rỗng
    const [pendingList, setPendingList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // 2. Dùng useEffect để kéo dữ liệu từ LocalStorage khi trang vừa load
    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('uhs_pending_approvals') || '[]');

        if (savedData.length > 0) {
            // Format lại dữ liệu từ LocalStorage cho khớp với giao diện của bảng
            const formattedSavedData = savedData.map((item: any) => {
                // Chuyển chuỗi ISO Date thành định dạng DD/MM/YYYY
                const dateObj = new Date(item.submittedAt);
                const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

                return {
                    id: item.id,
                    studentName: item.fullName || "Chưa cập nhật",
                    major: item.major || "Chưa cập nhật",
                    uploadDate: formattedDate
                };
            });

            // Chỉ hiển thị dữ liệu thực tế từ LocalStorage
            setPendingList(formattedSavedData);
        } else {
            // Đảm bảo nếu không có dữ liệu thì set list rỗng
            setPendingList([]);
        }
    }, []);

    // Hàm xử lý tìm kiếm cơ bản
    const filteredList = pendingList.filter(item =>
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-[#1E3A8A]">Phê duyệt văn bằng</h1>
                    <p className="text-sm text-slate-500">Thẩm định dữ liệu OCR trước khi ký số và lưu trữ vĩnh viễn.</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 text-[#1E3A8A] font-bold text-xs">
                    <CheckSquare size={16} /> {filteredList.length} Hồ sơ chờ duyệt
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên hoặc mã sinh viên..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all shadow-sm"
                />
            </div>

            {/* Table Content */}
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
                        {filteredList.map((item) => (
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
            {filteredList.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                    <ShieldAlert size={48} className="mb-2 opacity-20" />
                    <p className="font-bold">Hiện không có hồ sơ nào cần phê duyệt</p>
                </div>
            )}
        </div>
    );
}