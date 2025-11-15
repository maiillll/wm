// Tunggu hingga seluruh halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {

    // 1. Deklarasi Variabel
    const formBarang = document.getElementById('formBarang');
    const listBarang = document.getElementById('listBarang');
    const searchInput = document.getElementById('searchInput'); // <-- VARIABEL BARU

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

    // 5. Fungsi untuk menampilkan semua barang di tabel (DIMODIFIKASI)
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
        e.preventDefault();

        const jenis = document.getElementById('jenisBarang').value;
        const tipe = document.getElementById('tipeBarang').value;
        const harga = document.getElementById('hargaBarang').value;

        const barangBaru = {
            jenis: jenis,
            tipe: tipe,
            harga: Number(harga)
        };

        dbBarang.push(barangBaru);
        simpanDatabase();
        tampilkanBarang(); // Memanggil fungsi yang sudah diperbarui
        formBarang.reset();
    });

    // 7. Event Listener untuk Tombol Hapus (Event Delegation)
    listBarang.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-hapus')) {
            if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
                const index = e.target.dataset.index;
                dbBarang.splice(index, 1);
                simpanDatabase();
                tampilkanBarang(); // Memanggil fungsi yang sudah diperbarui
            }
        }
    });

    // 8. EVENT LISTENER BARU UNTUK PENCARIAN
    // Jalankan fungsi tampilkanBarang setiap kali pengguna mengetik
    searchInput.addEventListener('input', tampilkanBarang);

    // 9. Tampilkan data saat halaman pertama kali dimuat
    tampilkanBarang();
});
