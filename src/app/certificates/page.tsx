"use client"

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Download, Archive, ShieldCheck, Calendar, Eye, X, Award, Hash, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
// Import diplomaService để gọi API thực tế
import { diplomaService } from '../../services/diploma.service';

// Kiểu dữ liệu cấu trúc thực tế từ API Backend
interface ApiDiplomaRecord {
    id: string;
    studentName: string;
    studentDob: string;
    major: string;
    classification: string;
    graduationYear: number;
    diplomaNumber: string | null;
    registryNumber: string | null;
    createdAt: string;
    updatedAt: string;
    status: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW' | 'DRAFT' | 'STORED';
    hash: string | null;
    rejectReason: string | null;
}

// Kiểu dữ liệu cho Văn bằng đã duyệt (Áp màng dữ liệu thực tế để hiển thị)
interface ApprovedDiploma {
    id: string;
    fullName: string;
    dob: string;
    major: string;
    ranking?: string;
    rank?: string; 
    gradYear: string;
    serialNo: string;
    regNo: string;
    approvedAt: string;
    hash: string;
}

// Kiểu dữ liệu cho Hồ sơ bị từ chối (Áp màng dữ liệu thực tế để hiển thị)
interface RejectedDiploma {
    id: string;
    fullName: string;
    dob: string;
    major: string;
    ranking?: string;
    rank?: string; 
    gradYear: string;
    rejectedAt: string;
    rejectReason: string;
    reason?: string;
}

type ArchiveTab = 'approved' | 'rejected';

// Hàm format ngày an toàn (Tránh lỗi Invalid Date)
const safeFormatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Chưa cập nhật' : date.toLocaleDateString('vi-VN');
};

const safeFormatDateTime = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Chưa cập nhật' : date.toLocaleString('vi-VN');
};

