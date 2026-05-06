"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function OCRResultPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '', dob: '', major: '', ranking: '', gradYear: '', regNo: '', serialNo: ''
    });

    useEffect(() => {
        const savedData = sessionStorage.getItem('scannedDiplomaData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        } else {
            // Nếu không có dữ liệu (user gõ URL trực tiếp), đẩy về trang upload
            toast.error('Không tìm thấy dữ liệu OCR!');
            router.push('/upload');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        toast.success('Đã lưu hồ sơ văn bằng thành công!');
        sessionStorage.removeItem('scannedDiplomaData'); // Xóa bộ nhớ tạm
        router.push('/dashboard');
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-[#1E3A8A]">Xác nhận thông tin văn bằng</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Kiểm tra và chỉnh sửa lại các thông tin do AI trích xuất nếu cần.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
                {/* Section 1: Thông tin cá nhân */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Thông tin cá nhân sinh viên</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase">Họ và tên <span className="text-red-500">*</span></label>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase">Ngày sinh <span className="text-red-500">*</span></label>
                            <input name="dob" value={formData.dob} onChange={handleChange} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Thông tin văn bằng */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Thông tin văn bằng cấp phát</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase">Ngành đào tạo <span className="text-red-500">*</span></label>
                            <input name="major" value={formData.major} onChange={handleChange} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase">Năm tốt nghiệp <span className="text-red-500">*</span></label>
                            <input name="gradYear" value={formData.gradYear} onChange={handleChange} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase">Hạng tốt nghiệp <span className="text-red-500">*</span></label>
                            <select name="ranking" value={formData.ranking} onChange={handleChange} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                <option value="Xuất sắc">Xuất sắc</option>
                                <option value="Giỏi">Giỏi</option>
                                <option value="Khá">Khá</option>
                                <option value="Trung bình">Trung bình</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase">Số hiệu (No) <span className="text-red-500">*</span></label>
                            <input name="serialNo" value={formData.serialNo} onChange={handleChange} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-black text-slate-500 uppercase">Số vào sổ gốc cấp (Reg. No) <span className="text-red-500">*</span></label>
                            <input name="regNo" value={formData.regNo} onChange={handleChange} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                    </div>
                </div>

                {/* Nút Submit */}
                <div className="flex justify-end pt-4">
                    <button onClick={handleSave} className="px-8 py-3 bg-[#1E3A8A] text-white rounded-xl font-bold hover:bg-[#152961] shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                        <Save size={20} /> Lưu hồ sơ văn bằng
                    </button>
                </div>
            </div>
        </div>
    );
}