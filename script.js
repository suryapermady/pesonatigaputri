
// ==========================================
// BASO PESONA TIGA PUTRI
// SISTEM KASIR DAN PEMESANAN
// ==========================================

// ALAMAT KEDAI
// Ganti alamat di bawah dengan alamat asli kedai.

const alamatKedai =
    "Jl. Contoh Alamat No. 123, Bandung, Jawa Barat";

// DAFTAR MENU DAN HARGA

const menu = [
    { id: 1, nama: "Bakso Urat Biasa", harga: 12000 },
    { id: 2, nama: "Bakso Urat Double", harga: 17000 },
    { id: 3, nama: "Baso Urat + Ceker", harga: 15000 },
    { id: 4, nama: "Baso Urat + Cincang", harga: 15000 },
    { id: 5, nama: "Baso Urat + Babat", harga: 15000 },
    { id: 6, nama: "Baso Urat + Kikil", harga: 15000 },
    { id: 7, nama: "Bakso Isi Cincang", harga: 15000 },
    { id: 8, nama: "Bakso Iga", harga: 20000 },
    { id: 9, nama: "Air Mineral", harga: 5000 },
    { id: 10, nama: "Es Jeruk", harga: 7000 },
    { id: 11, nama: "Juice Mangga", harga: 8000 }
];

// MENYIMPAN PESANAN

let pesanan = {};

// ==========================================
// FORMAT RUPIAH
// ==========================================

function rupiah(angka) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);

}

// ==========================================
// ALAMAT KEDAI
// ==========================================

document.getElementById("alamatKedai").textContent =
    alamatKedai;

// ==========================================
// NOMOR ANTRIAN OTOMATIS
// ==========================================

// Nomor antrean tersimpan di browser

let nomorAntrian = Number(
    localStorage.getItem("nomorAntrian")
) || 1;

// Tampilkan nomor antrean

function tampilkanAntrian() {

    document.getElementById("nomorAntrian").textContent =
        "#" + nomorAntrian;

    localStorage.setItem(
        "nomorAntrian",
        nomorAntrian
    );

}

// Reset nomor antrean

function resetAntrian() {

    const konfirmasi = confirm(
        "Apakah Anda yakin ingin mereset antrean menjadi #1?"
    );

    if (!konfirmasi) return;

    nomorAntrian = 1;

    tampilkanAntrian();

    alert("Nomor antrean berhasil direset!");

}

// ==========================================
// JAM, TANGGAL, BULAN DAN TAHUN OTOMATIS
// ==========================================

