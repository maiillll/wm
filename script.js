// Tunggu hingga seluruh halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {

    // 1. Deklarasi Variabel
    const formBarang = document.getElementById('formBarang');
    const listBarang = document.getElementById('listBarang');
    const searchInput = document.getElementById('searchInput'); // Variabel untuk pencarian

    // 2. Database (menggunakan Local Storage)
    let dbBarang = JSON.parse(localStorage.getItem('daftarBarang')) || [];

    // 3. Fungsi untuk menyimpan data ke Local Storage
    function simpanDatabase() {
        localStorage.setItem('daftarBarang', JSON.stringify(dbBarang));
    }

    // 4. Fungsi untuk memformat angka menjadi Rupiah
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID').format(angka);
    }

    // 5. Fungsi untuk menampilkan semua barang di tabel (Sudah termasuk filter pencarian)
    function tampilkanBarang() {
        // Kosongkan isi tabel terlebih dahulu
        listBarang.innerHTML = '';

        // Ambil kata kunci pencarian dan ubah ke huruf kecil
        const searchTerm = searchInput.value.toLowerCase();

        // Loop (ulangi) semua data di dbBarang
        dbBarang.forEach((barang, index) => {
            
            const jenis = barang.jenis.toLowerCase();
            const tipe = barang.tipe.toLowerCase();

            // Cek apakah barang cocok dengan pencarian
            if (jenis.includes(searchTerm) || tipe.includes(searchTerm)) {
                
                // Jika cocok, buat baris tabel (tr) baru
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
            }
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

    // 8. EVENT LISTENER UNTUK PENCARIAN
    // Ini adalah kode yang menghubungkan kotak pencarian
    searchInput.addEventListener('input', tampilkanBarang);

    // 9. Tampilkan data saat halaman pertama kali dimuat
    tampilkanBarang();
});
