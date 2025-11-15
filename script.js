// Tunggu hingga seluruh halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {

    // 1. Deklarasi Variabel
    const formBarang = document.getElementById('formBarang');
    const listBarang = document.getElementById('listBarang');

    // 2. Database (menggunakan Local Storage)
    // Cek apakah ada data di Local Storage, jika tidak, mulai dengan array kosong
    let dbBarang = JSON.parse(localStorage.getItem('daftarBarang')) || [];

    // 3. Fungsi untuk menyimpan data ke Local Storage
    function simpanDatabase() {
        localStorage.setItem('daftarBarang', JSON.stringify(dbBarang));
    }

    // 4. Fungsi untuk memformat angka menjadi Rupiah
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID').format(angka);
    }

    // 5. Fungsi untuk menampilkan semua barang di tabel
    function tampilkanBarang() {
        // Kosongkan isi tabel terlebih dahulu
        listBarang.innerHTML = '';

        // Loop (ulangi) semua data di dbBarang
        dbBarang.forEach((barang, index) => {
            // Buat baris tabel (tr) baru
            const tr = document.createElement('tr');
            
            // Isi baris dengan data barang
            tr.innerHTML = `
                <td>${barang.jenis}</td>
                <td>${barang.tipe}</td>
                <td>${formatRupiah(barang.harga)}</td>
                <td>
                    <button class="btn-hapus" data-index="${index}">Hapus</button>
                </td>
            `;
            
            // Tambahkan baris baru ke dalam tabel
            listBarang.appendChild(tr);
        });
    }

    // 6. Event Listener untuk Form (Saat tombol "Simpan Barang" diklik)
    formBarang.addEventListener('submit', function(e) {
        // Hentikan aksi default form (yang akan me-refresh halaman)
        e.preventDefault();

        // Ambil nilai dari input
        const jenis = document.getElementById('jenisBarang').value;
        const tipe = document.getElementById('tipeBarang').value;
        const harga = document.getElementById('hargaBarang').value;

        // Buat objek barang baru
        const barangBaru = {
            jenis: jenis,
            tipe: tipe,
            harga: Number(harga) // Ubah harga menjadi angka
        };

        // Masukkan barang baru ke array database kita
        dbBarang.push(barangBaru);

        // Simpan database ke Local Storage
        simpanDatabase();

        // Tampilkan ulang data di tabel
        tampilkanBarang();

        // Kosongkan formulir setelah data disimpan
        formBarang.reset();
    });

    // 7. Event Listener untuk Tombol Hapus (Event Delegation)
    // Kita pasang listener di 'listBarang' (tabel body) untuk mendeteksi klik
    listBarang.addEventListener('click', function(e) {
        // Cek apakah yang diklik adalah tombol dengan class 'btn-hapus'
        if (e.target.classList.contains('btn-hapus')) {
            // Konfirmasi sebelum menghapus
            if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
                // Ambil index barang yang mau dihapus dari atribut 'data-index'
                const index = e.target.dataset.index;
                
                // Hapus barang dari array dbBarang
                dbBarang.splice(index, 1);

                // Simpan ulang database ke Local Storage
                simpanDatabase();

                // Tampilkan ulang data di tabel
                tampilkanBarang();
            }
        }
    });

    // 8. Tampilkan data saat halaman pertama kali dimuat
    tampilkanBarang();
});
