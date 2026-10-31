# SQ Dentist International

Landing page Next.js / React tại `D:\Clone_SQ` với ảnh, logo, font và thông tin SQ Dentist.

## Chạy local

```powershell
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3001
```

Mở http://127.0.0.1:3001/. Kiểm tra bằng `npm run check`.

## Cấu trúc

- `src/app/page.tsx`: route `/`.
- `src/components/sites/sqdentist/SQDentistHome.tsx`: giao diện chính.
- `src/components/sites/sqdentist/`: form, bác sĩ, video và popup.
- `src/app/globals.css`, `src/app/sq-theme.css`: CSS.
- `public/sites/sqdentist/`: ảnh, logo, font, icon, cờ quốc gia và video.
- `src/app/api/contact/route.ts`: API gửi mail.
- `src/lib/`: kiểm tra form, mã quốc gia và điều kiện mở popup.
- `docs/research/sqdentist/`: tài liệu SQ và bằng chứng kiểm tra.

## Form liên hệ

Các form gửi qua Google Workspace SMTP đến `cskh@sqdentist.vn`. Biến SMTP nằm trong `.env.local`, được Git bỏ qua. Khi triển khai, bổ sung các biến SMTP trên hosting. Không đưa mật khẩu vào code hoặc tài liệu.

`scripts/check-consultation.mjs` kiểm tra dữ liệu form; `scripts/check-smtp.mjs` kiểm tra kết nối SMTP.

## Tài nguyên

Video gốc được giữ; giao diện tải bản nhẹ trong `public/sites/sqdentist/videos/web/`. Danh sách video và ảnh bác sĩ nằm trong các component tương ứng.

Khi chuyển source, không cần copy `node_modules/`, `.next/` hoặc `*.tsbuildinfo`. Cài lại thư viện bằng `npm ci`.

## GitHub

Video MP4 gốc trong thư mục videos được giữ trên máy và không đưa vào Git vì dung lượng lớn. Repo chứa các bản videos/web và poster cần để chạy website. File .env.local không được đưa lên GitHub; xem .env.example để cấu hình SMTP trên máy/hosting mới.
