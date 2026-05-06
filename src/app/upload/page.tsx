"use client"

import React, { useState, useRef } from 'react';
import { UploadCloud, ScanLine, FileCheck2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Kiểu dữ liệu mô phỏng kết quả OCR trả về từ Backend
interface OCRResult {
    fullName: string;
    dob: string;
    major: string;
    ranking: string;
    gradYear: string;
    regNo: string;
    serialNo: string;
}

export default function UploadAIPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [ocrData, setOcrData] = useState<OCRResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // 1. Xử lý khi người dùng chọn ảnh
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setOcrData(null);
        }
    };

    // 2. Giả lập gọi API OCR lên Backend
    const handleStartScan = () => {
        if (!selectedImage) return;

        setIsScanning(true);
        toast.loading('AI đang phân tích văn bằng...', { id: 'ocr-toast' });

        setTimeout(() => {
            const mockExtractedData: OCRResult = {
                fullName: 'LƯU THỊ ÁNH XUÂN',
                dob: '04/08/1997',
                major: 'Bác sĩ y khoa',
                ranking: 'Khá',
                gradYear: '2025',
                serialNo: 'QH119202500101',
                regNo: '1977201011069CQ'
            };

            setOcrData(mockExtractedData);
            setIsScanning(false);
            toast.success('Nhận diện thành công!', { id: 'ocr-toast' });
        }, 3000);
    };

    const clearImage = () => {
        setSelectedImage(null);
        setOcrData(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="max-w-[1600px] mx-auto w-full space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-[#1E3A8A] flex items-center gap-2">
                    <ScanLine size={24} /> Trích xuất dữ liệu từ hình ảnh (OCR)
                </h1>
                <p className="text-sm text-slate-500 font-medium mt-1">
                    Tải lên hình ảnh văn bằng để hệ thống AI tự động đọc và điền thông tin.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CỘT TRÁI: Khu vực Upload Ảnh */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ImageIcon size={18} className="text-blue-600" /> Bản chụp văn bằng
                    </h2>

                    {!selectedImage ? (
                        // Trạng thái chưa có ảnh: Khu vực kéo thả
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors p-8 text-center min-h-[300px]"
                        >
                            <UploadCloud size={48} className="text-blue-500 mb-4" />
                            <p className="text-base font-bold text-[#1E3A8A] mb-1">Nhấn để tải lên hoặc kéo thả ảnh</p>
                            <p className="text-xs text-slate-500 font-medium">Hỗ trợ định dạng: JPG, PNG, WEBP (Max 5MB)</p>
                        </div>
                    ) : (
                        // Trạng thái đã chọn ảnh
                        <div className="flex-1 flex flex-col">
                            <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-4 group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={selectedImage} alt="Preview" className="w-full h-auto max-h-[400px] object-contain" />
                                <button
                                    onClick={clearImage}
                                    className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <button
                                onClick={handleStartScan}
                                disabled={isScanning || ocrData !== null}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isScanning ? 'bg-slate-100 text-slate-500 cursor-not-allowed' :
                                    ocrData ? 'bg-green-50 text-green-600 border border-green-200 cursor-default' :
                                        'bg-[#1E3A8A] text-white hover:bg-[#152961] shadow-md shadow-blue-100 active:scale-[0.98]'
                                    }`}
                            >
                                {isScanning ? (
                                    <><Loader2 size={18} className="animate-spin" /> Đang phân tích dữ liệu...</>
                                ) : ocrData ? (
                                    <><FileCheck2 size={18} /> Đã quét xong</>
                                ) : (
                                    <><ScanLine size={18} /> Bắt đầu quét AI</>
                                )}
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>

                {/* CỘT PHẢI: Kết quả trả về (Mock Form) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileCheck2 size={18} className="text-emerald-600" /> Kết quả trích xuất
                    </h2>

                    {!ocrData && !isScanning && (
                        <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-xl bg-slate-50">
                            Chưa có dữ liệu trích xuất
                        </div>
                    )}

                    {isScanning && (
                        <div className="h-[300px] flex flex-col items-center justify-center text-blue-500 text-sm font-bold border border-blue-100 rounded-xl bg-blue-50/50 space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                                <ScanLine size={40} className="animate-pulse" />
                            </div>
                            <p>Hệ thống đang đọc các trường thông tin...</p>
                        </div>
                    )}

                    {ocrData && (
                        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase">Họ và tên</label>
                                    <input readOnly value={ocrData.fullName} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase">Ngày sinh</label>
                                    <input readOnly value={ocrData.dob} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase">Ngành đào tạo</label>
                                    <input readOnly value={ocrData.major} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase">Hạng tốt nghiệp</label>
                                    <input readOnly value={ocrData.ranking} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase">Năm tốt nghiệp</label>
                                    <input readOnly value={ocrData.gradYear} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase">Số hiệu (No)</label>
                                    <input readOnly value={ocrData.serialNo} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase">Số vào sổ gốc cấp (Reg. No)</label>
                                <input readOnly value={ocrData.regNo} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            </div>

                            <button
                                onClick={() => {
                                    // Lưu dữ liệu vào bộ nhớ tạm
                                    sessionStorage.setItem('scannedDiplomaData', JSON.stringify(ocrData));
                                    // Chuyển hướng sang trang kết quả
                                    router.push('/upload/result');
                                }}
                                className="w-full mt-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100 flex justify-center items-center gap-2"
                            >
                                Chuyển dữ liệu sang form Khai báo mới
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}