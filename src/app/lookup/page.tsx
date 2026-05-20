"use client"

import React, { useState } from 'react';
import { Search, ShieldCheck, Award, Calendar, User, BookOpen, Hash, FileText, X, Download, Printer, CheckCircle2, ArrowRight, AlertCircle, CalendarCheck, Star, MapPin, Globe, Users } from 'lucide-react';

// Định nghĩa đầy đủ các trường thông tin theo form khai báo
interface Diploma {
    id: string;
    fullName: string;
    dob: string;
    gender: string;
    ethnicity: string;
    nationality: string;
    pob: string;
    major: string;
    gradYear: string;
    ranking: string;
    serialNo: string;
    regNo: string;
    approvedAt: string;
}

export default function PublicLookup() {
    const [serialInput, setSerialInput] = useState('');
    const [result, setResult] = useState<Diploma | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serialInput.trim()) return;

        setHasSearched(true);
        const storedData = JSON.parse(localStorage.getItem('uhs_approved_diplomas') || '[]');
        const found = storedData.find((d: Diploma) =>
            d.serialNo?.toLowerCase() === serialInput.trim().toLowerCase()
        );
        setResult(found || null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E3A8A]">Tra cứu văn bằng</h1>
                    <p className="text-slate-500 text-sm mt-1">Xác thực thông tin văn bằng chính thức từ hệ thống UHS Diploma.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#1E3A8A] rounded-lg border border-blue-100 text-[11px] font-bold uppercase tracking-wider">
                    <ShieldCheck size={14} /> Hệ thống xác thực an toàn
                </div>
            </div>

            {/* 2. SEARCH CARD */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={serialInput}
                            onChange={(e) => setSerialInput(e.target.value)}
                            placeholder="Nhập số hiệu văn bằng để kiểm tra (VD: QH119...)"
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1E3A8A] outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-8 py-3.5 bg-[#1E3A8A] hover:bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                    >
                        Tra cứu ngay <ArrowRight size={18} />
                    </button>
                </form>
            </div>

            {/* 3. RESULTS AREA */}
            <div className="min-h-[400px]">
                {!hasSearched ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-60">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                            <FileText size={40} className="text-slate-300" />
                        </div>
                        <div>
                            <p className="text-slate-900 font-bold">Sẵn sàng tra cứu</p>
                            <p className="text-slate-500 text-xs mt-1">Vui lòng nhập số hiệu văn bằng vào ô bên trên.</p>
                        </div>
                    </div>
                ) : result ? (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                                <div className="w-40 h-52 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-2 group cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setShowModal(true)}>
                                    <Award size={48} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    <span className="text-[10px] font-black uppercase text-center px-4">Nhấn để xem<br />bản gốc</span>
                                </div>

                                <div className="flex-1 space-y-5">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-100 flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Văn bằng hợp lệ
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{result.fullName}</h2>
                                        <p className="text-[#1E3A8A] font-bold text-lg">{result.major}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <ResultInfo label="Số hiệu" value={result.serialNo} isMono />
                                        <ResultInfo label="Xếp loại" value={result.ranking} />
                                        <ResultInfo label="Năm tốt nghiệp" value={result.gradYear} />
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 flex flex-wrap gap-3">
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-lg font-bold text-xs hover:bg-slate-900 transition-all flex items-center gap-2"
                                        >
                                            <Award size={16} /> Xem chi tiết & Hình ảnh
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-50/50 rounded-2xl border border-red-100 p-12 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-lg font-black text-red-900">Không tìm thấy dữ liệu</h3>
                        <p className="text-red-700/70 text-sm mt-1 max-w-sm mx-auto font-medium">
                            Số hiệu <span className="font-bold underline">"{serialInput}"</span> không tồn tại trong hệ thống.
                        </p>
                    </div>
                )}
            </div>

            {/* MODAL ĐÃ ĐƯỢC MỞ RỘNG (max-w-7xl) */}
            {showModal && result && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-7xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95">

                        {/* Cột trái: Hình ảnh văn bằng (Chiếm 60% chiều ngang) */}
                        <div className="w-full md:w-[60%] bg-slate-100 p-12 flex items-center justify-center overflow-y-auto hidden md:flex border-r border-slate-100">
                            <div className="w-full max-w-[450px] aspect-[1/1.414] bg-white shadow-2xl rounded-sm p-12 flex flex-col items-center justify-between border-[12px] border-double border-yellow-600/10 relative">
                                <div className="text-center space-y-1">
                                    <p className="text-[10px] font-serif font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                                    <p className="text-[8px] font-serif border-b border-black pb-1 px-4 inline-block italic">Độc lập - Tự do - Hạnh phúc</p>
                                    <h2 className="text-2xl font-serif font-bold text-yellow-800 pt-8 uppercase">BẰNG TỐT NGHIỆP</h2>
                                </div>
                                <div className="text-center space-y-5">
                                    <p className="text-xs font-serif italic">Hiệu trưởng trường Đại học Y Dược chứng nhận:</p>
                                    <h3 className="text-2xl font-serif font-black text-slate-900 uppercase tracking-widest">{result.fullName}</h3>
                                    <p className="text-xs font-serif">Ngành đào tạo: <span className="font-bold">{result.major}</span></p>
                                    <p className="text-xs font-serif">Xếp loại: <span className="font-bold">{result.ranking}</span></p>
                                </div>
                                <div className="w-full flex justify-between items-end">
                                    <div className="text-[9px] font-mono opacity-50 space-y-1">
                                        <p>Số hiệu: {result.serialNo}</p>
                                        <p>Số vào sổ: {result.regNo}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-serif italic mb-6">TP. Hồ Chí Minh, {result.approvedAt}</p>
                                        <div className="w-20 h-20 rounded-full border-2 border-red-600/30 flex items-center justify-center rotate-12 mx-auto">
                                            <span className="text-[9px] text-red-600 font-bold uppercase text-center leading-tight">UHS<br />XÁC THỰC</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Thông tin chi tiết (Chiếm 40% chiều ngang) */}
                        <div className="w-full md:w-[40%] flex flex-col bg-white max-h-[92vh]">
                            {/* Header */}
                            <div className="flex justify-between items-center p-8 border-b border-slate-100">
                                <div>
                                    <h2 className="text-2xl font-black text-[#1E3A8A]">Thông tin văn bằng</h2>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Dữ liệu gốc từ hệ thống lưu trữ</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={28} /></button>
                            </div>

                            {/* Body - Các dòng thông tin rời rạc, thoáng đạt */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                                {/* Nhóm thông tin cá nhân */}
                                <div className="space-y-6">
                                    <p className="text-[11px] font-black text-[#1E3A8A] uppercase tracking-widest opacity-50 flex items-center gap-2">
                                        <User size={12} /> Thông tin cá nhân
                                    </p>
                                    <InfoRow label="Họ và tên học viên" value={result.fullName} icon={<User size={20} />} />
                                    <div className="grid grid-cols-2 gap-8">
                                        <InfoRow label="Ngày sinh" value={result.dob} icon={<Calendar size={20} />} />
                                        <InfoRow label="Giới tính" value={result.gender || "Nam"} icon={<Users size={20} />} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <InfoRow label="Dân tộc" value={result.ethnicity || "Kinh"} icon={<Globe size={20} />} />
                                        <InfoRow label="Quốc tịch" value={result.nationality || "Việt Nam"} icon={<Globe size={20} />} />
                                    </div>
                                    <InfoRow label="Nơi sinh" value={result.pob || "Đang cập nhật"} icon={<MapPin size={20} />} />
                                </div>

                                <div className="h-px bg-slate-100/50 w-full"></div>

                                {/* Nhóm thông tin chuyên môn */}
                                <div className="space-y-6">
                                    <p className="text-[11px] font-black text-[#1E3A8A] uppercase tracking-widest opacity-50 flex items-center gap-2">
                                        <BookOpen size={12} /> Thông tin tốt nghiệp
                                    </p>
                                    <InfoRow label="Ngành học xác thực" value={result.major} icon={<BookOpen size={20} />} />
                                    <div className="grid grid-cols-2 gap-8">
                                        <InfoRow label="Năm tốt nghiệp" value={result.gradYear} icon={<CalendarCheck size={20} />} />
                                        <InfoRow label="Xếp loại hạng" value={result.ranking} icon={<Star size={20} />} />
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100/50 w-full"></div>

                                {/* Nhóm thông tin định danh bằng */}
                                <div className="space-y-6">
                                    <p className="text-[11px] font-black text-[#1E3A8A] uppercase tracking-widest opacity-50 flex items-center gap-2">
                                        <Hash size={12} /> Định danh hệ thống
                                    </p>
                                    <InfoRow label="Số hiệu văn bằng (NO.)" value={result.serialNo} icon={<Hash size={20} />} isMono />
                                    <InfoRow label="Số vào sổ gốc cấp (REG. NO.)" value={result.regNo} icon={<FileText size={20} />} isMono />
                                    <InfoRow label="Ngày phê duyệt cấp" value={result.approvedAt} icon={<ShieldCheck size={20} />} />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3">
                                <button className="w-full py-4 bg-[#1E3A8A] text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/10 active:scale-[0.98]">
                                    <Printer size={18} /> In bản chứng nhận điện tử
                                </button>
                                <button onClick={() => setShowModal(false)} className="w-full py-3.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-2xl transition-all">
                                    Đóng cửa sổ tra cứu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-components
function ResultInfo({ label, value, isMono = false }: { label: string, value: string, isMono?: boolean }) {
    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">{label}</p>
            <p className={`text-[15px] font-black text-slate-700 ${isMono ? 'font-mono' : ''}`}>{value}</p>
        </div>
    )
}

function InfoRow({ label, value, icon, isMono = false }: { label: string, value: string, icon: any, isMono?: boolean }) {
    return (
        <div className="flex items-start gap-5 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center border border-blue-100/50 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                <p className={`text-[16px] font-bold text-slate-800 uppercase truncate ${isMono ? 'font-mono text-blue-600' : ''}`}>
                    {value || "---"}
                </p>
            </div>
        </div>
    )
}