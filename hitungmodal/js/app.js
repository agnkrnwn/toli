$(document).ready(function () {
    var daftarBarang = [];

    function formatRupiah(angka) {
        var number_string = angka.toString(),
            sisa = number_string.length % 3,
            rupiah = number_string.substr(0, sisa),
            ribuan = number_string.substr(sisa).match(/\d{3}/g);

        if (ribuan) {
            separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        return '' + rupiah;
    }
    function formatRupiah(angka) {
        return angka.toFixed(0).replace(/\d(?=(\d{3})+$)/g, "$&,");
      }

    function updateDaftarBarang() {
        var tableBody = $("#daftarBarang tbody");
        tableBody.empty();

        var totalKeseluruhan = 0;

        for (var i = 0; i < daftarBarang.length; i++) {
            var item = daftarBarang[i];
            var total = item.harga * item.jumlah;
            totalKeseluruhan += total;

            var row = $("<tr>");
            row.append($("<td>").text(item.nama));
            row.append($("<td>").text(formatRupiah(item.harga)));
            row.append($("<td>").text(item.jumlah));
            row.append($("<td>").text(formatRupiah(total)));
            var deleteButton = $("<button class='btn btn-danger btn-sm'><i class='fas fa-trash'></i></button>");
            deleteButton.data("index", i);
            row.append($("<td>").append(deleteButton));
            tableBody.append(row);
        }

        $("#totalKeseluruhan").text(formatRupiah(totalKeseluruhan));
    }

    $("input").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const inputs = $("input");
            const currentIndex = inputs.index(this);

            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            } else {
                // Jika sudah mencapai input terakhir, kembali ke input nama barang
                inputs[0].focus();
            }
        }
    });

    $("#jumlahBarang").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            tambahBarang();
        }
    });

    function tambahBarang() {
        var namaBarang = $("#namaBarang").val();
        var hargaBarang = parseFloat($("#hargaBarang").val());
        var jumlahBarang = parseInt($("#jumlahBarang").val());
    
        if (namaBarang && !isNaN(hargaBarang) && !isNaN(jumlahBarang)) {
            var item = {
                nama: namaBarang,
                harga: hargaBarang,
                jumlah: jumlahBarang,
            };
            daftarBarang.push(item);
            updateDaftarBarang();
            $("#namaBarang").val("");
            $("#hargaBarang").val("");
            $("#jumlahBarang").val("");
        } else {
            alert("Harap isi semua informasi barang dengan benar.");
        }
    }

    $("#tambahBarang").click(tambahBarang);

    

    $("#daftarBarang").on("click", "button", function () {
        var index = $(this).data("index");
        daftarBarang.splice(index, 1);
        updateDaftarBarang();
    });

    $("#bagiDua").click(function () {
        var totalKeseluruhanText = $("#totalKeseluruhan").text();
        var totalKeseluruhan = parseFloat(totalKeseluruhanText.replace(/[^0-9.]+/g, ''));

        console.log('Total Keseluruhan Text:', totalKeseluruhanText);
        console.log('Total Keseluruhan:', totalKeseluruhan);
    
        if (!isNaN(totalKeseluruhan)) {
            var hasilBagi = totalKeseluruhan / 12;
            $("#hasilBagi12").text(formatRupiah(hasilBagi));
        }
    });
    
    

    $("#resetDaftar").click(function () {
        daftarBarang = [];
        updateDaftarBarang();
        
    });

    function getFormattedDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date().toLocaleDateString('id-ID', options);
        return date;
      }

      $("#simpanPDF").click(function () {
        const namaDaftarBarang = $("#namaDaftarBarang").val();
        const totalKeseluruhan = $("#totalKeseluruhan").text();
        const hasilBagi12 = $("#hasilBagi12").text();

        if (daftarBarang.length === 0) {
            alert("Tidak ada barang yang akan disimpan dalam PDF.");
            return;
        }

        const tableData = daftarBarang.map(item => [
            item.nama,
            formatRupiah(item.harga),
            item.jumlah.toString(),
            formatRupiah(item.harga * item.jumlah)
        ]);

        const docDefinition = {
            content: [
                { text: `Modal untuk ${namaDaftarBarang}`, style: "header" },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*'],
                        body: [
                            ['Nama Barang', 'Harga Barang', 'Jumlah', 'Total'],
                            ...tableData
                        ]
                    }
                },
                { text: `Total: ${totalKeseluruhan}`, style: "total" },
                { text: `Modal: ${hasilBagi12}`, style: "total" },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                total: {
                    fontSize: 14,
                    bold: true,
                    alignment: 'right',
                    margin: [0, 10, 0, 0]
                }
            },
            footer: {
                text: `Dibuat pada ${getFormattedDate()}`,
                alignment: 'center',
                fontSize: 10
            }
        };

        pdfMake.createPdf(docDefinition).download(`modal_${namaDaftarBarang}.pdf`);
        alert("PDF berhasil diunduh.");
    });
    
    
});

