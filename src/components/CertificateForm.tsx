"use client"

import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { User, IdCard, Calendar, BookOpen, Award, Hash, UserCheck, Save, RotateCcw, GraduationCap } from 'lucide-react'

export default function CertificateForm({ defaultValues, onSubmit }: any) {
    const { register, handleSubmit, reset } = useForm({ defaultValues })

    useEffect(() => { reset(defaultValues) }, [defaultValues, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Thông tin sinh viên */}
            <Section title="Thông tin sinh viên" icon={<User className="text-[#10B981]" size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Họ và tên" name="name" register={register} icon={<User size={14} />} placeholder="NGUYEN VAN A" />
                    <Input
                        label="Ngày sinh"
                        name="dob"
                        type="date" // THÊM DÒNG NÀY
                        register={register}
                        icon={<Calendar size={14} />}
                    />
                    <Input label="Mã sinh viên" name="student_id" register={register} icon={<IdCard size={14} />} placeholder="SV12345" />
                </div>
            </Section>

            {/* Thông tin đào tạo */}
            <Section title="Thông tin đào tạo" icon={<BookOpen className="text-[#10B981]" size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Ngành học" name="program" register={register} icon={<BookOpen size={14} />} placeholder="CNTT, Y đa khoa..." />
                    <Input label="Hệ đào tạo" name="degree_type" register={register} icon={<GraduationCap size={14} />} placeholder="Cử nhân" />
                    <Input label="Xếp loại" name="classification" register={register} icon={<Award size={14} />} placeholder="Giỏi/Xuất sắc" />
                </div>
            </Section>

            {/* Thông tin cấp bằng */}
            <Section title="Thông tin cấp bằng" icon={<Hash className="text-[#10B981]" size={20} />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Số hiệu văn bằng" name="diploma_number" register={register} icon={<Hash size={14} />} placeholder="Số hiệu..." />
                    <Input
                        label="Ngày cấp"
                        name="issued_date"
                        type="date" // THÊM DÒNG NÀY
                        register={register}
                        icon={<Calendar size={14} />}
                    />
                    <Input label="Người ký" name="signer" register={register} icon={<UserCheck size={14} />} placeholder="Hiệu trưởng..." />
                </div>
            </Section>

            <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => reset()} className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <RotateCcw size={18} /> Làm mới
                </button>
                <button type="submit" className="flex-[2] py-3 bg-[#1E3A8A] text-white rounded-xl font-bold hover:bg-[#162a63] shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
                    <Save size={18} /> Lưu hồ sơ hệ thống
                </button>
            </div>
        </form>
    )
}

function Section({ title, icon, children }: any) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-[#1E3A8A] uppercase text-xs tracking-widest">{icon} {title}</div>
            {children}
        </div>
    )
}

function Input({ label, name, register, icon, placeholder, type = "text" }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
                {icon} {label}
            </label>
            <input
                type={type} // Sử dụng type được truyền vào
                {...register(name)}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent focus:bg-white outline-none transition-all text-sm text-slate-900 placeholder:text-slate-500"
            />
        </div>
    )
}