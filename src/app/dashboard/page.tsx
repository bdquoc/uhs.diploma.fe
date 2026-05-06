'use client';

import React from 'react';
import { useAppContext } from '@/components/AppContext';
import { FileText, Clock, CheckCircle, TrendingUp, BarChart2, Activity } from 'lucide-react';

export default function Dashboard() {

    const { pendingCount, totalDiplomas, monthlyDiplomas } = useAppContext();

    const currentMonthStr = `Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

    return (
        <div className="font-sans w-full">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Chào buổi sáng, Admin!</h1>
                <p className="text-gray-600 mt-1">
                    Hệ thống đang có <strong className="text-orange-600">{pendingCount} hồ sơ</strong> văn bằng chờ bạn thẩm định và ký số trong hôm nay.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Card 1: Tổng văn bằng */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12%
                        </span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Tổng văn bằng lưu trữ</h3>
                    {/* Hiển thị số liệu thực tế */}
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalDiplomas}</p>
                </div>

                {/* Card 2: Chờ phê duyệt */}
                <div className="bg-white p-6 rounded-xl border-l-4 border-l-orange-500 shadow-sm flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Chờ phê duyệt</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{pendingCount}</p>
                    <button className="absolute bottom-4 right-4 text-sm text-orange-600 font-medium hover:underline">
                        Xử lý ngay &rarr;
                    </button>
                </div>

                {/* Card 3: Đã cấp trong tháng */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">{currentMonthStr}</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Đã cấp trong tháng</h3>
                    {/* Hiển thị số liệu thực tế */}
                    <p className="text-2xl font-bold text-gray-900 mt-1">{monthlyDiplomas}</p>
                </div>

                {/* Card 4: Tỷ lệ OCR */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                            <BarChart2 className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">98.5%</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Tỷ lệ OCR chính xác</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">Ổn định</p>
                </div>
            </div>

            {/* Chart & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Thống kê số hóa văn bằng</h2>
                            <p className="text-sm text-gray-500">Dữ liệu bóc tách từ AI (OCR) so với Nhập thủ công</p>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-600"></div> AI (OCR)
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-300"></div> Thủ công
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-6 pt-4 border-b border-gray-200">
                        {[
                            { m: 'T11', a: 60, mnl: 20 },
                            { m: 'T12', a: 80, mnl: 15 },
                            { m: 'T1', a: 40, mnl: 10 },
                            { m: 'T2', a: 90, mnl: 30 },
                            { m: 'T3', a: 100, mnl: 10 },
                            { m: 'T4', a: 70, mnl: 5 },
                        ].map((data, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                                <div className="w-full bg-gray-300 rounded-t-sm hover:bg-gray-400 transition-colors" style={{ height: `${data.mnl}%` }}></div>
                                <div className="w-full bg-blue-600 rounded-t-sm mt-1 hover:bg-blue-700 transition-colors" style={{ height: `${data.a}%` }}></div>
                                <span className="text-xs text-gray-500 mt-2">{data.m}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-gray-500" />
                        Hoạt động gần đây
                    </h2>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {pendingCount > 0 && (
                            <div className="relative pl-6 border-l-2 border-orange-200">
                                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></span>
                                <p className="text-sm font-medium text-gray-900">{pendingCount} hồ sơ mới chờ duyệt</p>
                                <p className="text-xs text-gray-500 mt-1">Cần ký số thẩm định</p>
                                <p className="text-xs text-gray-400 mt-1">Vừa xong</p>
                            </div>
                        )}
                        <div className="relative pl-6 border-l-2 border-green-200">
                            <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
                            <p className="text-sm font-medium text-gray-900">Vừa cấp {monthlyDiplomas} văn bằng</p>
                            <p className="text-xs text-gray-500 mt-1">Trong tháng này</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}