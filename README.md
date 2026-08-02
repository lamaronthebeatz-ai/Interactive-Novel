# Linh Truyện

Interactive Novel thuần văn bản, chơi trên trình duyệt. Dự án cá nhân, phát triển dần theo từng Version.

## Công nghệ

- TypeScript (vanilla, không dùng UI framework)
- Vite (dev server + build)
- HTML/CSS
- Nội dung game (địa điểm, NPC, hội thoại) là dữ liệu JSON — engine không hardcode cốt truyện.

## Chạy thử

```bash
npm install
npm run dev       # chạy dev server
npm run build     # build ra thư mục dist/ (deploy lên GitHub Pages)
npm run preview   # xem thử bản build
```

## Cấu trúc thư mục

```
src/
  engine/     # Lõi game: GameEngine, kiểu dữ liệu, thời gian, lưu/tải
  data/       # Nội dung game: địa điểm, NPC, hội thoại (JSON)
  ui/         # Các view render từng màn hình (menu, địa điểm, hội thoại, nhật ký, kho đồ)
  styles/     # CSS
  main.ts     # Điểm khởi động, gắn sự kiện
```

Thêm nội dung mới (địa điểm / NPC / hội thoại): tạo file JSON trong `src/data/`, đăng ký trong `src/data/index.ts`. Không cần sửa engine.

## Version 1 — Hoàn thành

Mục tiêu: có game chơi được.

- Menu chính: Chơi Mới, Tiếp Tục, Tải
- Hệ thống lưu/tải qua `localStorage`
- Một địa điểm đầu tiên (Sân Đình Làng) với hành động khám phá
- Một NPC (Ông Từ) với hội thoại phân nhánh nhiều lựa chọn
- Hệ thống hội thoại + lựa chọn, có hiệu ứng (nhận vật phẩm, ghi nhật ký, thời gian trôi, đặt cờ trạng thái)
- Đồng hồ thời gian trong game (ngày / giờ / buổi)
- Nhật ký sự kiện
- Kho đồ cơ bản
- Giao diện hoàn toàn tiếng Việt, tối ưu cho di động

## Version 2 — Dự kiến

- Thêm địa điểm thứ hai và di chuyển giữa các địa điểm
- Thêm NPC và nhánh hội thoại phụ thuộc vào cờ trạng thái / vật phẩm đã có
- Nhiều slot lưu
- Quest đơn giản (mục tiêu + theo dõi tiến độ)
- Cải thiện giao diện (hiệu ứng chuyển cảnh, chỉ báo hành động mới)
- Cấu hình deploy GitHub Pages
