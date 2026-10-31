# Menu chung khi tích hợp landing vào website SQ

Landing cần là một route trong ứng dụng SQ, ví dụ `/landing`, giống cách `/doctors` hoạt động. Header dựng trong bản standalone chỉ phục vụ preview. Khi tích hợp, dùng component `NavBar` hiện có của source SQ và tắt header standalone.

Sau khi chuyển component, tài nguyên, CSS có phạm vi riêng và API form vào source SQ, nội dung route `app/landing/page.tsx` gồm:

```tsx
import type { Metadata } from "next";
import { NavBar } from "@/shared/ui/NavBar";
import { SQDentistHome } from "@/components/sites/sqdentist/SQDentistHome";
import "./landing.css";

export const metadata: Metadata = {
  title: "Dental Care in Vietnam",
  alternates: { canonical: "/landing" },
};

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <div className="sq-landing">
        <SQDentistHome showHeader={false} />
      </div>
    </>
  );
}
```

- Đây là cùng component được `DoctorsPage.tsx` sử dụng, nên menu, logo, địa điểm và menu mobile được quản lý tại một nơi.
- `NavBar` nằm ngoài wrapper CSS của landing. Không chép CSS toàn cục của landing đè lên source SQ.
- Source SQ dùng `--font-helvetica`; khi tích hợp CSS, đặt `--font-sq-helvetica: var(--font-helvetica)` trên `.sq-landing` để dùng font đã được layout SQ nạp.
- Các link của NavBar trên trang con theo hành vi của trang doctors: Home về `/`; About Us, Services, Results, Contact Us về các section tương ứng trên trang chủ. Warranty về `/warranty`.
- Landing có footer riêng. Nếu giữ footer này, bỏ qua GlobalSiteFooter tại `/landing` để tránh lặp footer.
- Route này cần được thêm vào source website SQ rồi triển khai website SQ. Đẩy repo standalone lên GitHub không tự thêm route vào sqdentist.com.
- Ví dụ trên mô tả phần ghép menu, không thay thế các bước chuyển tài nguyên, scope CSS, thư viện và API form.

Chưa thay đổi hoặc triển khai source tại D:/source_sq_com.
