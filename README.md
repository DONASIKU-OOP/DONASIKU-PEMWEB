 Laporan Kemajuan Fitur - Donasiku
 Nauval Yusriya Athalla

Dokumen ini merangkum pekerjaan yang telah selesai (Done) dan rencana kerja selanjutnya (To-Do) untuk fitur-fitur utama yang telah saya kerjakan.

1. Login dan Registrasi (Auth)

Selesai Dikerjakan (Done)

Pembuatan Halaman:

File src/features/auth/Login.jsx telah dibuat.

File src/features/auth/Register.jsx telah dibuat.

Logika Inti:

Kedua halaman terhubung dengan authService.js untuk memproses pendaftaran dan login pengguna.

Data pengguna (termasuk role) disimpan di localStorage (melalui users_db dan user).

Fungsionalitas:

Pengguna dapat memilih role (Donatur atau Penerima) saat mendaftar.

Halaman Login memverifikasi role yang dipilih pengguna saat login.

Perbaikan Bug & UI:

[BUG FIX] Halaman Register dan Login yang tertutup oleh navbar publik telah diperbaiki dengan menambahkan padding atas (pt-40).

[REVISI UI] Halaman Login telah didesain ulang agar konsisten dengan tampilan halaman Register (menghilangkan header biru pada kartu).

[UI/UX] Menambahkan animasi fade-in dan interaksi focus pada input field di kedua halaman.

Rencana Selanjutnya (To-Do)

[SELESAI] Fitur ini secara fungsional sudah lengkap sesuai dengan dokumen spesifikasi.

(Opsional) Implementasi fitur "Lupa Password" (jika diperlukan di masa depan).

2. Dashboard Penerima

Selesai Dikerjakan (Done)

Pembuatan Halaman:

File src/features/penerima/DashboardPenerima.jsx telah dibuat.

Routing & Layout:

[BUG FIX] Rute /dashboard-penerima telah dipindahkan ke dalam DashboardLayout di App.jsx. Ini memperbaiki bug di mana sidebar dan topbar (termasuk tombol logout/profil) tidak muncul.

DashboardSidebar.jsx telah berhasil dimodifikasi menjadi dinamis, sehingga menampilkan menu yang benar (Cari Donasi, Permintaan Saya, dll.) saat login sebagai Penerima.

Fungsionalitas Inti:

Halaman berhasil memuat data donasi dari getAllDonasi().

[BUG FIX] Logika localStorage di semua file Donatur (FormDonasi, EditDonasi, DashboardDonatur) telah diperbaiki (dari 'donations'/'donaasi' menjadi 'donasi'). Ini adalah perbaikan kritis yang memungkinkan data donasi muncul di dasbor ini.

Data yang ditampilkan sudah benar, yaitu hanya donasi dengan status "aktif".

UI (Sesuai Desain):

Tampilan header biru, search bar, dan filter kategori telah diimplementasikan.

Grid untuk menampilkan kartu-kartu donasi (lengkap dengan foto, nama, kategori, dll.) sudah siap.

Rencana Selanjutnya (To-Do)

Implementasi "Permintaan Barang" (Langkah 3 & 4 dari Rencana):

Membuat halaman DetailDonasi.jsx. Saat ini, tombol "Lihat Detail & Ajukan" belum berfungsi.

Membuat service baru requestService.js untuk mengelola data permintaan.

Menambah fungsi baru di localStorage.js untuk menyimpan data 'requests'.

Mengimplementasikan logika tombol "Kirim Permintaan Donasi" di halaman detail.

Implementasi "Permintaan Saya" (Langkah 5):

Membuat halaman PermintaanSaya.jsx (rute /penerima/permintaan-saya) untuk melacak status permintaan (pending, approved, completed).

Integrasi dengan Donatur (Langkah 6 & 7):

Memodifikasi DashboardDonatur.jsx untuk menampilkan "Permintaan Masuk".

Menambahkan tombol "Setujui" / "Tolak" untuk Donatur.

Menambahkan tombol "Konfirmasi Barang Diterima" untuk Penerima di halaman PermintaanSaya.jsx.

3. Riwayat / Cek Status

Selesai Dikerjakan (Done)

Pembuatan Halaman:

File src/features/riwayat/Riwayat.jsx telah dibuat di lokasi yang benar.

Routing:

[BUG FIX] Rute /donatur/riwayat dan /penerima/riwayat telah ditambahkan dengan benar ke App.jsx di dalam DashboardLayout, memperbaiki error "404 Halaman Tidak Ditemukan".

Logika Awal:

Halaman ini sudah bisa mendeteksi role pengguna (Donatur atau Penerima).

Untuk Donatur: Logika untuk mengambil dan menampilkan donasi yang berstatus "selesai" sudah diimplementasikan.

Untuk Penerima: Menampilkan pesan "Fitur Dalam Pengembangan" (sesuai rencana).
