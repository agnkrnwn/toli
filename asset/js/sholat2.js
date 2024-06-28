$(document).ready(function () {
    var urlProvinsi = "https://ibnux.github.io/data-indonesia/provinsi.json";
    var urlKabupaten = "https://bimasislam.kemenag.go.id/ajax/getKabkoshalat";
    var countdownInterval;
    $("#select2-kabupaten").hide();
    updateClock();
    setInterval(updateClock, 1000);
  
    // Load Provinsi (tidak berubah)
  
    // Event handler untuk perubahan provinsi
    var selectProv = $("#select2-provinsi");
    $(selectProv).change(function () {
      var value = $(selectProv).val();
      clearOptions("select2-kabupaten");
  
      if (value) {
        console.log("Load Kabupaten...");
        $.post(urlKabupaten, { x: value }, function (res) {
          var data = $.map(res, function (item, index) {
            return {
              id: index,
              text: item,
            };
          });
  
          data.unshift({
            id: "",
            text: "- Pilih Kabupaten -",
          });
  
          $("#select2-kabupaten").select2({
            dropdownAutoWidth: true,
            width: "100%",
            data: data,
          });
  
          $("#select2-kabupaten").show();
        });
      } else {
        $("#select2-kabupaten").hide();
      }
    });
  
    function displaySchedule(city, country, data) {
      var times = data;
      var now = new Date();
      var gregorianDate = now.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      var hijriDate = ""; // Anda mungkin perlu menambahkan konversi ke tanggal Hijriah
  
      $("#location").text(`${city}, ${country}`);
      $("#dates").html(`${gregorianDate} / ${hijriDate}`);
      $("#fajr").text(times.subuh);
      $("#dhuhr").text(times.dzuhur);
      $("#asr").text(times.ashar);
      $("#maghrib").text(times.maghrib);
      $("#isha").text(times.isya);
      $("#imsak").text(times.imsak);
      $("#sunrise").text(times.terbit);
  
      $("#schedule").show();
      $("#errorMsg").hide();
  
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
  
      updateCountdown(times);
    }
  
    // Fungsi adjustTimes, updateCountdown, dan translatePrayerName tetap sama
  
    $("#getSchedule").on("click", function () {
      var provinsiId = $("#select2-provinsi").val();
      var kabupatenId = $("#select2-kabupaten").val();
      var city = $("#select2-kabupaten").select2("data")[0].text;
      var country = "Indonesia";
  
      if (provinsiId && kabupatenId && kabupatenId !== "- Pilih Kabupaten -") {
        $.ajax({
          url: "https://bimasislam.kemenag.go.id/ajax/getShalatbln",
          method: "POST",
          data: {
            x: provinsiId,
            y: kabupatenId,
            bln: new Date().getMonth() + 1,
            thn: new Date().getFullYear()
          },
          success: function (response) {
            if (response.status === 1) {
              var todaySchedule = response.data.find(item => {
                var itemDate = new Date(item.tanggal);
                var today = new Date();
                return itemDate.getDate() === today.getDate() &&
                       itemDate.getMonth() === today.getMonth() &&
                       itemDate.getFullYear() === today.getFullYear();
              });
  
              if (todaySchedule) {
                displaySchedule(city, country, todaySchedule);
              } else {
                $("#schedule").hide();
                $("#errorMsg").show().text("Jadwal untuk hari ini tidak ditemukan.");
              }
            } else {
              $("#schedule").hide();
              $("#errorMsg").show().text("Data jadwal sholat tidak tersedia.");
            }
          },
          error: function () {
            $("#schedule").hide();
            $("#errorMsg").show().text("Terjadi kesalahan dalam mengambil data.");
          },
        });
      } else {
        $("#schedule").hide();
        $("#errorMsg").show().text("Pilih provinsi dan kota terlebih dahulu.");
      }
    });
  
    // Hapus bagian mendapatkan jadwal sholat default
  });