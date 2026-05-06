import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';
import { AppProvider } from "@/components/AppContext"; // Import Provider vừa tạo

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "UHS System - Quản lý văn bằng",
    description: "Hệ thống chuyển đổi và quản lý văn bằng tín chỉ UHS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                {/* Bọc AppProvider toàn bộ giao diện */}
                <AppProvider>
                    <Toaster position="top-right" />

                    {/* Ép nền toàn trang màu xám nhạt sáng */}
                    <div className="flex min-h-screen bg-[#f8fafc]">

                        {/* Sidebar - Luôn màu trắng */}
                        <aside className="w-64 border-r border-slate-200 bg-white hidden md:block fixed h-full z-20">
                            <Sidebar />
                        </aside>

                        <div className="flex-1 flex flex-col md:ml-64">
                            {/* Header - Luôn màu trắng */}
                            <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-10 px-8 flex items-center justify-between">
                                <Navbar />
                            </header>

                            <main className="p-8 flex-1 text-slate-900">
                                {children}
                            </main>
                        </div>
                    </div>
                </AppProvider>
            </body>
        </html>
    );
}