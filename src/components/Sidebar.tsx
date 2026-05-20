"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
// Import Context
import { useAppContext } from '@/components/AppContext';
import {
    LayoutDashboard,
    FileUp,
    PlusCircle,
    Settings,
    LogOut,
    CheckSquare,
    Users,
    Archive,
    Search // 1. Thêm icon Search cho trang Tra cứu
} from 'lucide-react';

// Định nghĩa danh sách Menu
const menuItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['ADMIN', 'MANAGER', 'STAFF']
    },
    {
        name: 'Khai báo mới',
        href: '/create',
        icon: PlusCircle,
        roles: ['ADMIN', 'STAFF']
    },
    {
        name: 'Phê duyệt',
        href: '/approvals',
        icon: CheckSquare,
        roles: ['ADMIN', 'MANAGER']
    },
    {
        name: 'Kho văn bằng',
        href: '/certificates',
        icon: Archive,
        roles: ['ADMIN', 'MANAGER']
    },
    // 2. THÊM TRANG TRA CỨU VÀO ĐÂY
    {
        name: 'Tra cứu',
        href: '/lookup',
        icon: Search,
        roles: ['ADMIN', 'MANAGER', 'STAFF'] // Cho phép tất cả nhân viên truy cập để kiểm tra nhanh
    },
    {
        name: 'Quản lý nhân sự',
        href: '/admin/users',
        icon: Users,
        roles: ['ADMIN']
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    // Lấy thông tin User (Mẫu)
    const user = {
        role: 'ADMIN',
        name: 'Quản trị viên'
    };

    // Lấy số hồ sơ chờ duyệt từ Context
    const { pendingCount } = useAppContext();

    return (
        <div className="flex flex-col h-full py-6">
            {/* SECTION LOGO */}
            <div className="px-6 mb-10 flex items-center gap-3 border-b border-slate-50 pb-6">
                <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                        src="/logo.png"
                        alt="UHS Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div>
                    <span className="text-xl font-bold text-[#1E3A8A]">UHS Diploma</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    // KIỂM TRA QUYỀN TRUY CẬP
                    const hasAccess = item.roles.includes(user.role);
                    if (!hasAccess) return null;

                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-50 text-[#1E3A8A] border border-blue-100 shadow-sm shadow-blue-50'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon
                                size={18}
                                className={isActive ? 'text-[#1E3A8A]' : 'text-slate-400 group-hover:text-slate-600'}
                            />
                            <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                                {item.name}
                            </span>

                            {/* Badge cho Phê duyệt */}
                            {item.name === 'Phê duyệt' && pendingCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                                    {pendingCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info & Logout Button */}
            <div className="px-4 mt-auto pt-4 border-t border-slate-50 space-y-2">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group">
                    <LogOut size={18} className="group-hover:text-red-500" />
                    <span className="font-bold text-sm">Đăng xuất</span>
                </button>
            </div>
        </div>
    );
}