function updateWaktu() {

    const sekarang = new Date();

    const jam = sekarang.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    const tanggal = sekarang.toLocaleDateString("id-ID", {
        timeZone: "Asia/Jakarta",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    document.getElementById("jam").textContent =
        jam + " WIB";

    document.getElementById("tanggal").textContent =
        tanggal;

}

// Jalankan jam setiap detik

updateWaktu();

setInterval(updateWaktu, 1000);

// ==========================================
// MENAMPILKAN DAFTAR MENU
// ==========================================

function tampilkanMenu() {

    const daftarMenu =
        document.getElementById("daftarMenu");

    daftarMenu.innerHTML = "";

    menu.forEach(item => {

        const jumlah = pesanan[item.id] || 0;

        daftarMenu.innerHTML += `

            <div class="menu-item">

                <div class="menu-info">

                    <h3>${item.nama}</h3>

                    <p>${rupiah(item.harga)}</p>

                </div>

                <div class="jumlah">

                    <button
                        onclick="ubahJumlah(${item.id}, -1)">
                        −
                    </button>

                    <span>${jumlah}</span>

                    <button
                        onclick="ubahJumlah(${item.id}, 1)">
                        +
                    </button>

                </div>

            </div>

        `;

    });

}

// ==========================================
// TAMBAH DAN KURANG JUMLAH PESANAN
// ==========================================

function ubahJumlah(id, perubahan) {

    const jumlahSekarang = pesanan[id] || 0;

    const jumlahBaru = jumlahSekarang + perubahan;

    if (jumlahBaru < 0) return;

    if (jumlahBaru === 0) {

        delete pesanan[id];

    } else {

        pesanan[id] = jumlahBaru;

    }

    tampilkanMenu();

    hitungTotal();

}

// ==========================================
// MENGHITUNG TOTAL HARGA OTOMATIS
// ==========================================

function hitungTotal() {

    const rincian =
        document.getElementById("rincianPesanan");

    let total = 0;

    let html = "";

    menu.forEach(item => {

        const jumlah = pesanan[item.id] || 0;

        if (jumlah > 0) {

            const subtotal = jumlah * item.harga;

            total += subtotal;

            html += `

                <div class="rincian-item">

                    <div>

                        <strong>${item.nama}</strong>

                        <small>
                            ${jumlah} x ${rupiah(item.harga)}
                        </small>

                    </div>

                    <strong>
                        ${rupiah(subtotal)}
                    </strong>

                </div>

            `;

        }

    });

    rincian.innerHTML = html ||
        '<p class="kosong">Belum ada pesanan.</p>';

    document.getElementById("totalHarga").textContent =
        rupiah(total);

    return total;

}

// ==========================================
// RESET PESANAN
// ==========================================

function resetPesanan() {

    const konfirmasi = confirm(
        "Yakin ingin menghapus semua pesanan?"
    );

    if (!konfirmasi) return;

    pesanan = {};

    document.getElementById("namaPelanggan").value = "";

    tampilkanMenu();

    hitungTotal();

}

// ==========================================
// CETAK STRUK PEMBAYARAN
// ==========================================

function cetakStruk() {

    const nama = document.getElementById("namaPelanggan")
        .value.trim();

    const total = hitungTotal();

    if (!nama) {

        alert("Silakan masukkan nama pelanggan!");

        return;

    }

    if (total === 0) {

        alert("Silakan pilih menu terlebih dahulu!");

        return;

    }

    const sekarang = new Date();

    const tanggal = sekarang.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        dateStyle: "full",
        timeStyle: "medium"
    });

    // Mengamankan nama pelanggan

    const aman = teks => teks.replace(/[&<>"']/g, karakter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[karakter]);

    let isiStruk = "";

    menu.forEach(item => {

        const jumlah = pesanan[item.id] || 0;

        if (jumlah > 0) {

            isiStruk += `

                <div class="item">

                    <span>
                        ${item.nama} (${jumlah}x)
                    </span>

                    <span>
                        ${rupiah(jumlah * item.harga)}
                    </span>

                </div>

            `;

        }

    });

    const antrianSaatIni = nomorAntrian;

    const jendela = window.open(
        "",
        "_blank",
        "width=450,height=700"
    );

    if (!jendela) {

        alert("Izinkan pop-up browser untuk mencetak struk.");

        return;

    }

    jendela.document.write(`

        <!DOCTYPE html>

        <html lang="id">

        <head>

            <meta charset="UTF-8">

            <title>Struk Pembayaran</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }

                h2, p {
                    text-align: center;
                }

                .antrian {
                    text-align: center;
                    font-size: 30px;
                    font-weight: bold;
                    color: #a00000;
                    margin: 15px;
                }

                .alamat {
                    font-size: 12px;
                    text-align: center;
                }

                .item {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    margin: 12px 0;
                }

                .total {
                    border-top: 1px dashed black;
                    padding-top: 15px;
                    font-weight: bold;
                }

            </style>

        </head>

        <body>

            <h2>BASO PESONA TIGA PUTRI</h2>

            <p>Lezat Rasanya, Istimewa Nikmatnya</p>

            <p class="alamat">
                ${alamatKedai}
            </p>

            <hr>

            <div class="antrian">
                ANTRIAN #${antrianSaatIni}
            </div>

            <p>Nama Pelanggan: ${aman(nama)}</p>

            <p>${tanggal} WIB</p>

            <hr>

            ${isiStruk}

            <div class="total">

                <h2>TOTAL: ${rupiah(total)}</h2>

            </div>

            <p>Terima kasih telah berbelanja ❤️</p>

            <script>

                window.onload = function() {
                    window.print();
                };

            <\/script>

        </body>

        </html>

    `);

    jendela.document.close();

    // Naikkan antrean setelah jendela struk berhasil dibuka

    nomorAntrian++;

    tampilkanAntrian();

    // Kosongkan pesanan untuk pelanggan berikutnya

    pesanan = {};

    document.getElementById("namaPelanggan").value = "";

    tampilkanMenu();

    hitungTotal();

}

// ==========================================
// JALANKAN WEBSITE
// ==========================================

tampilkanAntrian();

tampilkanMenu();

hitungTotal();
