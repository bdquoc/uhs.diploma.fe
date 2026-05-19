"use client"

import { Bell, UserCircle, CalendarDays, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    // --- STATES ---
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [greeting, setGreeting] = useState('');
    const unreadCount = 2; // Bạn có thể thay đổi số này bằng props hoặc API thực tế

    // --- LOGIC ---
    useEffect(() => {
        setCurrentTime(new Date());

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('Chào buổi sáng');
        else if (hour >= 12 && hour < 18) setGreeting('Chào buổi chiều');
        else setGreeting('Chào buổi tối');

        return () => clearInterval(timer);
    }, []);

    const formattedDate = currentTime?.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formattedTime = currentTime?.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="flex items-center justify-between w-full relative">

            {/* Left side: Thời gian & Câu chào động */}
            <div className="hidden lg:flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{greeting}, Admin! 👋</span>
                    <span className="text-xs text-slate-500 font-medium">Chúc bạn một ngày làm việc hiệu quả.</span>
                </div>

                <div className="h-8 w-px bg-slate-200"></div>

                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                        <CalendarDays size={16} className="text-blue-500" />
                        <span>{formattedDate || 'Đang tải...'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-amber-500" />
                        <span>{formattedTime || '--:--'}</span>
                    </div>
                </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-3 md:gap-5 ml-auto">

                {/* --- NOTIFICATION (Chỉ hiển thị Icon & Số, không Dropdown) --- */}
                <button className="relative p-2.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all duration-200">
                    <Bell size={22} className={unreadCount > 0 ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''} style={{ animationIterationCount: 1 }} />

                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* --- USER PROFILE (Không Dropdown, Không Icon Mở Rộng) --- */}
                <div className="relative pl-4 border-l border-slate-200">
                    <div className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Admin User</p>
                            <p className="text-xs text-slate-500">Quản trị viên</p>
                        </div>
                        <div className="bg-slate-100 p-1.5 rounded-full group-hover:ring-2 group-hover:ring-blue-100 group-hover:bg-blue-50 transition-all">
                            <UserCircle size={28} className="text-slate-500 group-hover:text-blue-600" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}