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
    Save,
    X,
    MessageSquareWarning,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { diplomaService } from '../../../services/diploma.service';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ApprovalDetail({ params }: PageProps) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(null);

    // State lưu trữ dữ liệu form dưới dạng chuỗi YYYY-MM-DD cho ô input
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

    // Lấy dữ liệu hồ sơ chi tiết
    useEffect(() => {
        const fetchRecordDetail = async () => {
            try {
                setLoading(true);
                const result = await diplomaService.getById(id);

                if (result && result.data) {
                    const record = result.data;

                    setIsManualEntry(!record.fileUrl || !record.ocrRawText);
                    setOriginalFileUrl(record.fileUrl);

                    // Tách chuỗi ISO "1997-08-04T00:00:00.000Z" thành "1997-08-04" để hiển thị vào ô input date
                    let formattedDob = "";
                    if (record.studentDob) {
                        formattedDob = record.studentDob.split('T')[0];
                    }

                    setCertificateData({
                        fullName: record.studentName || "",
                        dateOfBirth: formattedDob,
                        placeOfBirth: record.placeOfBirth || "",
                        gender: record.gender || "",
                        ethnicity: record.ethnicity || "",
                        nationality: record.nationality || "Việt Nam",
                        major: record.major || "",
                        graduationYear: record.graduationYear ? record.graduationYear.toString() : "",
                        ranking: record.classification || "", 
                        diplomaNumber: record.diplomaNumber || "",
                        registryNumber: record.registryNumber || ""
                    });
                } else {
                    toast.error("Không tìm thấy dữ liệu hồ sơ gốc trên hệ thống!");
                }
            } catch (error: any) {
                console.error("Lỗi khi lấy chi tiết hồ sơ:", error);
                toast.error(error.message || "Không thể kết nối tới máy chủ.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecordDetail();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCertificateData(prev => ({ ...prev, [name]: value }));
    };

    // Hàm lưu các thay đổi nháp lên hệ thống
    const handleSaveEdits = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Chuẩn hóa "YYYY-MM-DD" thành chuỗi ISO-8601 đầy đủ "YYYY-MM-DDT00:00:00.000Z" để tránh lỗi Prisma
            const isoDob = certificateData.dateOfBirth ? `${certificateData.dateOfBirth}T00:00:00.000Z` : null;

            const payload = {
                studentName: certificateData.fullName,
                studentDob: isoDob, 
                placeOfBirth: certificateData.placeOfBirth,
                gender: certificateData.gender,
                ethnicity: certificateData.ethnicity,
                nationality: certificateData.nationality,
                major: certificateData.major,
                graduationYear: certificateData.graduationYear ? parseInt(certificateData.graduationYear) : null,
                classification: certificateData.ranking,
                diplomaNumber: certificateData.diplomaNumber,
                registryNumber: certificateData.registryNumber
            };

            await diplomaService.update(id, payload);

            toast.success("Đã lưu các thay đổi nháp lên hệ thống!", {
                style: { borderRadius: '10px', background: '#fff', color: '#1E3A8A', fontWeight: 'bold' }
            });
        } catch (error: any) {
            toast.error(error.message || "Lỗi khi lưu bản nháp.");
        }
    };

    // Hàm xử lý Phê duyệt và Ký số
    const handleApprove = async () => {
        try {
            // Chuẩn hóa ngày sinh sang định dạng ISO trước khi cập nhật lần cuối
            const isoDob = certificateData.dateOfBirth ? `${certificateData.dateOfBirth}T00:00:00.000Z` : null;

            const payload = {
                studentName: certificateData.fullName,
                studentDob: isoDob, 
                placeOfBirth: certificateData.placeOfBirth,
                gender: certificateData.gender,
                ethnicity: certificateData.ethnicity,
                nationality: certificateData.nationality,
                major: certificateData.major,
                graduationYear: certificateData.graduationYear ? parseInt(certificateData.graduationYear) : null,
                classification: certificateData.ranking,
                diplomaNumber: certificateData.diplomaNumber,
                registryNumber: certificateData.registryNumber,
                status: 'APPROVED'
            };
            
            // Cập nhật thông tin mới nhất trên form trước khi thực hiện ký duyệt số
            await diplomaService.update(id, payload);

            // Tiến hành kích hoạt hành động phê duyệt, ký số lưu kho vĩnh viễn
            await diplomaService.approve(id);

            toast.success('Đã phê duyệt, ký số & Lưu vào Kho văn bằng vĩnh viễn!', {
                icon: '🔐',
                style: { borderRadius: '10px', background: '#1E3A8A', color: '#fff', fontWeight: 'bold' }
            });
            router.push('/certificates'); 
        } catch (error: any) {
            toast.error(error.message || "Phê duyệt hồ sơ thất bại.");
        }
    };

    // Hàm mở Popup từ chối
    const openRejectModal = () => {
        setIsRejectModalOpen(true);
    };

    // Hàm thực hiện Từ chối sau khi nhập lý do
    const confirmReject = async () => {
        if (!rejectReason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối!");
            return;
        }

        try {
            await diplomaService.reject(id, rejectReason);

            setIsRejectModalOpen(false);
            toast.success(`Đã từ chối hồ sơ #${id}`, {
                style: { borderRadius: '10px', background: '#FEF2F2', color: '#DC2626', fontWeight: 'bold', border: '1px solid #FCA5A5' }
            });
            router.push('/certificates');
        } catch (error: any) {
            toast.error(error.message || "Không thể cập nhật trạng thái từ chối.");
        }
    };

    if (loading) {
        return (
            <div className="py-40 flex flex-col items-center justify-center text-[#1E3A8A] gap-2">
                <Loader2 className="animate-spin" size={40} />
                <p className="text-sm font-semibold text-slate-500">Đang đồng bộ dữ liệu thẩm định...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500 relative">

            {/* --- MODAL TỪ CHỐI PHÊ DUYỆT --- */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden scale-in-95 duration-200">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-red-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                    <MessageSquareWarning size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-700">Từ chối phê duyệt</h3>
                                    <p className="text-[11px] font-medium text-red-500/80 uppercase">Hồ sơ #{id}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Lý do từ chối <span className="text-red-500">*</span></label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Vd: Sai thông tin ngày sinh, ảnh mờ không thể đối soát..."
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none min-h-[120px] resize-none"
                                    autoFocus
                                />
                                <p className="text-xs text-slate-500">Hồ sơ này sẽ được chuyển vào mục lưu trữ "Bị từ chối".</p>
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="px-4 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={!rejectReason.trim()}
                                className="px-6 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        onClick={openRejectModal}
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

            {/* GRID ĐỐI SOÁT */}
            <div className={`grid grid-cols-1 ${isManualEntry ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-8 items-start`}>

                {/* BÊN TRÁI: ẢNH VĂN BẰNG GỐC */}
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
                                src={originalFileUrl || "/sample-diploma.png"}
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
                                        <option value="">-- Chọn xếp loại --</option>
                                        <option value="Xuất sắc">Xuất sắc</option>
                                        <option value="Giỏi">Giỏi</option>
                                        <option value="Khá">Khá</option>
                                        <option value="Trung bình">Trung bình</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Số hiệu văn bằng</label>
                                    <input name="diplomaNumber" value={certificateData.diplomaNumber} onChange={handleChange} required className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase">Số vào sổ gốc</label>
                                    <input name="registryNumber" value={certificateData.registryNumber} onChange={handleChange} required className="w-full p-2.5 bg-white text-slate-900 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all flex items-center gap-1.5">
                                    <Save size={14} /> Lưu bản chỉnh sửa nháp
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}