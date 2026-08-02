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

## Lore

```
lore/
  chuong-1-the-gioi.md   # World Bible: lục địa, quốc gia, địa hình, chính trị, thương mại
```

Tài liệu nền móng thế giới — địa lý, chính trị, kinh tế của Đại Lục Viễn Nguyên. Đây là nền tảng để xây
dựng cốt truyện và nội dung game sau này, bản thân nó không chứa cốt truyện, nhân vật chính, hay quest.

## Version 1 — Hoàn thành (engine)

Mục tiêu: có game chơi được, engine hoàn chỉnh và tách biệt khỏi nội dung.

- Menu chính: Chơi Mới, Tiếp Tục, Tải
- Hệ thống lưu/tải qua `localStorage`
- Hệ thống hội thoại + lựa chọn, có hiệu ứng (nhận vật phẩm, ghi nhật ký, thời gian trôi, đặt cờ trạng thái)
- Đồng hồ thời gian trong game (ngày / giờ / buổi)
- Nhật ký sự kiện
- Kho đồ cơ bản
- Giao diện hoàn toàn tiếng Việt, tối ưu cho di động

Dữ liệu nội dung thử nghiệm (địa điểm/NPC/hội thoại demo) đã được gỡ bỏ để nhường chỗ cho nội dung chính
thức xây dựng trên nền World Bible — hiện `src/data/` đang trống, engine hiển thị màn hình chờ khi chưa
có địa điểm nào.

## Tiếp theo

- Chuyển hóa nội dung từ World Bible thành dữ liệu địa điểm/NPC/hội thoại thật trong `src/data/`
- Thêm địa điểm thứ hai và di chuyển giữa các địa điểm
- Nhiều slot lưu
- Quest đơn giản (mục tiêu + theo dõi tiến độ)
- Cải thiện giao diện (hiệu ứng chuyển cảnh, chỉ báo hành động mới)
