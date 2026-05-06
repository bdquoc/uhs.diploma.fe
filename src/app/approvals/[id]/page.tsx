"use client"

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    Check,
    ShieldAlert,
    FileSearch,
    AlertCircle,
    ArrowLeft,
    User,
    FileBadge,
    Save
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ApprovalDetail({ params }: PageProps) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const router = useRouter();

    // Thêm state để nhận biết hồ sơ nhập tay hay OCR
    const [isManualEntry, setIsManualEntry] = useState(false);

    // State lưu trữ dữ liệu form
    const [certificateData, setCertificateData] = useState({
        fullName: "",
        dateOfBirth: "",
        placeOfBirth: "",
        gender: "",
        ethnicity: "",
        nationality: "Việt Nam",
        major: "",
        graduationYear: "",
        ranking: "",
        diplomaNumber: "",
        registryNumber: ""
    });

    // Lấy dữ liệu hồ sơ từ LocalStorage dựa vào ID
    useEffect(() => {
        const pendingList = JSON.parse(localStorage.getItem('uhs_pending_approvals') || '[]');
        const currentRecord = pendingList.find((item: any) => item.id === id);

        if (currentRecord) {
            // SỬA LỖI Ở ĐÂY: Bắt thêm trường hợp aiConfidence bị undefined/null/rỗng đối với hồ sơ nhập tay
            setIsManualEntry(!currentRecord.aiConfidence || currentRecord.aiConfidence === 'N/A');

            // Đổ dữ liệu vào state
            setCertificateData({
                fullName: currentRecord.fullName || currentRecord.studentName || "",
                dateOfBirth: currentRecord.dob || currentRecord.dateOfBirth || "",
                placeOfBirth: currentRecord.placeOfBirth || "",
                gender: currentRecord.gender || "",
                ethnicity: currentRecord.ethnicity || "",
                nationality: currentRecord.nationality || "Việt Nam",
                major: currentRecord.major || "",
                graduationYear: currentRecord.gradYear || currentRecord.graduationYear || "",
                ranking: currentRecord.ranking || "",
                diplomaNumber: currentRecord.diplomaNumber || currentRecord.serialNo || "",
                registryNumber: currentRecord.registryNumber || currentRecord.regNo || ""
            });
        } else {
            // Fallback nếu không tìm thấy, có thể do user F5 trang hoặc id giả lập
            toast.error("Không tìm thấy dữ liệu hồ sơ gốc!");
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCertificateData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdits = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Đã lưu các thay đổi nháp!", {
            style: { borderRadius: '10px', background: '#fff', color: '#1E3A8A', fontWeight: 'bold' }
        });
    };

    // Hàm xóa hồ sơ khỏi danh sách chờ (Dùng chung cho Approve & Reject)
    const removeRecordFromPending = () => {
        const pendingList = JSON.parse(localStorage.getItem('uhs_pending_approvals') || '[]');
        const updatedPendingList = pendingList.filter((item: any) => item.id !== id);
        localStorage.setItem('uhs_pending_approvals', JSON.stringify(updatedPendingList));

        // Dispatch event để Sidebar cập nhật lại số lượng
        window.dispatchEvent(new Event('sync_pending_count'));
    };

    // Hàm xử lý Phê duyệt
    const handleApprove = async () => {
        const approvedDiploma = {
            id: id,
            fullName: certificateData.fullName,
            major: certificateData.major,
            ranking: certificateData.ranking,
            dob: certificateData.dateOfBirth,
            dateOfBirth: certificateData.dateOfBirth,
            gradYear: certificateData.graduationYear,
            graduationYear: certificateData.graduationYear,
            serialNo: certificateData.diplomaNumber,
            diplomaNumber: certificateData.diplomaNumber,
            regNo: certificateData.registryNumber,
            registryNumber: certificateData.registryNumber,
            approvedAt: new Date().toISOString(),
            status: 'SIGNED',
            hash: '0x' + Math.random().toString(16).substring(2, 15)
        };

        // 1. Lưu vào Kho văn bằng
        const existingDiplomas = JSON.parse(localStorage.getItem('uhs_approved_diplomas') || '[]');
        const updatedDiplomas = [approvedDiploma, ...existingDiplomas];
        localStorage.setItem('uhs_approved_diplomas', JSON.stringify(updatedDiplomas));

        // 2. Xóa khỏi danh sách chờ duyệt
        removeRecordFromPending();

        // 3. Thông báo và chuyển hướng
        toast.success('Đã phê duyệt, ký số & Lưu vào Kho văn bằng!', {
            icon: '🔐',
            style: { borderRadius: '10px', background: '#1E3A8A', color: '#fff', fontWeight: 'bold' }
        });

        router.push('/certificates');
    };

    // Hàm xử lý Từ chối
    const handleReject = () => {
        const reason = prompt("Nhập lý do từ chối hồ sơ này:");
        if (reason) {
            removeRecordFromPending(); // Xóa khỏi danh sách chờ nếu bị từ chối
            toast.error(`Đã từ chối hồ sơ #${id}. Lý do: ${reason}`);
            router.push('/approvals');
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
            {/* Nút quay lại và tiêu đề */}
            <div className="flex items-center gap-4">
                <Link href="/approvals" className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-[#1E3A8A]">Chi tiết thẩm định hồ sơ</h1>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        Mã hồ sơ: #{id}
                    </p>
                </div>
            </div>

            {/* THANH CÔNG CỤ PHÊ DUYỆT */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái hiện tại</p>
                        <p className="text-sm font-black text-amber-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                            ĐANG CHỜ THẨM ĐỊNH
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={handleReject}
                        className="flex-1 md:flex-none px-6 py-2.5 text-red-600 font-bold text-sm hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                    >
                        Từ chối hồ sơ
                    </button>
                    <button
                        onClick={handleApprove}
                        className="flex-1 md:flex-none px-8 py-2.5 bg-[#10B981] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Check size={18} /> Xác nhận & Phê duyệt
                    </button>
                </div>
            </div>

            {/* GRID ĐỐI SOÁT - Sẽ thay đổi tùy thuộc vào isManualEntry */}
            <div className={`grid grid-cols-1 ${isManualEntry ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-8 items-start`}>

                {/* BÊN TRÁI: ẢNH VĂN BẰNG GỐC - CHỈ HIỂN THỊ KHI KHÔNG PHẢI NHẬP TAY */}
                {!isManualEntry && (
                    <div className="col-span-1 lg:col-span-5 sticky top-24 space-y-4">
                        <div className="bg-slate-900 rounded-2xl p-2 shadow-xl border border-slate-800">
                            <div className="flex items-center justify-between px-3 py-2">
                                <p className="text-white text-[10px] font-black opacity-50 uppercase tracking-tighter flex items-center gap-1">
                                    <FileSearch size={12} /> Ảnh gốc để đối soát
                                </p>
                                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded uppercase font-bold">Zoom 100%</span>
                            </div>
                            <img
                                src="/sample-diploma.png"
                                className="w-full rounded-xl object-contain bg-black/20 max-h-[70vh]"
                                alt="Bản quét văn bằng"
                            />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                            <AlertCircle className="text-[#1E3A8A] shrink-0" size={20} />
                            <p className="text-xs text-[#1E3A8A] leading-relaxed">
                                <strong>Lưu ý:</strong> Sau khi duyệt, hệ thống sẽ thực hiện ký số SHA-256. Mọi thay đổi dữ liệu sau bước này là không thể.
                            </p>
                        </div>
                    </div>
                )}

                {/* BÊN PHẢI/GIỮA: FORM DỮ LIỆU ĐỐI SOÁT */}
                <div className={`col-span-1 ${isManualEntry ? 'w-full max-w-4xl mx-auto' : 'lg:col-span-7'} bg-white p-6 rounded-3xl border border-slate-200 shadow-sm`}>
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#1E3A8A] tracking-tight">
                            {isManualEntry ? "Thông tin khai báo" : "Thông tin trích xuất (OCR)"}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">
                            {isManualEntry
                                ? "Kiểm tra lại dữ liệu khai báo thủ công trước khi phê duyệt."
                                : "Đối chiếu với ảnh gốc và chỉnh sửa nếu AI nhận diện sai sót."}
                        </p>
                    </div>

                    <form onSubmit={handleSaveEdits} className="space-y-6">
                        {/* Nhóm Thông tin cá nhân */}
                        <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
                            <div className="flex items-center gap-2 text-[#1E3A8A] font-bold pb-2 border-b border-slate-100">
                                <User size={18} /> <span className="text-sm">Thông tin cá nhân</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Họ và tên</label>
                                    <input name="fullName" value={certificateData.fullName} onChange={handleChange} required className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none uppercase font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Ngày sinh</label>
                                    <input type="date" name="dateOfBirth" value={certificateData.dateOfBirth} onChange={handleChange} required className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Giới tính</label>
                                    <select name="gender" value={certificateData.gender} onChange={handleChange} className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium">
                                        <option value="">-- Trống --</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Dân tộc</label>
                                    <input name="ethnicity" value={certificateData.ethnicity} onChange={handleChange} className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Quốc tịch</label>
                                    <input name="nationality" value={certificateData.nationality} onChange={handleChange} className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium" />
                                </div>
                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Nơi sinh</label>
                                    <input name="placeOfBirth" value={certificateData.placeOfBirth} onChange={handleChange} className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium" />
                                </div>
                            </div>
                        </div>

                        {/* Nhóm Thông tin chuyên môn */}
                        <div className="space-y-4 border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
                            <div className="flex items-center gap-2 text-[#1E3A8A] font-bold pb-2 border-b border-slate-100">
                                <FileBadge size={18} /> <span className="text-sm">Thông tin chuyên môn</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Ngành đào tạo</label>
                                    <input name="major" value={certificateData.major} onChange={handleChange} required className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Năm tốt nghiệp</label>
                                    <input type="number" name="graduationYear" value={certificateData.graduationYear} onChange={handleChange} required className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Hạng tốt nghiệp</label>
                                    <select name="ranking" value={certificateData.ranking} onChange={handleChange} required className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium">
                                        <option value="">-- Chọn hạng --</option>
                                        <option value="Xuất sắc">Xuất sắc</option>
                                        <option value="Giỏi">Giỏi</option>
                                        <option value="Khá">Khá</option>
                                        <option value="Trung bình">Trung bình</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Số hiệu văn bằng (No)</label>
                                    <input name="diplomaNumber" value={certificateData.diplomaNumber} onChange={handleChange} required className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium font-mono" />
                                </div>
                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Số vào sổ gốc (Reg. No)</label>
                                    <input name="registryNumber" value={certificateData.registryNumber} onChange={handleChange} required className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium font-mono" />
                                </div>
                            </div>
                        </div>

                        {/* Nút lưu nháp */}
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold text-sm transition-all">
                                <Save size={16} /> Cập nhật thông tin
                            </button>
                        </div>

                        {/* Box Lưu ý (Hiển thị dưới cùng nếu không có ảnh gốc) */}
                        {isManualEntry && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 mt-6">
                                <AlertCircle className="text-[#1E3A8A] shrink-0" size={20} />
                                <p className="text-xs text-[#1E3A8A] leading-relaxed">
                                    <strong>Lưu ý:</strong> Sau khi duyệt, hệ thống sẽ thực hiện ký số SHA-256. Mọi thay đổi dữ liệu sau bước này là không thể.
                                </p>
                            </div>
                        )}
                    </form>
                </div>

            </div>
        </div>
    );
}