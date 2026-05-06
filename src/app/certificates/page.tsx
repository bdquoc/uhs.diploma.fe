"use client"

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Download, Archive, ShieldCheck, Calendar, Eye, X, Award, Hash } from 'lucide-react';
import Link from 'next/link';

// Kiểu dữ liệu cho Văn bằng đã duyệt
interface ApprovedDiploma {
    id: string;
    fullName: string;
    dob: string;
    major: string;
    ranking: string;
    gradYear: string;
    serialNo: string; // Số hiệu văn bằng
    regNo: string;
    approvedAt: string;
    hash: string;
}

export default function CertificateArchive() {
    const [filterOpen, setFilterOpen] = useState(false);

    // State quản lý dữ liệu và tìm kiếm
    const [diplomas, setDiplomas] = useState<ApprovedDiploma[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // State mới: Dùng để lưu trữ thông tin văn bằng đang được click chọn để Xem
    const [selectedDiploma, setSelectedDiploma] = useState<ApprovedDiploma | null>(null);

    // Lấy dữ liệu từ LocalStorage khi trang được load
    useEffect(() => {
        setIsMounted(true);
        const savedDiplomas = JSON.parse(localStorage.getItem('uhs_approved_diplomas') || '[]');
        setDiplomas(savedDiplomas);
    }, []);

    // Logic lọc danh sách theo tên hoặc số hiệu
    const filteredDiplomas = diplomas.filter(d => {
        const nameMatch = d.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
        const serialMatch = d.serialNo?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || serialMatch;
    });

    // Tránh lỗi Hydration của Next.js
    if (!isMounted) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-[#1E3A8A]">Kho văn bằng số</h1>
                    <p className="text-slate-500 text-sm mt-1">Quản lý và tra cứu thông tin văn bằng đã cấp.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                    <Download size={18} /> Xuất báo cáo Excel
                </button>
            </div>

            {/* THANH TÌM KIẾM & LỌC */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên sinh viên, số hiệu bằng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E3A8A] outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 font-bold text-sm ${filterOpen ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]' : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                        <SlidersHorizontal size={18} /> Bộ lọc
                    </button>
                </div>

                {filterOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-50 animate-in fade-in slide-in-from-top-2">
                        <FilterSelect label="Năm tốt nghiệp" options={['2025', '2024', '2023', '2022']} />
                        <FilterSelect label="Ngành học" options={['Bác sĩ y khoa', 'Dược học', 'Điều dưỡng']} />
                        <FilterSelect label="Xếp loại" options={['Xuất sắc', 'Giỏi', 'Khá']} />
                        <FilterSelect label="Hệ đào tạo" options={['Chính quy', 'Liên thông']} />
                    </div>
                )}
            </div>

            {/* BẢNG DANH SÁCH DỮ LIỆU */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Học viên / Ngành học</th>
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Số hiệu / Xếp hạng</th>
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Trạng thái ký số</th>
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDiplomas.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-4">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 uppercase">{item.fullName}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{item.major}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <p className="text-sm font-bold text-[#1E3A8A] font-mono">{item.serialNo || 'Chưa cập nhật'}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">Hạng: {item.ranking}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                <ShieldCheck size={12} /> Đã cấp & Ký số
                                            </span>
                                            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400 font-medium">
                                                <Calendar size={10} />
                                                {new Date(item.approvedAt).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Nút Xem đã được gắn sự kiện onClick */}
                                            <button
                                                onClick={() => setSelectedDiploma(item)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-lg text-xs font-bold transition-all"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={14} /> Xem
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredDiplomas.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                            <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-2">
                                <Archive size={32} className="text-slate-300" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Kho lưu trữ hiện đang trống hoặc không tìm thấy kết quả phù hợp.</p>
                            <Link href="/approvals" className="text-[#1E3A8A] text-sm font-bold hover:underline">
                                Đến trang Phê duyệt hồ sơ
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* POPUP (MODAL) HIỂN THỊ CHI TIẾT VĂN BẰNG */}
            {selectedDiploma && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                        {/* Header của Popup */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-[#1E3A8A]">Chi tiết văn bằng cấp phát</h2>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">Số hiệu: <span className="font-mono text-slate-700">{selectedDiploma.serialNo}</span></p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDiploma(null)}
                                className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body của Popup (Nội dung cuộn được nếu quá dài) */}
                        <div className="p-6 overflow-y-auto space-y-6">

                            {/* Thông tin cá nhân & Đào tạo */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Họ và tên sinh viên</p>
                                    <p className="text-sm font-bold text-slate-900 uppercase">{selectedDiploma.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ngày sinh</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedDiploma.dob || 'Đang cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ngành đào tạo</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedDiploma.major}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Xếp loại tốt nghiệp</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedDiploma.ranking}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Năm tốt nghiệp</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedDiploma.gradYear || 'Đang cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Số vào sổ gốc cấp (Reg. No)</p>
                                    <p className="text-sm font-bold text-slate-900 font-mono">{selectedDiploma.regNo || 'Đang cập nhật'}</p>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Thông tin chữ ký số */}
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                <h3 className="text-xs font-black text-emerald-800 uppercase flex items-center gap-2 mb-4">
                                    <ShieldCheck size={14} /> Trạng thái bảo mật & Ký số
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-emerald-700/70 font-medium">Thời gian phê duyệt:</span>
                                        <span className="text-xs font-bold text-emerald-800">
                                            {new Date(selectedDiploma.approvedAt).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-emerald-700/70 font-medium">Mã Hash (SHA-256):</span>
                                        <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                                            <Hash size={12} /> {selectedDiploma.hash}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-emerald-700/70 font-medium">Trạng thái:</span>
                                        <span className="text-xs font-bold text-white bg-emerald-500 px-2.5 py-0.5 rounded-full">
                                            Hợp lệ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

// Component dùng chung cho Dropdown lọc
function FilterSelect({ label, options }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">{label}</label>
            <select className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100">
                <option>Tất cả</option>
                {options.map((opt: string) => <option key={opt}>{opt}</option>)}
            </select>
        </div>
    );
}