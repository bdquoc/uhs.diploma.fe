// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Chuyển hướng ngay lập tức để không thấy màn hình "To get started..."
  redirect("/dashboard");
}