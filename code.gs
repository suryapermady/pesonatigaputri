
function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById("AKfycbzITPhPB59RE6IEYUyz2jmhgOlDd7B8BXifXuc94_SpXUtgH3y5e86roSD7LTEcZrP-");
    const sheet = ss.getSheetByName("Pesanan");

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.namaPelanggan,
      data.daftarMenu,
      data.rincianPesanan,
      data.totalHarga,
      data.jam,
      data.tanggal
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Pesanan berhasil disimpan"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
