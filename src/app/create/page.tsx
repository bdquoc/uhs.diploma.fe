"use client"

import { Save, User, FileBadge, ArrowLeft, UploadCloud, Image as ImageIcon, Info } from 'lucide-react'
import { useState } from "react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CreateDiplomaPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // --- STATE CHO PHẦN OCR ---
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isOcrProcessing, setIsOcrProcessing] = useState(false);

    // 1. Tạo state để "hứng" toàn bộ dữ liệu người dùng nhập
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        ethnicity: '',
        nationality: 'Việt Nam',
        placeOfBirth: '',
        major: '',
        graduationYear: '',
        ranking: '',
        diplomaNumber: '',
        registryNumber: ''
    });

    // 2. Hàm cập nhật state khi người dùng gõ phím
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Hàm xử lý upload ảnh và giả lập quét OCR
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Tạo URL preview cho ảnh
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        setIsOcrProcessing(true);

        // Giả lập thời gian AI xử lý OCR (1.5 giây)
        setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                fullName: 'LƯU THỊ ÁNH XUÂN',
                dateOfBirth: '1997-08-04',
                gender: 'Nữ', // Mock data
                ethnicity: 'Kinh',
                placeOfBirth: 'Thành phố Hồ Chí Minh',
                major: 'Bác sĩ y khoa',
                graduationYear: '2025',
                ranking: 'Khá',
                diplomaNumber: 'QH119202500101',
                registryNumber: '1977201011069CQ'
            }));
            setIsOcrProcessing(false);
        }, 1500);
    };

    // 4. Xử lý khi bấm nút Lưu
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const randomId = `UHS-${Math.floor(1000 + Math.random() * 9000)}`;

        const newPendingDiploma = {
            id: randomId,
            ...formData,
            submittedAt: new Date().toISOString(),
            status: 'PENDING',
            source: imagePreview ? 'OCR' : 'MANUAL'
        };

        const existingPending = JSON.parse(localStorage.getItem('uhs_pending_approvals') || '[]');
        const updatedPending = [newPendingDiploma, ...existingPending];
        localStorage.setItem('uhs_pending_approvals', JSON.stringify(updatedPending));

        setTimeout(() => {
            setIsLoading(false);
            alert("Đã chuyển hồ sơ sang mục Chờ phê duyệt!");
            router.push('/approvals');
        }, 1000);
    };

    // Xóa ảnh để scan lại
    const handleRemoveImage = () => {
        setImagePreview(null);
        // Có thể reset formData về rỗng ở đây nếu muốn
    };

    return (
        // Đổi max-w-5xl thành max-w-7xl để có không gian cho 2 cột
        <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">

            {/* Header Trang */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Link href="/" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-black text-[#1E3A8A]">Khai báo văn bằng mới</h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium ml-11">
                        Tải ảnh lên để AI tự động trích xuất, hoặc nhập thủ công thông tin phôi bằng.
                    </p>
                </div>
            </div>

            {/* Layout 2 cột */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* --- CỘT TRÁI: KHU VỰC SCAN OCR --- */}
                <div className="xl:col-span-5 flex flex-col gap-4">
                    <div className="bg-[#111827] rounded-2xl overflow-hidden shadow-lg border border-slate-800 flex flex-col h-[520px]">
                        {/* Title Bar */}
                        <div className="p-4 flex items-center justify-between border-b border-slate-700 bg-[#1F2937]">
                            <div className="flex items-center gap-2 text-white font-semibold text-sm">
                                <ImageIcon size={16} />
                                <span>ẢNH GỐC ĐỂ ĐỐI SOÁT (OCR)</span>
                            </div>
                            {imagePreview && (
                                <div className="flex gap-2">
                                    <button onClick={handleRemoveImage} className="text-xs bg-red-500/20 text-red-300 hover:bg-red-500/40 px-2 py-1 rounded-md transition-colors">
                                        Xóa ảnh
                                    </button>
                                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md">ZOOM 100%</span>
                                </div>
                            )}
                        </div>

                        {/* Image / Upload Area */}
                        <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
                            {!imagePreview ? (
                                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:bg-slate-800/50 hover:border-slate-500 transition-colors group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-12 h-12 text-slate-500 group-hover:text-blue-400 mb-4 transition-colors" />
                                        <p className="mb-2 text-sm text-slate-300 font-semibold">Nhấn để tải lên hoặc kéo thả ảnh</p>
                                        <p className="text-xs text-slate-500">Hỗ trợ định dạng: JPG, PNG, WEBP (Max 5MB)</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img src={imagePreview} alt="Bản chụp văn bằng" className="max-w-full max-h-full object-contain rounded-md" />

                                    {/* Lớp phủ Loading khi đang quét OCR */}
                                    {isOcrProcessing && (
                                        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10 rounded-md">
                                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="font-medium animate-pulse text-blue-100">AI đang trích xuất dữ liệu...</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Khối lưu ý bên dưới ảnh */}
                    <div className="bg-blue-50/50 p-4 rounded-xl text-sm flex gap-3 border border-blue-100 text-slate-600">
                        <Info className="shrink-0 w-5 h-5 text-blue-600" />
                        <p>
                            <span className="font-semibold text-blue-800">Lưu ý:</span> Hệ thống sẽ tự động đọc dữ liệu từ hình ảnh và điền vào biểu mẫu. Bạn cần <b>kiểm tra và đối chiếu</b> lại độ chính xác trước khi lưu.
                        </p>
                    </div>
                </div>

                {/* --- CỘT PHẢI: FORM NHẬP LIỆU HIỆN TẠI --- */}
                <div className="xl:col-span-7">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* PHẦN 1: THÔNG TIN CÁ NHÂN */}
                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
                            {/* Hiệu ứng nháy xanh mờ nếu vừa OCR xong */}
                            {imagePreview && !isOcrProcessing && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-2xl animate-pulse"></div>
                            )}

                            <div className="flex items-center gap-2 text-[#1E3A8A] font-bold border-b border-slate-100 pb-4">
                                <User size={20} />
                                <span>Thông tin cá nhân sinh viên</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Họ và tên <span className="text-red-500">*</span></label>
                                    <input name="fullName" value={formData.fullName} onChange={handleChange} required type="text" placeholder="VD: LƯU THỊ ÁNH XUÂN" className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium uppercase" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Ngày sinh <span className="text-red-500">*</span></label>
                                    <input name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required type="date" className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Giới tính</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium">
                                        <option value="">-- Chọn --</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Dân tộc</label>
                                    <input name="ethnicity" value={formData.ethnicity} onChange={handleChange} type="text" placeholder="VD: Kinh" className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Quốc tịch</label>
                                    <input name="nationality" value={formData.nationality} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium" />
                                </div>

                                <div className="space-y-2 md:col-span-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Nơi sinh</label>
                                    <input name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} type="text" placeholder="VD: Thành phố Hồ Chí Minh" className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium" />
                                </div>
                            </div>
                        </section>

                        {/* PHẦN 2: THÔNG TIN VĂN BẰNG */}
                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
                            {imagePreview && !isOcrProcessing && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-2xl animate-pulse"></div>
                            )}

                            <div className="flex items-center gap-2 text-[#1E3A8A] font-bold border-b border-slate-100 pb-4">
                                <FileBadge size={20} />
                                <span>Thông tin văn bằng cấp phát</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Ngành đào tạo <span className="text-red-500">*</span></label>
                                    <input name="major" value={formData.major} onChange={handleChange} required type="text" placeholder="VD: Bác sĩ y khoa" className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Năm tốt nghiệp <span className="text-red-500">*</span></label>
                                        <input name="graduationYear" value={formData.graduationYear} onChange={handleChange} required type="number" placeholder="VD: 2025" className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Hạng tốt nghiệp <span className="text-red-500">*</span></label>
                                        <select name="ranking" value={formData.ranking} onChange={handleChange} required className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium">
                                            <option value="">-- Chọn hạng --</option>
                                            <option value="Xuất sắc">Xuất sắc</option>
                                            <option value="Giỏi">Giỏi</option>
                                            <option value="Khá">Khá</option>
                                            <option value="Trung bình">Trung bình</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Số hiệu văn bằng (No) <span className="text-red-500">*</span></label>
                                    <input name="diplomaNumber" value={formData.diplomaNumber} onChange={handleChange} required type="text" placeholder="VD: QH119202500101" className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium font-mono" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Số vào sổ gốc cấp (Reg. No) <span className="text-red-500">*</span></label>
                                    <input name="registryNumber" value={formData.registryNumber} onChange={handleChange} required type="text" placeholder="VD: 1977201011069CQ" className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium font-mono" />
                                </div>
                            </div>
                        </section>

                        {/* NÚT SUBMIT */}
                        <div className="flex justify-end pt-4">
                            <button
                                disabled={isLoading || isOcrProcessing}
                                type="submit"
                                className="flex items-center gap-2 px-8 py-3.5 bg-[#1E3A8A] text-white rounded-xl font-bold hover:bg-[#152961] hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Save size={18} />
                                )}
                                <span>{isLoading ? 'Đang lưu dữ liệu...' : 'Lưu hồ sơ văn bằng'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}