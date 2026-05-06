"use client"

import { Bell, Search, UserCircle, ChevronDown } from 'lucide-react';

export default function Navbar() {
    return (
        <div className="flex items-center justify-between w-full">
            {/* Left side: Search bar giả để UI đẹp hơn */}
            <div className="relative hidden sm:block w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Tìm kiếm chứng chỉ..."
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                />
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-5">
                {/* Notification */}
                <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer group">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Admin User</p>
                        <p className="text-xs text-slate-500">Quản trị viên</p>
                    </div>
                    <div className="bg-slate-100 p-1 rounded-full group-hover:ring-2 group-hover:ring-blue-100 transition-all">
                        <UserCircle size={32} className="text-slate-400" />
                    </div>
                    <ChevronDown size={16} className="text-slate-400" />
                </div>
            </div>
        </div>
    );
}