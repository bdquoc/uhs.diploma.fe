"use client"

import { Save, User, FileBadge, ArrowLeft } from 'lucide-react'
import { useState } from "react"
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Thêm router để chuyển trang

export default function CreateDiplomaPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

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

    // 3. Xử lý khi bấm nút Lưu
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Tạo ID ngẫu nhiên cho hồ sơ (VD: UHS-8821)
        const randomId = `UHS-${Math.floor(1000 + Math.random() * 9000)}`;

        // Đóng gói dữ liệu kèm trạng thái PENDING (Chờ duyệt)
        const newPendingDiploma = {
            id: randomId,
            ...formData,
            submittedAt: new Date().toISOString(),
            status: 'PENDING',
            source: 'MANUAL'
        };

        // Lưu vào LocalStorage của trình duyệt
        const existingPending = JSON.parse(localStorage.getItem('uhs_pending_approvals') || '[]');
        const updatedPending = [newPendingDiploma, ...existingPending];
        localStorage.setItem('uhs_pending_approvals', JSON.stringify(updatedPending));

        // Giả lập thời gian loading cho mượt, sau đó thông báo và chuyển trang
        setTimeout(() => {
            setIsLoading(false);
            alert("Đã chuyển hồ sơ sang mục Chờ phê duyệt!");
            router.push('/approvals'); // Chuyển thẳng tới trang danh sách duyệt
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-500">

            {/* Header Trang */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Link href="/" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-black text-[#1E3A8A]">Khai báo văn bằng mới</h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium ml-11">Nhập thủ công thông tin phôi bằng vào hệ thống lưu trữ.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* PHẦN 1: THÔNG TIN CÁ NHÂN */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-[#1E3A8A] font-bold border-b border-slate-100 pb-4">
                        <User size={20} />
                        <span>Thông tin cá nhân sinh viên</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Họ và tên <span className="text-red-500">*</span></label>
                            {/* Chú ý: Đã thêm name, value và onChange vào tất cả các input */}
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
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
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
                        disabled={isLoading}
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
    )
}