"use client"

import { useForm } from "react-hook-form"
import { api } from "@/services/api"

export default function LoginPage() {
    const { register, handleSubmit } = useForm()

    const onSubmit = async (data: any) => {
        const res = await api.post("/auth/login", data)
        document.cookie = `token=${res.data.access_token}; path=/`
        window.location.href = "/dashboard"
    }

    return (
        <div className="p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input placeholder="Username" {...register("username")} />
                <input type="password" placeholder="Password" {...register("password")} />
                <button className="bg-blue-500 text-white p-2">Login</button>
            </form>
        </div>
    )
}