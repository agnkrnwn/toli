function updateClock() {
  var now = new Date();
  var hours = now.getHours().toString().padStart(2, "0");
  var minutes = now.getMinutes().toString().padStart(2, "0");
  var seconds = now.getSeconds().toString().padStart(2, "0");
  var timeString = `${hours}:${minutes}:${seconds}`;
  $("#clock").text(timeString);
}

// Update jam setiap detik
setInterval(updateClock, 1000);

// Panggil updateClock sekali untuk menginisialisasi jam
updateClock();

$(document).ready(function () {
  var urlProvinsi = "https://ibnux.github.io/data-indonesia/provinsi.json";
  var urlKabupaten = "https://ibnux.github.io/data-indonesia/kabupaten/";
  var countdownInterval;
  $("#select2-kabupaten").hide();
  updateClock();
  setInterval(updateClock, 1000);

  function clearOptions(id) {
    $("#" + id)
      .empty()
      .trigger("change");
  }

  // Load Provinsi
  console.log("Load Provinsi...");
  $.getJSON(urlProvinsi, function (res) {
    res = $.map(res, function (obj) {
      obj.text = obj.nama;
      return obj;
    });

    data = [
      {
        id: "",
        nama: "- Pilih Provinsi -",
        text: "- Pilih Provinsi -",
      },
    ].concat(res);

    $("#select2-provinsi").select2({
      dropdownAutoWidth: true,
      width: "100%",
      data: data,
    });
  });

  // Event handler untuk perubahan provinsi
  var selectProv = $("#select2-provinsi");
  $(selectProv).change(function () {
    var value = $(selectProv).val();
    clearOptions("select2-kabupaten");

    if (value) {
      console.log("on change selectProv");
      var text = $("#select2-provinsi :selected").text();
      console.log("value = " + value + " / " + "text = " + text);

      console.log("Load Kabupaten di " + text + "...");
      $.getJSON(urlKabupaten + value + ".json", function (res) {
        res = $.map(res, function (obj) {
          obj.text = obj.nama;
          return obj;
        });

        data = [
          {
            id: "",
            nama: "- Pilih Kabupaten -",
            text: "- Pilih Kabupaten -",
          },
        ].concat(res);

        $("#select2-kabupaten").select2({
          dropdownAutoWidth: true,
          width: "100%",
          data: data,
        });

        // Tampilkan dropdown kabupaten setelah data dimuat
        $("#select2-kabupaten").show();
      });
    } else {
      // Sembunyikan dropdown kabupaten jika tidak ada provinsi yang dipilih
      $("#select2-kabupaten").hide();
    }
  });

  function displaySchedule(city, country, data) {
    var times = adjustTimes(data.timings);
    var gregorianDate = data.date.gregorian.date;
    var hijriDate = data.date.hijri.date;
    var hijriMonthEn = data.date.hijri.month.en;

    $("#location").text(`${city}, ${country}`);
    $("#dates").html(`${gregorianDate} / ${hijriDate} ${hijriMonthEn} `);
    $("#fajr").text(times.Fajr);
    $("#dhuhr").text(times.Dhuhr);
    $("#asr").text(times.Asr);
    $("#maghrib").text(times.Maghrib);
    $("#isha").text(times.Isha);
    $("#imsak").text(times.Imsak);
    $("#sunrise").text(times.Sunrise); // Tambahkan ini

    $("#schedule").show();
    $("#errorMsg").hide();

    console.log(city, country, data, times);

    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    updateCountdown(times);
  }

  function adjustTimes(times) {
    const adjustedTimes = {
      Imsak: adjustTime(times.Imsak, 0), // Adjust imsak time by subtracting 1 minute
      Fajr: adjustTime(times.Fajr, 0), // Adjust fajr time by subtracting 1 minute
      Dhuhr: adjustTime(times.Dhuhr, 3), // Adjust dhuhr time by subtracting 1 minute
      Asr: adjustTime(times.Asr, 2), // Adjust asr time by subtracting 1 minute
      Maghrib: adjustTime(times.Maghrib, 2), // Adjust maghrib time by subtracting 1 minute
      Isha: adjustTime(times.Isha, -13), // Adjust isha time by subtracting 1 minute
      Sunrise: adjustTime(times.Sunrise, -1), // Adjust sunrise time by subtracting 1 minute
    };
    return adjustedTimes;
  }

  function adjustTime(time, adjustment) {
    const timeParts = time.split(":");
    let hours = parseInt(timeParts[0], 10);
    let minutes = parseInt(timeParts[1], 10) + adjustment;

    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }

    return `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  function updateCountdown(times) {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    var now = new Date();
    var upcomingTime = null;
    var upcomingName = "";

    var relevantPrayers = [
      "Imsak",
      "Fajr",
      "Dhuhr",
      "Asr",
      "Maghrib",
      "Isha",
      "Sunrise",
    ];

    var sortedPrayers = relevantPrayers
      .map((name) => ({
        name: name,
        time: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          ...times[name].split(":")
        ),
      }))
      .sort((a, b) => a.time - b.time);

    for (let prayer of sortedPrayers) {
      if (prayer.time > now) {
        upcomingTime = prayer.time;
        upcomingName = prayer.name;
        break;
      }
    }

    if (!upcomingTime) {
      upcomingTime = new Date(
        sortedPrayers[0].time.getTime() + 24 * 60 * 60 * 1000
      );
      upcomingName = sortedPrayers[0].name;
    }

    function updateTimer() {
      var now = new Date();
      var diff = upcomingTime - now;
      var countdownElement = $("#countdown");
    
      if (diff <= 0) {
        // Jika waktu sudah habis
        clearInterval(countdownInterval);
        countdownElement.text(`${translatePrayerName(upcomingName)} !!!`);
        countdownElement.addClass("blink");
        countdownElement.css({
          "color": "red",
          "background": "white",
          "font-weight": "bold"
        });
        setTimeout(() => {
          countdownElement.removeClass("blink");
          countdownElement.css({
            "color": "",
            "background": "",
            "font-weight": ""
          });
          updateCountdown(times);
        }, 30000); // Hapus efek berkedip dan reset gaya setelah 30 detik
      } else {
        // Jika masih ada waktu tersisa
        var hours = Math.floor(diff / 1000 / 60 / 60);
        var minutes = Math.floor((diff / 1000 / 60) % 60);
        var seconds = Math.floor((diff / 1000) % 60);
    
        // Format jam, menit, dan detik dengan padding nol
        var formattedHours = hours.toString().padStart(2, '0');
        var formattedMinutes = minutes.toString().padStart(2, '0');
        var formattedSeconds = seconds.toString().padStart(2, '0');
    
        if (diff <= 10000) { // Jika tersisa 10 detik atau kurang
          countdownElement.addClass("blink");
          countdownElement.css("color", "red");
        } else {
          countdownElement.removeClass("blink");
          countdownElement.css({
            "color": "",
            "background": "",
            "font-weight": ""
          });
        }
    
        countdownElement.html(`
          <div><b>${translatePrayerName(upcomingName)} -${formattedHours}:${formattedMinutes}:${formattedSeconds} Lagi </b></div>
        `);
      }
    }

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
  }

  function translatePrayerName(englishName) {
    const translations = {
      Imsak: "Imsak",
      Fajr: "Subuh",
      Dhuhr: "Dzuhur",
      Asr: "Ashar",
      Maghrib: "Maghrib",
      Isha: "Isya",
      Sunrise: "Sunrise",
    };
    return translations[englishName] || englishName;
  }

  $("#getSchedule").on("click", function () {
    var city = $("#select2-kabupaten").select2("data")[0].text;
    var country = "Indonesia";
    if (city && city !== "- Pilih Kabupaten -") {
      $.ajax({
        url: `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=8`,
        method: "GET",
        success: function (response) {
          if (response.code === 200) {
            displaySchedule(city, country, response.data);
          } else {
            if (countdownInterval) {
              clearInterval(countdownInterval);
            }
            $("#schedule").hide();
            $("#errorMsg").show().text("Kota atau negara tidak ditemukan.");
          }
        },
        error: function () {
          if (countdownInterval) {
            clearInterval(countdownInterval);
          }
          $("#schedule").hide();
          $("#errorMsg").show().text("Terjadi kesalahan dalam mengambil data.");
        },
      });
    } else {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      $("#schedule").hide();
      $("#errorMsg").show().text("Pilih kota terlebih dahulu.");
    }
  });

  // Mendapatkan jadwal sholat default saat halaman pertama kali dimuat
  var defaultCity = "Jakarta";
  var defaultCountry = "Indonesia";
  $.ajax({
    url: `https://api.aladhan.com/v1/timingsByCity?city=${defaultCity}&country=${defaultCountry}&method=8`,
    method: "GET",
    success: function (response) {
      if (response.code === 200) {
        displaySchedule(defaultCity, defaultCountry, response.data);
      } else {
        $("#schedule").hide();
        $("#errorMsg").show().text("Kota atau negara tidak ditemukan.");
      }
    },
    error: function () {
      $("#schedule").hide();
      $("#errorMsg").show().text("Terjadi kesalahan dalam mengambil data.");
    },
  });
});