export default function CertificateArchive() {
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ArchiveTab>('approved');

    // State quản lý dữ liệu lấy từ API
    const [approvedDiplomas, setApprovedDiplomas] = useState<ApprovedDiploma[]>([]);
    const [rejectedDiplomas, setRejectedDiplomas] = useState<RejectedDiploma[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // State lưu trữ thông tin văn bằng/hồ sơ đang được click chọn để Xem
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

    // Hàm chuyển đổi dữ liệu từ API thô sang Interface giao diện của bạn
    const mapApiToApproved = (item: ApiDiplomaRecord): ApprovedDiploma => ({
        id: item.id,
        fullName: item.studentName,
        dob: safeFormatDate(item.studentDob),
        major: item.major,
        ranking: item.classification,
        gradYear: item.graduationYear?.toString() || 'Chưa cập nhật',
        serialNo: item.diplomaNumber || 'Chưa cập nhật',
        regNo: item.registryNumber || 'Chưa cập nhật',
        approvedAt: item.updatedAt, // Thời điểm bản ghi chuyển sang APPROVED
        hash: item.hash || 'N/A'
    });

    const mapApiToRejected = (item: ApiDiplomaRecord): RejectedDiploma => ({
        id: item.id,
        fullName: item.studentName,
        dob: safeFormatDate(item.studentDob),
        major: item.major,
        ranking: item.classification,
        gradYear: item.graduationYear?.toString() || 'Chưa cập nhật',
        rejectedAt: item.updatedAt, // Thời điểm bị từ chối
        rejectReason: item.rejectReason || 'Không có lý do từ chối cụ thể'
    });

    // Hàm gọi API tải danh bạ lưu trữ ban đầu
    const fetchArchiveData = async () => {
        try {
            setLoading(true);
            // Gọi song song 2 API lấy dữ liệu Approved và Rejected từ Backend
            const [approvedRes, rejectedRes] = await Promise.all([
                diplomaService.getApproved(),
                diplomaService.getRejected() // Sử dụng API đã được thêm mới ở bước trước
            ]);

            // Trích xuất dữ liệu mảng an toàn dựa trên format phản hồi chung { data: [...] }
            const approvedList: ApiDiplomaRecord[] = approvedRes?.data || [];
            const rejectedList: ApiDiplomaRecord[] = rejectedRes?.data || [];

            setApprovedDiplomas(approvedList.map(mapApiToApproved));
            setRejectedDiplomas(rejectedList.map(mapApiToRejected));
        } catch (error) {
            console.error("Lỗi khi đồng bộ dữ liệu từ kho lưu trữ:", error);
        } finally {
            setLoading(false);
        }
    };

    // Tải dữ liệu lần đầu tiên khi tải trang
    useEffect(() => {
        setIsMounted(true);
        fetchArchiveData();
    }, []);

    // Xử lý tìm kiếm (Nếu có từ khóa thì lọc, kết hợp đồng bộ hóa theo Tab hiển thị)
    useEffect(() => {
        if (!isMounted) return;

        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim() === '') {
                // Nếu xóa trống ô tìm kiếm, nạp lại toàn bộ kho lưu trữ ban đầu
                fetchArchiveData();
                return;
            }

            try {
                // Tận dụng API search để quét nhanh phía Server
                const searchRes = await diplomaService.search(searchTerm);
                const results: ApiDiplomaRecord[] = searchRes?.data || [];

                // Phân loại kết quả tìm kiếm được trả về theo đúng trạng thái của từng Tab
                const matchedApproved = results.filter(item => item.status === 'APPROVED');
                const matchedRejected = results.filter(item => item.status === 'REJECTED');

                setApprovedDiplomas(matchedApproved.map(mapApiToApproved));
                setRejectedDiplomas(matchedRejected.map(mapApiToRejected));
            } catch (err) {
                console.error("Lỗi thực thi tìm kiếm:", err);
            }
        }, 400); // Kỹ thuật Debounce 400ms giảm tải tần suất gọi API liên tục

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, isMounted]);

    const currentData = activeTab === 'approved' ? approvedDiplomas : rejectedDiplomas;

    // Giữ nguyên bộ lọc Client-side dự phòng cho tính chính xác
    const filteredData = currentData.filter(d => {
        const nameMatch = d.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
        const serialMatch = activeTab === 'approved' && (d as ApprovedDiploma).serialNo?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || serialMatch;
    });

    if (!isMounted) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E3A8A]">Kho lưu trữ hồ sơ & văn bằng</h1>
                    <p className="text-slate-500 text-sm mt-1">Quản lý, tra cứu văn bằng đã cấp và hồ sơ từ chối.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors w-full md:w-auto">
                    <Download size={18} /> Xuất báo cáo Excel
                </button>
            </div>

            {/* TABS */}
            <div className="flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => { setActiveTab('approved'); setSelectedRecord(null); setSearchTerm(''); fetchArchiveData(); }}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${activeTab === 'approved' ? 'border-[#1E3A8A] text-[#1E3A8A]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Văn bằng đã cấp ({approvedDiplomas.length})
                </button>
                <button
                    onClick={() => { setActiveTab('rejected'); setSelectedRecord(null); setSearchTerm(''); fetchArchiveData(); }}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'rejected' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Hồ sơ bị từ chối {rejectedDiplomas.length > 0 && <span className="bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-[10px]">{rejectedDiplomas.length}</span>}
                </button>
            </div>

            {/* THANH TÌM KIẾM & LỌC */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={activeTab === 'approved' ? "Tìm theo tên sinh viên, số hiệu bằng..." : "Tìm theo tên sinh viên..."}
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
                        <FilterSelect label="Năm tốt nghiệp" options={['2026', '2025', '2024', '2023']} />
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
                                {activeTab === 'approved' ? (
                                    <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Số hiệu / Xếp hạng</th>
                                ) : (
                                    <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Lý do từ chối / Xếp hạng</th>
                                )}
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-sm font-medium text-slate-400">
                                        Đang tải dữ liệu từ kho lưu trữ...
                                    </td>
                                </tr>
                            ) : filteredData.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-4">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 uppercase">{item.fullName}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{item.major}</p>
                                        </div>
                                    </td>

                                    {/* Cột thứ 2 tuỳ biến theo Tab */}
                                    <td className="p-4">
                                        {activeTab === 'approved' ? (
                                            <div>
                                                <p className="text-sm font-bold text-[#1E3A8A] font-mono">{(item as ApprovedDiploma).serialNo || 'Chưa cập nhật'}</p>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">Hạng: {item.ranking || item.rank || (item as any).xepLoai || 'Chưa cập nhật'}</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-xs font-bold text-red-600 line-clamp-2 max-w-xs">{(item as RejectedDiploma).rejectReason || (item as RejectedDiploma).reason || 'Không có lý do'}</p>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">Hạng: {item.ranking || item.rank || (item as any).xepLoai || 'Chưa cập nhật'}</p>
                                            </div>
                                        )}
                                    </td>

                                    {/* Cột Trạng thái */}
                                    <td className="p-4">
                                        {activeTab === 'approved' ? (
                                            <div>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    <ShieldCheck size={12} /> Đã cấp & Ký số
                                                </span>
                                                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400 font-medium">
                                                    <Calendar size={10} />
                                                    {safeFormatDate((item as ApprovedDiploma).approvedAt)}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                                                    <XCircle size={12} /> Đã từ chối
                                                </span>
                                                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400 font-medium">
                                                    <Calendar size={10} />
                                                    {safeFormatDate((item as RejectedDiploma).rejectedAt)}
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    {/* Cột Thao tác */}
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedRecord(item)}
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

                    {!loading && filteredData.length === 0 && (
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

            {/* POPUP (MODAL) HIỂN THỊ CHI TIẾT */}
            {selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                        {/* Header của Popup */}
                        <div className={`px-6 py-4 border-b flex justify-between items-center ${activeTab === 'approved' ? 'bg-slate-50 border-slate-100' : 'bg-red-50 border-red-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${activeTab === 'approved' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                    {activeTab === 'approved' ? <Award size={20} /> : <AlertCircle size={20} />}
                                </div>
                                <div>
                                    <h2 className={`text-lg font-black ${activeTab === 'approved' ? 'text-[#1E3A8A]' : 'text-red-700'}`}>
                                        {activeTab === 'approved' ? 'Chi tiết văn bằng cấp phát' : 'Chi tiết hồ sơ bị từ chối'}
                                    </h2>
                                    {activeTab === 'approved' && selectedRecord.serialNo && (
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">Số hiệu: <span className="font-mono text-slate-700">{selectedRecord.serialNo}</span></p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body của Popup */}
                        <div className="p-6 overflow-y-auto space-y-6">

                            {/* Thông tin cá nhân & Đào tạo */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Họ và tên sinh viên</p>
                                    <p className="text-sm font-bold text-slate-900 uppercase">{selectedRecord.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ngày sinh</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedRecord.dob || 'Đang cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ngành đào tạo</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedRecord.major}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Xếp loại</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedRecord.ranking || selectedRecord.rank || selectedRecord.xepLoai || 'Chưa cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Năm tốt nghiệp</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedRecord.gradYear || 'Đang cập nhật'}</p>
                                </div>
                                {activeTab === 'approved' && selectedRecord.regNo && (
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Số vào sổ gốc cấp</p>
                                        <p className="text-sm font-bold text-slate-900 font-mono">{selectedRecord.regNo}</p>
                                    </div>
                                )}
                            </div>

                            <hr className="border-slate-100" />

                            {/* Block hiển thị riêng cho Đã Cấp / Từ Chối */}
                            {activeTab === 'approved' ? (
                                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                    <h3 className="text-xs font-black text-emerald-800 uppercase flex items-center gap-2 mb-4">
                                        <ShieldCheck size={14} /> Trạng thái bảo mật & Ký số
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-emerald-700/70 font-medium">Thời gian phê duyệt:</span>
                                            <span className="text-xs font-bold text-emerald-800">
                                                {safeFormatDateTime(selectedRecord.approvedAt)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-emerald-700/70 font-medium">Mã Hash (SHA-256):</span>
                                            <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                                                <Hash size={12} /> {selectedRecord.hash || 'N/A'}
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
                            ) : (
                                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                                    <h3 className="text-xs font-black text-red-800 uppercase flex items-center gap-2 mb-3">
                                        <AlertCircle size={14} /> Lý do từ chối cấp bằng
                                    </h3>
                                    <p className="text-sm text-red-700 font-medium mb-4">
                                        {selectedRecord.rejectReason || selectedRecord.reason || 'Không có lý do'}
                                    </p>
                                    <div className="flex justify-between items-center border-t border-red-100 pt-3">
                                        <span className="text-xs text-red-700/70 font-medium">Thời gian từ chối:</span>
                                        <span className="text-xs font-bold text-red-800">
                                            {safeFormatDateTime(selectedRecord.rejectedAt)}
                                        </span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Component dùng chung cho Dropdown lọc
function FilterSelect({ label, options }: { label: string, options: string[] }) {
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