# PRD: Birthday Minigame Website

**Tanggal:** 2026-07-15
**Target event:** 27 September 2026
**Tujuan:** Website kejutan ulang tahun personal untuk pasangan, berupa pengalaman linear (landing → slideshow ucapan → make a wish → minigame bola hadiah → penutup), dijalankan live bareng di momen ulang tahun.

## 1. Ringkasan

Single-page web app (Next.js) yang memandu pasangan lewat serangkaian halaman/step secara linear, diakhiri dengan minigame membuka bola berisi hadiah. Momen "make a wish" disinkronkan secara live — hanya pemilik HP (kamu) yang bisa melanjutkan ke tahap berikutnya, karena di titik itu kamu akan memberikan hadiah asli secara langsung.

Semua teks/copy di website menggunakan **Bahasa Inggris**. Tidak ada backend, database, atau multi-user — dipakai sekali secara live bersama.

## 2. User flow

```
Landing → Slideshow → Make a Wish → Minigame (Bowl of Balls) → Closing
```

Implementasi sebagai **single-page client-side state machine** (bukan multi-route Next.js), supaya:
- Tombol back browser tidak merusak alur surprise.
- Audio background bisa terus main tanpa remount saat pindah step.

### 2.1 Landing
- Tombol **Play**.
- Teks: `Happy Birthday 25 [Partner Name]`.
- Tombol **Start**.
- Klik Play/Start = user gesture pertama → dipakai juga untuk trigger `audio.play()` (menghindari autoplay block browser).

### 2.2 Slideshow — Birthday Wishes
- Serangkaian slide berisi ucapan ulang tahun, terima kasih, dsb.
- Tiap slide: teks + foto opsional.
- Navigasi Next/Prev (swipe di mobile, tombol di desktop).
- Slide terakhir: tombol **"Continue to make a wish"**.

### 2.3 Make a Wish
- Tampilan cake dengan lilin menyala + instruksi "close your eyes and make a wish".
- **Ini momen live**: kamu memberikan hadiah asli secara langsung di dunia nyata saat pasangan menutup mata.
- Halaman **tidak punya tombol lanjut yang terlihat/normal**. Lanjut ke minigame di-trigger lewat **long-press ±2 detik** di area lilin/cake. Tap biasa tidak melakukan apa-apa.
- Alasan: mencegah pasangan tidak sengaja/```penasaran``` skip ke tahap berikutnya sebelum momen pemberian hadiah selesai. Kontrol sepenuhnya di tangan kamu.

### 2.4 Minigame — Bowl of Balls
- Menampilkan mangkuk berisi 6–9 bola.
- Klik satu bola → animasi bola terbuka → reveal kertas dengan teks di dalamnya.
- Isi bola (data-driven, lihat §3):
  - Mayoritas: "try again", "empty", pesan lucu/menggoda lain.
  - 1 bola: hadiah asli (misal: nama hadiah/clue/pesan spesial).
- Urutan bola vs isi **diacak sekali di awal sesi** (saat komponen mount), lalu tetap konsisten selama sesi berjalan (tidak diacak ulang tiap render).
- Bola yang sudah diklik ditandai "opened" agar tidak bisa diklik ulang untuk animasi yang sama (opsional polish, bukan hard requirement).

### 2.5 Closing
- Teks penutup: "Thank you for playing my minigame", ucapan ulang tahun sekali lagi.

## 3. Content data model

Semua konten yang bisa berubah-ubah (nama, teks, foto, hadiah) disatukan di **satu file config**, terpisah dari komponen UI:

```ts
// content.ts
export const content = {
  partnerName: string,
  age: number,
  audioSrc: string,          // path ke file mp3, taruh di /public
  slides: Array<{
    text: string,
    photoUrl?: string,       // opsional
  }>,
  balls: Array<{
    resultText: string,
    isPrize: boolean,        // true hanya untuk 1 bola
  }>,
}
```

Mengubah wording/foto/hadiah cukup edit file ini, tanpa menyentuh logic komponen.

## 4. Audio

- Background music, file mp3 disiapkan sendiri, ditaruh di `/public`.
- **Tidak autoplay saat page load** — baru `play()` setelah klik tombol Play/Start (user gesture), agar aman dari browser autoplay policy tanpa perlu workaround tambahan.

## 5. Tech stack & deployment

- **Next.js (App Router)**, React, TypeScript.
- Styling & animasi: pakai `frontend-design` skill saat implementasi untuk arahan visual (tema warna, tipografi, animasi) — belum ditentukan detailnya di PRD ini, diputuskan saat desain visual.
- Referensi API/library terbaru saat implementasi: pakai `context7`.
- Tidak ada backend/database. Semua state di client (`useState`/`useReducer` untuk step + hasil acak bola).
- Deploy: **Vercel** (free tier), cocok untuk Next.js tanpa konfigurasi tambahan.

## 6. Hidden control mechanism (detail teknis)

- Implementasi: `onPointerDown` start timer, `onPointerUp`/`onPointerLeave` clear timer sebelum ±2000ms → tidak trigger. Timer selesai tanpa release → trigger `advance()`.
- Tidak perlu backend/multi-device sync — cukup 1 device, 1 gesture rahasia, karena pasangan menutup mata saat momen ini berlangsung.

## 7. Responsive design

- Wajib responsive mobile + desktop (breakpoint standar Tailwind/CSS, detail ditentukan saat implementasi visual).
- Prioritas: pengalaman tetap smooth di HP (kemungkinan besar dibuka lewat link WA di HP), tapi tidak boleh berantakan kalau dibuka di laptop.

## 8. Out of scope

- Tidak ada backend, database, autentikasi, atau multi-user.
- Tidak ada persistence antar sesi — refresh halaman = mulai dari landing lagi (diterima, karena dipakai sekali secara live).
- Tidak ada automated test suite penuh — untuk logic non-trivial (random shuffle bola sekali di awal, long-press timer) cukup 1 sanity check manual/lightweight saat implementasi, bukan test framework penuh (scope proyek personal one-off).

## 9. Open items (diisi user sebelum/selama implementasi)

- Teks final tiap slide slideshow (ucapan, terima kasih, dst).
- Nama pasangan & umur untuk landing page.
- Isi teks tiap bola (mayoritas "try again"/"empty"/lucu, 1 hadiah asli).
- File foto per slide (opsional) & file audio mp3.
- Arahan visual/tema warna (diputuskan bareng saat pakai `frontend-design` skill).
