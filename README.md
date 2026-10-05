# 🎓 UHS Diploma Frontend

> **`uhs.diploma.fe`** – Giao diện người dùng (Frontend) cho **Hệ thống Quản lý & Tra cứu Văn bằng Tốt nghiệp**
> **Trường Đại học Khoa học Sức khỏe – Đại học Quốc gia TP.HCM (UHS - VNUHCM)**

---

## 📌 Giới thiệu

**UHS Diploma Frontend (`uhs.diploma.fe`)** là dự án giao diện người dùng thuộc **Hệ thống Quản lý và Tra cứu Văn bằng Tốt nghiệp** cho Trường Đại học Khoa học Sức khỏe – ĐHQG-HCM.

Hệ thống hỗ trợ:

* 🔍 Tra cứu và xác minh thông tin văn bằng, chứng chỉ.
* 👨‍🎓 Quản lý thông tin sinh viên tốt nghiệp.
* 📜 Quản lý và cấp phát văn bằng điện tử.
* 🛡️ Xác thực tính hợp lệ của văn bằng/chứng chỉ.
* 👥 Phân quyền người dùng theo từng vai trò.
* 📱 Hỗ trợ giao diện Responsive trên nhiều thiết bị.

---

## 🚀 Tech Stack

### Core

| Công nghệ                          | Mô tả              |
| ---------------------------------- | ------------------ |
| **React.js / Next.js**             | Frontend Framework |
| **TypeScript / JavaScript (ES6+)** | Ngôn ngữ lập trình |
| **Vite / Webpack**                 | Build Tool         |

### UI & Styling

| Công nghệ        | Mục đích                    |
| ---------------- | --------------------------- |
| **Tailwind CSS** | Utility-first CSS Framework |
| **Ant Design**   | UI Component Library        |
| **Material UI**  | UI Component Library        |

### State Management & Data

| Công nghệ         | Mục đích                      |
| ----------------- | ----------------------------- |
| **Redux Toolkit** | Quản lý Global State          |
| **React Query**   | Server State & API Data       |
| **Context API**   | Quản lý Context               |
| **Axios**         | HTTP Client & API Integration |

---

## ✨ Tính năng chính

### 🔍 Tra cứu văn bằng

Cho phép người dùng tìm kiếm và xác minh thông tin văn bằng dựa trên:

* Mã tra cứu.
* Số hiệu văn bằng.
* Thông tin liên quan đến văn bằng/chứng chỉ.

### 👨‍🎓 Cổng thông tin Sinh viên

Sinh viên có thể:

* Xem thông tin cá nhân.
* Xem danh sách văn bằng.
* Xem chứng chỉ đã hoàn thành.
* Tra cứu thông tin quá trình tốt nghiệp.

### 🛡️ Admin Dashboard

Hệ thống quản trị hỗ trợ:

* Quản lý văn bằng/chứng chỉ.
* Quản lý danh sách sinh viên tốt nghiệp.
* Phê duyệt văn bằng.
* Cấp phát văn bằng điện tử.
* Quản lý và phân quyền người dùng.

### 👥 Phân quyền

Hệ thống hỗ trợ các vai trò:

* **Admin**
* **Trợ lý đào tạo**
* **Sinh viên**
* **Khách**

### 📱 Responsive Design

Giao diện được tối ưu để hoạt động trên nhiều kích thước màn hình:

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

---

## 📂 Cấu trúc thư mục

```text
uhs.diploma.fe/
├── public/                  # Static assets: favicon, logo, images...
├── src/
│   ├── assets/              # Images, fonts, icons
│   ├── components/          # Reusable UI components
│   ├── config/              # Project configuration
│   │   ├── axios
│   │   ├── constants
│   │   └── routes
│   ├── hooks/               # Custom React Hooks
│   ├── layouts/             # Admin, User, Guest layouts
│   ├── pages/               # Application pages
│   ├── services/            # API services
│   ├── store/               # Redux / Context state
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
│
├── App.tsx                  # Root component
├── main.tsx                 # Application entry point
│
├── .env.example             # Environment variables template
├── .gitignore               # Git ignored files
├── package.json             # Dependencies & scripts
└── README.md                # Project documentation
```

---

## 🛠️ Cài đặt & Chạy Local

### 📋 Yêu cầu hệ thống

Đảm bảo máy tính đã cài đặt:

* **Node.js** `>= 18.x`
* **npm** `>= 9.x`

Hoặc có thể sử dụng **Yarn / pnpm**.

---

### 1️⃣ Clone repository

```bash
git clone https://github.com/bdquoc/uhs.diploma.fe.git
cd uhs.diploma.fe
```

---

### 2️⃣ Cài đặt dependencies

Sử dụng npm:

```bash
npm install
```

Hoặc Yarn:

```bash
yarn install
```

---

### 3️⃣ Cấu hình Environment Variables

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Sau đó cập nhật các biến môi trường tương ứng với môi trường Backend.

Ví dụ:

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Lưu ý:** Không commit các file chứa thông tin nhạy cảm như `.env`, `.env.local` lên GitHub.

---

### 4️⃣ Chạy Development Server

Sử dụng npm:

```bash
npm run dev
```

Hoặc Yarn:

```bash
yarn dev
```

Sau khi chạy thành công, ứng dụng sẽ có thể được truy cập tại:

```text
http://localhost:5173
```

> Tùy thuộc vào cấu hình project, ứng dụng có thể chạy tại `http://localhost:3000`.

---

## 📜 Available Scripts

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Chạy ứng dụng ở môi trường Development     |
| `npm run build`   | Build ứng dụng cho Production              |
| `npm run preview` | Preview Production Build                   |
| `npm run lint`    | Kiểm tra và phân tích mã nguồn bằng ESLint |

---

## 🔄 Development Workflow

Quy trình phát triển đề xuất:

```bash
# 1. Tạo feature branch
git checkout -b feature/AmazingFeature

# 2. Kiểm tra thay đổi
git status

# 3. Add changes
git add .

# 4. Commit
git commit -m "Add some AmazingFeature"

# 5. Push branch
git push origin feature/AmazingFeature
```

Sau đó tạo **Pull Request** trên GitHub để review và merge vào branch chính.

---

## 🤝 Contribution

Nếu muốn đóng góp cho dự án:

1. **Fork** repository.
2. Tạo một branch mới cho feature hoặc bug fix.
3. Thực hiện thay đổi và commit.
4. Push branch lên repository.
5. Tạo **Pull Request**.

---

## 👤 Author & Development Team

**UHS Diploma Team / bdquoc**

**Đơn vị:**
Trường Đại học Khoa học Sức khỏe – Đại học Quốc gia TP.HCM

**Repository:**
[github.com/bdquoc/uhs.diploma.fe](https://github.com/bdquoc/uhs.diploma.fe?utm_source=chatgpt.com)

---

## 📄 License

This project is developed for educational and institutional purposes.
