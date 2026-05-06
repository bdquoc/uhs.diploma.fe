"use client"

import React, { useState } from 'react';
import {
    Users, Plus, Search, Edit2, Trash2,
    ShieldAlert, X, Save, ShieldCheck, FileSignature, Keyboard
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Staff {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'APPROVER' | 'DATA_ENTRY';
    status: 'ACTIVE' | 'LOCKED';
}

const initialStaff: Staff[] = [
    { id: 'NV001', fullName: 'Nguyễn Trần Quản Trị', email: 'admin@uhs.edu.vn', role: 'ADMIN', status: 'ACTIVE' },
    { id: 'NV002', fullName: 'Lê Thị Thẩm Định', email: 'duyetbang@uhs.edu.vn', role: 'APPROVER', status: 'ACTIVE' },
    { id: 'NV003', fullName: 'Trần Văn Nhập Liệu', email: 'nhaplieu@uhs.edu.vn', role: 'DATA_ENTRY', status: 'ACTIVE' },
    { id: 'NV004', fullName: 'Phạm Nhân Viên Cũ', email: 'oldstaff@uhs.edu.vn', role: 'DATA_ENTRY', status: 'LOCKED' },
];

export default function PersonnelManagementPage() {
    const currentUserRole = 'ADMIN';

    const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    if (currentUserRole !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
                <ShieldAlert size={64} className="text-red-500" />
                <h2 className="text-2xl font-black text-slate-800">Không có quyền truy cập</h2>
                <p className="text-slate-500">Chỉ Quản trị viên (Admin) mới có thể xem trang này.</p>
            </div>
        );
    }

    const filteredStaff = staffList.filter(staff =>
        staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (staff?: Staff) => {
        if (staff) {
            setEditingStaff(staff);
        } else {
            setEditingStaff({ id: `NV00${staffList.length + 1}`, fullName: '', email: '', role: 'DATA_ENTRY', status: 'ACTIVE' });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStaff) return;

        const isExisting = staffList.find(s => s.id === editingStaff.id);
        if (isExisting) {
            setStaffList(staffList.map(s => s.id === editingStaff.id ? editingStaff : s));
            toast.success('Đã cập nhật thông tin nhân viên!');
        } else {
            setStaffList([...staffList, editingStaff]);
            toast.success('Đã thêm nhân viên mới!');
        }
        setIsModalOpen(false);
    };

    const renderRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100 w-max"><ShieldCheck size={14} /> Quản trị viên</span>;
            case 'APPROVER': return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100 w-max"><FileSignature size={14} /> Nhân viên duyệt</span>;
            case 'DATA_ENTRY': return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100 w-max"><Keyboard size={14} /> Nhân viên nhập</span>;
            default: return null;
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto w-full space-y-6 animate-in fade-in duration-500 relative">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E3A8A] flex items-center gap-2">
                        <Users size={24} /> Quản lý nhân sự
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý tài khoản và phân quyền cán bộ hệ thống.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl font-bold hover:bg-[#152961] transition-all active:scale-95 text-sm shadow-md shadow-blue-100"
                >
                    <Plus size={18} /> Thêm nhân viên
                </button>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Thanh công cụ tìm kiếm */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Nhân viên</th>
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Vai trò</th>
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStaff.map((staff) => (
                                <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1E3A8A] font-bold text-sm shrink-0">
                                                {staff.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{staff.fullName}</p>
                                                <p className="text-xs text-slate-500 font-medium">{staff.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {renderRoleBadge(staff.role)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${staff.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                            {staff.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(staff)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                                                <Edit2 size={16} />
                                            </button>
                                            {staff.role !== 'ADMIN' && (
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Khóa tài khoản">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStaff.length === 0 && (
                        <div className="p-8 text-center text-slate-500 text-sm">Không tìm thấy nhân viên nào phù hợp.</div>
                    )}
                </div>
            </div>

            {/* MODAL CHỈNH SỬA / THÊM MỚI (Overlay) */}
            {isModalOpen && editingStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h3 className="text-lg font-black text-[#1E3A8A]">
                                {editingStaff.id.startsWith('NV00') && editingStaff.fullName === '' ? 'Thêm nhân sự mới' : 'Cập nhật thông tin'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Họ và tên</label>
                                <input required type="text" value={editingStaff.fullName} onChange={(e) => setEditingStaff({ ...editingStaff, fullName: e.target.value })} className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium" placeholder="Nhập họ và tên..." />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Email truy cập</label>
                                <input required type="email" value={editingStaff.email} onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })} className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium" placeholder="VD: email@uhs.edu.vn" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Vai trò hệ thống</label>
                                    <select value={editingStaff.role} onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as any })} className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium">
                                        <option value="DATA_ENTRY">Nhân viên nhập liệu</option>
                                        <option value="APPROVER">Nhân viên duyệt</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Trạng thái</label>
                                    <select value={editingStaff.status} onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as any })} className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-[#1E3A8A] outline-none font-medium">
                                        <option value="ACTIVE">Đang hoạt động</option>
                                        <option value="LOCKED">Khóa tài khoản</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-all">
                                    Hủy bỏ
                                </button>
                                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-[#1E3A8A] text-white rounded-xl font-bold hover:bg-[#152961] transition-all active:scale-95 text-sm">
                                    <Save size={16} /> Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}