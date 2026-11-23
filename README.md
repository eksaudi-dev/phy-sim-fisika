# PHY-SIM — Interactive Physics Simulation & Assessment Platform

Media pembelajaran interaktif Fisika (serverless SPA): **Arus Bolak-Balik** dan
**Gelombang Elektromagnetik** — 6 simulasi canvas real-time, kuis bertingkat 3 level
per materi, Post-Test Komprehensif 20 soal, refleksi siswa, dan dashboard guru real-time.

Tim: **Group 7** — Eksaudi Elianto Munthe (`4243122001`) · Nazwa Husna Adira (`4242421010`) · Ruth Tamariska Br Munthe (`4243121006`)

## Struktur

```text
phy-sim-fisika/
├── index.html              # Aplikasi Siswa (Login → Hub → Modul AC/GEM → Post-Test)
├── guru.html               # Dashboard Guru (PIN, sakelar sesi, rekap real-time, export CSV)
├── css/style.css           # Desain sistem Brutalist AI (CSS variables)
├── js/
│   ├── firebase-config.js  # ⚠ GANTI kredensial Firebase di sini
│   ├── utils.js            # DOM helpers, Fisher-Yates, KaTeX, toast, modal, loop rAF
│   ├── store.js            # localStorage + antrean offline + Firestore sync
│   ├── app.js              # Router SPA, Learning Hub, modul, asesmen, post-test
│   ├── guru.js             # Dashboard guru (onSnapshot, filter, CSV, reset post-test)
│   ├── data/
│   │   ├── ac-content.js   # Konten Arus Bolak-Balik
│   │   ├── gem-content.js  # Konten Gelombang Elektromagnetik
│   │   └── questions.js    # 30 soal materi (3 level × 2) + 20 soal post-test
│   └── sims/               # 6 simulasi canvas (requestAnimationFrame)
│       ├── frame.js        #   kerangka umum wadah simulasi
│       ├── osiloskop.js    #   1. Osiloskop Virtual AC
│       ├── fasor.js        #   2. Lab Fasor & Rangkaian RLC (4 sub-tab)
│       ├── resonansi.js    #   3. Kurva Resonansi Seri RLC
│       ├── gem3d.js        #   4. Visualisasi GEM 3D
│       ├── spektrum.js     #   5. Eksplorator Spektrum Elektromagnetik
│       └── intensitas.js   #   6. Kalkulator & Visualisasi Intensitas GEM
├── firebase.json           # Hosting config
├── .firebaserc             # ⚠ GANTI project ID
└── firestore.rules         # Aturan keamanan Firestore (sesuai spesifikasi)
```

## Setup Firebase (wajib sebelum deploy)

1. Buat proyek di [Firebase Console](https://console.firebase.google.com) → aktifkan **Cloud Firestore**.
2. Salin konfigurasi web proyek ke `js/firebase-config.js` (ganti seluruh nilai placeholder).
3. Perbarui project ID di `.firebaserc`.
4. (Opsional tapi disarankan untuk produksi) perketat `firestore.rules`.

## Deployment

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # pilih proyekmu
firebase deploy               # hosting + aturan firestore
```

## Dashboard Guru

- Buka `/guru.html`, PIN default **123456** — ganti lewat tombol **⚙ Ganti PIN** (tersimpan dari browser guru) atau ubah `DEFAULT_PIN` di `js/guru.js`.
- Sakelar sesi (`aktif_ac`, `aktif_gem`, `aktif_posttest`) berlaku instan ke semua siswa melalui Firestore real-time.
- Ekspor rekap `.csv` terbuka di Excel/Google Sheets (pemisah `;`, UTF-8 BOM).

## Catatan Teknis

- Modular SDK Firebase v10, KaTeX, GSAP, dan Lenis dimuat via CDN.
- Offline-first: progres ditulis ke `localStorage` dulu; bila pengiriman gagal, payload ditandai `pendingSync` dan dikirim otomatis pada event `online`.
- Anti-kecurangan: pengacakan soal + opsi (Fisher-Yates), penghitung perpindahan tab (`visibilitychange`), pengiriman tunggal (tombol dinonaktifkan saat menyimpan), Post-Test sekali dengan timer 30 menit.
