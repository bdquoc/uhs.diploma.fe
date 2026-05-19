import { Diploma } from '@/types/diploma';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const diplomaService = {
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/diplomas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi khi tạo hồ sơ');
    }
    return res.json();
  },

  getAll: async () => {
    const res = await fetch(`${API_URL}/diplomas`);
    if (!res.ok) throw new Error('Lỗi tải danh sách');
    return res.json();
  },

  approve: async (id: string) => {
    const res = await fetch(`${API_URL}/diplomas/${id}/approve`, {
      method: 'POST', // Theo API hiện tại của bạn là POST
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  

  getApproved: async () => {
    const res = await fetch(`${API_URL}/diplomas/approved`);
    if (!res.ok) throw new Error('Lỗi tải danh sách đã duyệt');
    return res.json();
  },

  getPending: async () => {
    const res = await fetch(`${API_URL}/diplomas/pending`);
    if (!res.ok) throw new Error('Lỗi tải danh sách chờ duyệt');
    return res.json();
  },

  // THÊM MỚI: Khai báo hàm lấy danh sách hồ sơ bị từ chối
  getRejected: async () => {
    const res = await fetch(`${API_URL}/diplomas/rejected`);
    if (!res.ok) throw new Error('Lỗi tải danh sách hồ sơ bị từ chối');
    
    const result = await res.json();
    // Kiểm tra và giải nén tầng dữ liệu nếu Backend trả về cấu trúc phân trang { data: { data: [...] } }
    if (result && result.data && Array.isArray(result.data.data)) {
      return {
        data: result.data.data,
        meta: result.data.meta || result.meta
      };
    }
    return result;
  },

  search: async (keyword: string) => {
    const res = await fetch(`${API_URL}/diplomas/search?keyword=${encodeURIComponent(keyword)}`);
    
    if (!res.ok) {
      throw new Error('Lỗi khi tìm kiếm văn bằng');
    }
    
    const result = await res.json();

    // Đối chiếu cấu trúc: Nếu có result.data.data (bị bọc 2 lần) thì giải nén bớt 1 tầng data
    if (result && result.data && Array.isArray(result.data.data)) {
      return {
        data: result.data.data, // Đưa mảng lên tầng 1 để cấu trúc đồng bộ với getPending()
        meta: result.data.meta || result.meta,
        error: result.data.error || result.error
      };
    }

    return result;
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/diplomas/${id}`);
    if (!res.ok) throw new Error('Lỗi tải thông tin chi tiết văn bằng');
    return res.json();
  },

  
  update: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/diplomas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi cập nhật văn bằng');
    }
    return res.json();
  },

  reject: async (id: string, reason: string) => {
    const res = await fetch(`${API_URL}/diplomas/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi từ chối hồ sơ');
    }
    return res.json();
  }
};