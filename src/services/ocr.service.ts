// src/services/ocr.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ocrService = {
  // 1. Gửi ảnh lên server để đưa vào hàng đợi
  analyze: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_URL}/ocr/analyze`, {
      method: 'POST',
      body: formData, // Trình duyệt tự set Content-Type là multipart/form-data
    });
    
    if (!res.ok) throw new Error('Lỗi khi gửi ảnh lên server');
    return res.json(); // Trả về { jobId, status, message }
  },

  // 2. Lấy trạng thái và kết quả OCR
  getStatus: async (jobId: string) => {
    const res = await fetch(`${API_URL}/ocr/status/${jobId}`);
    if (!res.ok) throw new Error('Lỗi khi kiểm tra trạng thái OCR');
    return res.json(); // Trả về { jobId, status, result, failedReason }
  }
};