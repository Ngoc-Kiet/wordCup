# 🚀 Hướng dẫn chạy WC2026 Bet Server

## Cấu trúc Project
```
webDa/
├── server.js       ← Backend API (Pure Node.js, 0 dependencies)
├── api.js          ← Frontend API helper
├── app.js          ← User page logic
├── admin.js        ← Admin page logic
├── data.js         ← World Cup 2026 data
├── index.html      ← Trang người dùng
├── admin.html      ← Trang admin
├── styles.css      ← Giao diện
├── db.json         ← Database (tự tạo khi chạy)
└── .gitignore
```

## Cách chạy

### 1. Chạy trên máy local
```bash
cd /Users/minhnguyenngocanh/Desktop/webDa
node server.js
```

> **Nếu bị lỗi EPERM**, mở **System Settings → Privacy & Security → App Management** hoặc chạy:
> ```bash
> sudo node server.js
> ```

Sau khi server chạy:
- 🌐 Trang người dùng: `http://localhost:3000`
- ⚙️ Trang admin: `http://localhost:3000/admin.html`

### 2. Cho mọi người truy cập (cùng mạng WiFi)
Tìm IP máy bạn:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Mọi người truy cập: `http://<IP-máy-bạn>:3000`

### 3. Deploy online (miễn phí)

#### Render.com (khuyến nghị)
1. Push code lên GitHub
2. Vào [render.com](https://render.com) → New Web Service
3. Kết nối GitHub repo
4. Build Command: (leave empty)
5. Start Command: `node server.js`
6. Free tier → Deploy

#### Railway.app
1. Vào [railway.app](https://railway.app) → New Project
2. Deploy from GitHub
3. Tự động detect Node.js

## Thông tin đăng nhập Admin
- URL: `/admin.html`
- Username: `admin`
- Password: `123456`

## Tính năng chia sẻ dữ liệu
✅ Mọi người thấy cùng tỷ lệ cược (admin chỉnh 1 lần)
✅ BXH chung tất cả người chơi
✅ Admin xem được cược của tất cả mọi người
✅ Mỗi người có tài khoản riêng (nhập tên lần đầu)
