"use client"

import { Save, Database, Settings2 } from 'lucide-react'
import { useEffect, useState } from "react"

export default function SettingsPage() {
    const [mounted, setMounted] = useState(false)

    // Đảm bảo component đã mount trên client
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            {/* TIÊU ĐỀ TRANG */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Settings2 className="text-[#1E3A8A]" size={24} />
                    <h1 className="text-2xl font-black text-[#1E3A8A]">Cấu hình hệ thống</h1>
                </div>
                <p className="text-slate-500 text-sm font-medium">Thiết lập các tham số vận hành cho hệ thống quản lý văn bằng UHS.</p>
            </div>

            <div className="space-y-6">
                {/* SECTION: THÔNG TIN PHÔI BẰNG */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-[#1E3A8A] font-bold border-b border-slate-100 pb-4">
                        <Database size={20} />
                        <span>Thông tin phôi bằng & Chữ ký số</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tên Hiệu trưởng */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Tên Hiệu trưởng đương nhiệm</label>
                            <input
                                type="text"
                                defaultValue="TS. Nguyễn Văn A"
                                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium"
                                placeholder="Nhập họ và tên..."
                            />
                        </div>

                        {/* Tiền tố số hiệu */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Tiền tố số hiệu văn bằng</label>
                            <input
                                type="text"
                                defaultValue="UHS-2024-"
                                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium"
                                placeholder="Ví dụ: UHS-2024-"
                            />
                        </div>

                        {/* Các cấu hình bổ sung có thể thêm ở đây */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Năm tốt nghiệp mặc định</label>
                            <input
                                type="number"
                                defaultValue="2024"
                                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Địa danh ký bằng</label>
                            <input
                                type="text"
                                defaultValue="TP. Hồ Chí Minh"
                                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none transition-all font-medium"
                            />
                        </div>
                    </div>
                </section>

                {/* NÚT LƯU CẤU HÌNH */}
                <div className="flex justify-start">
                    <button className="flex items-center gap-2 px-10 py-3.5 bg-[#1E3A8A] text-white rounded-xl font-bold hover:bg-[#152961] hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-95 group">
                        <Save size={18} className="group-hover:animate-pulse" />
                        Lưu thay đổi hệ thống
                    </button>
                </div>
            </div>

            {/* FOOTER GHI CHÚ */}
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                    * Lưu ý: Các thay đổi tại đây sẽ áp dụng cho tất cả các bản in văn bằng và hồ sơ được tạo mới sau thời điểm lưu. Các hồ sơ đã phê duyệt sẽ không bị ảnh hưởng.
                </p>
            </div>
        </div>
    )
}