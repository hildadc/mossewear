# Mossewear — Cardigan & Sweater Kekinian

Static site siap upload ke **GitHub Pages**.

## Struktur Folder
```
mossewear-site/
├─ index.html
├─ assets/
│  ├─ css/
│  │  └─ style.css
│  ├─ js/
│  │  └─ app.js
│  └─ img/
│     ├─ logo.svg
│     ├─ favicon.svg
│     ├─ hero-pattern.svg
│     ├─ product-1.svg ... product-5.svg
```
## Fitur
- Slider produk terlaris (maks 5).
- Tombol **+ Keranjang** dan **Checkout**.
- Keranjang belanja (localStorage) + panel ringkas.
- Testimoni pelanggan + input testimoni (localStorage).
- Form kritik & saran (kirim via WhatsApp).
- Skema warna: biru, rose gold, putih, ivory.
- Alamat toko ditampilkan di footer (bisa diubah di `index.html`).

## Cara Pakai (GitHub Pages)
1. Buat repo baru bernama `mossewear` (atau bebas).
2. Upload semua isi folder `mossewear-site`.
3. Aktifkan Pages di Settings → Pages → Source: `Deploy from a branch` → pilih branch `main` dan folder `/root`.
4. Simpan. Tunggu beberapa menit, situs akan live.

**Catatan:** Ganti nomor WhatsApp tujuan di `assets/js/app.js` pada fungsi `checkout()` dan `handleFeedbackSubmit()`.