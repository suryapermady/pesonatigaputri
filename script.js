
// =====================================
// BASO PESONA TIGA PUTRI
// SISTEM PEMESANAN OTOMATIS
// =====================================

// DAFTAR MENU DAN HARGA

const menu = [
    { id: 1, nama: "Baso Biasa", harga: 10000 },
    { id: 2, nama: "Baso Urat", harga: 15000 },
    { id: 3, nama: "Baso Telur", harga: 15000 },
    { id: 4, nama: "Baso Jumbo", harga: 20000 },
    { id: 5, nama: "Baso Beranak", harga: 25000 },
    { id: 6, nama: "Baso Mercon", harga: 20000 },
    { id: 7, nama: "Mie Ayam", harga: 12000 },
    { id: 8, nama: "Mie Ayam Bakso", harga: 17000 },
    { id: 9, nama: "Es Teh", harga: 5000 },
    { id: 10, nama: "Es Jeruk", harga: 7000 },
    { id: 11, nama: "Air Mineral", harga: 4000 }
];

// MENYIMPAN DATA PESANAN

let pesanan = {};

// FORMAT RUPIAH

function rupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

// =====================================
// JAM, TANGGAL, BULAN DAN TAHUN OTOMATIS
// =====================================

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

// UPDATE SETIAP DETIK

updateWaktu();

setInterval(updateWaktu, 1000);


// =====================================
// MENAMPILKAN DAFTAR MENU
// =====================================

function tampilkanMenu() {

    const daftarMenu = document.getElementById("daftarMenu");

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

                    <button onclick="ubahJumlah(${item.id}, -1)">
                        −
                    </button>

                    <span>${jumlah}</span>

                    <button onclick="ubahJumlah(${item.id}, 1)">
                        +
                    </button>

                </div>

            </div>

        `;
    });
}


// =====================================
// TAMBAH DAN KURANG PESANAN
// =====================================

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


// =====================================
// HITUNG TOTAL HARGA OTOMATIS
// =====================================

function hitungTotal() {

    const rincian = document.getElementById("rincianPesanan");

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


// =====================================
// RESET PESANAN
// =====================================

function resetPesanan() {

    if (!confirm("Yakin ingin menghapus semua pesanan?")) {
        return;
    }

    pesanan = {};

    document.getElementById("namaPelanggan").value = "";

    tampilkanMenu();

    hitungTotal();
}


// =====================================
// CETAK STRUK PEMBAYARAN
// =====================================

function cetakStruk() {

    const nama = document.getElementById("namaPelanggan")
        .value.trim();

    const total = hitungTotal();

    if (!nama) {
        alert("Masukkan nama pelanggan terlebih dahulu!");
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

    const jendela = window.open(
        "",
        "_blank",
        "width=450,height=650"
    );

    if (!jendela) {
        alert("Izinkan pop-up untuk mencetak struk.");
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
                    font-family: Arial;
                    padding: 20px;
                }

                h2, p {
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

            <hr>

            <p>Nama: ${aman(nama)}</p>

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
}


// =====================================
// MENJALANKAN PROGRAM
// =====================================

tampilkanMenu();

hitungTotal();
