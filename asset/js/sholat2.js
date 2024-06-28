$(document).ready(function () {
    var urlKota = "https://api.myquran.com/v2/sholat/kota/semua";
    var urlJadwal = "https://api.myquran.com/v2/sholat/jadwal/";
    var jakartaId = "1301"; // ID untuk Jakarta

    console.log("Memuat daftar kota...");
    // Load Kota
    $.getJSON(urlKota, function(data) {
        console.log("Respons API kota:", data);
        if (data.status) {
            var items = [{ id: '', text: '- Pilih Kota -' }];
            $.each(data.data, function(key, val) {
                items.push({ id: val.id, text: val.lokasi });
            });
            $("#select-kota").select2({
                data: items,
                theme: "classic",
                width: '100%',
                dropdownParent: $('#select-kota').parent()
            });
            console.log("Daftar kota berhasil dimuat.");
            
            // Set Jakarta as default
            $("#select-kota").val(jakartaId).trigger('change');
            getSchedule(jakartaId, "Jakarta");
        } else {
            $("#errorMsg").text("Gagal memuat daftar kota.").removeClass('hidden');
            console.error("Gagal memuat daftar kota:", data);
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error saat memuat daftar kota:", textStatus, errorThrown);
        $("#errorMsg").text("Gagal memuat daftar kota: " + textStatus).removeClass('hidden');
    });

    // Event handler untuk tombol "Tampilkan Jadwal"
    $("#getSchedule").on("click", function () {
        var kotaId = $("#select-kota").val();
        var kota = $("#select-kota").select2('data')[0].text;
        getSchedule(kotaId, kota);
    });

    function getSchedule(kotaId, kota) {
        console.log("Kota yang dipilih:", kota, "dengan ID:", kotaId);

        if (kotaId) {
            var today = new Date();
            var yyyy = today.getFullYear();
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var dd = String(today.getDate()).padStart(2, '0');

            var url = urlJadwal + kotaId + "/" + yyyy + "/" + mm + "/" + dd;
            console.log("URL jadwal sholat:", url);

            $.ajax({
                url: url,
                method: "GET",
                success: function (response) {
                    console.log("Respons API jadwal sholat:", response);

                    if (response.status) {
                        displaySchedule(kota, response.data.jadwal);
                    } else {
                        $("#schedule").addClass('hidden');
                        $("#errorMsg").text("Data jadwal sholat tidak tersedia.").removeClass('hidden');
                        console.error("Data jadwal sholat tidak tersedia:", response);
                    }
                },
                error: function (xhr, status, error) {
                    $("#schedule").addClass('hidden');
                    $("#errorMsg").text("Terjadi kesalahan dalam mengambil data: " + error).removeClass('hidden');
                    console.error("Error saat mengambil jadwal sholat:", status, error);
                    console.log("XHR object:", xhr);
                },
            });
        } else {
            $("#errorMsg").text("Pilih kota terlebih dahulu.").removeClass('hidden');
            console.warn("Kota belum dipilih");
        }
    }

    var countdownInterval;

    function displaySchedule(city, data) {
        console.log("Menampilkan jadwal untuk kota:", city, "dengan data:", data);
        
        var now = new Date();
        var gregorianDate = now.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        
        // Menambahkan tanggal Hijriah
        var hijriDate = new Intl.DateTimeFormat('id-u-ca-islamic', {day: 'numeric', month: 'long', year: 'numeric'}).format(now);
        
        $("#location").text(city);
        $("#dates").html(gregorianDate + "<br>" + hijriDate);
        $("#subuh").text(data.subuh);
        $("#dzuhur").text(data.dzuhur);
        $("#ashar").text(data.ashar);
        $("#maghrib").text(data.maghrib);
        $("#isya").text(data.isya);
        $("#imsak").text(data.imsak);
        $("#terbit").text(data.terbit);
        
        $("#schedule").removeClass('hidden');
        $("#errorMsg").addClass('hidden');

        // Hentikan interval sebelumnya jika ada
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        // Memulai countdown baru
        startCountdown(data);
    }

    function startCountdown(scheduleData) {
        function updateCountdown() {
            var now = new Date();
            var prayerTimes = [
                {name: "Imsak", time: scheduleData.imsak},
                {name: "Subuh", time: scheduleData.subuh},
                {name: "Terbit", time: scheduleData.terbit},
                {name: "Dzuhur", time: scheduleData.dzuhur},
                {name: "Ashar", time: scheduleData.ashar},
                {name: "Maghrib", time: scheduleData.maghrib},
                {name: "Isya", time: scheduleData.isya}
                
            ];

            var nextPrayer = prayerTimes.find(prayer => {
                var prayerTime = new Date(now.toDateString() + ' ' + prayer.time);
                return prayerTime > now;
            });

            if (!nextPrayer) {
                nextPrayer = prayerTimes[0];
                var nextPrayerTime = new Date(now.toDateString() + ' ' + nextPrayer.time);
                nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
            } else {
                var nextPrayerTime = new Date(now.toDateString() + ' ' + nextPrayer.time);
            }

            var timeDiff = nextPrayerTime - now;
            var hours = Math.floor(timeDiff / (1000 * 60 * 60));
            var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            $("#countdown").html(`Waktu menuju ${nextPrayer.name}: -${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }

        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }
});