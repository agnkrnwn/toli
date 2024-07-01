// sholat2.js

let wilayahData = [];

function loadWilayahData() {
    console.log('Memuat data wilayah BMKG...');
    return $.getJSON('https://ibnux.github.io/BMKG-importer/cuaca/wilayah.json')
      .then(function(data) {
        console.log('Data wilayah BMKG berhasil dimuat:', data.length, 'wilayah');
        wilayahData = data;
      })
      .catch(function(error) {
        console.error('Error loading wilayah data:', error);
      });
  }
  
  function findNearestWilayah(cityName) {
    console.log('Mencari wilayah terdekat untuk:', cityName);
    let nearestWilayah = wilayahData.find(w => w.kota.toLowerCase().includes(cityName.toLowerCase()));
    if (!nearestWilayah) {
      console.log('Wilayah tidak ditemukan, menggunakan default');
      nearestWilayah = wilayahData[0];
    }
    console.log('Wilayah terdekat yang ditemukan:', nearestWilayah);
    return nearestWilayah;
  }
  
  function getWeather(wilayahId) {
    console.log('Mengambil data cuaca untuk wilayah ID:', wilayahId);
    const url = `https://ibnux.github.io/BMKG-importer/cuaca/${wilayahId}.json`;
    console.log('urlnya:', url);

    return $.getJSON(url)
        .then(function(data) {
            console.log('Data cuaca berhasil diambil:', data);
            // Menentukan indeks data yang sesuai dengan waktu saat ini
            const now = new Date();
            const currentHour = now.getHours();

            let relevantIndex;
            if (currentHour >= 18 || currentHour < 0) {
                relevantIndex = data.findIndex(item => item.jamCuaca.includes("18:00:00"));
            } else if (currentHour >= 12) {
                relevantIndex = data.findIndex(item => item.jamCuaca.includes("12:00:00"));
            } else if (currentHour >= 6) {
                relevantIndex = data.findIndex(item => item.jamCuaca.includes("06:00:00"));
            } else {
                relevantIndex = data.findIndex(item => item.jamCuaca.includes("00:00:00"));
            }

            if (relevantIndex === -1) relevantIndex = 0;
            const relevantWeather = data[relevantIndex];

            return {
                cuaca: relevantWeather.cuaca,
                tempC: relevantWeather.tempC,
                kodeCuaca: parseInt(relevantWeather.kodeCuaca) // Menambahkan kode cuaca
            };
        })
        .catch(function(error) {
            console.error('Error fetching weather data:', error);
            $('#weatherInfo').text('Gagal memuat data cuaca').removeClass('hidden');
            return null;
        });
}

  

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

$(document).ready(function () {
  var urlKota = "https://api.myquran.com/v2/sholat/kota/semua";
  var urlJadwal = "https://api.myquran.com/v2/sholat/jadwal/";
  var jakartaId = "1301"; // ID untuk Jakarta

  // Variabel untuk menyimpan data jadwal
  var currentScheduleData;

  // Cek preferensi notifikasi dari localStorage
  var notificationsEnabled =
    localStorage.getItem("notificationsEnabled") === "true";

  // Inisialisasi status notifikasi
  updateNotificationButtonText();
  updateNotificationButtonIcon();

  // Event listener untuk tombol notifikasi
  $("#notificationToggle").on("click", function () {
    notificationsEnabled = !notificationsEnabled;
    localStorage.setItem("notificationsEnabled", notificationsEnabled);

    updateNotificationButtonText();
    if (notificationsEnabled) {
      requestNotificationPermission();
    }
  });

  // Fungsi untuk memperbarui teks tombol
  function updateNotificationButtonText() {
    if (notificationsEnabled) {
      $("#notificationToggle").text("off");
    } else {
      $("#notificationToggle").text("on");
    }
  }

  function updateNotificationButtonIcon() {
    if (notificationsEnabled) {
      $('#notificationToggle i').removeClass('fa-bell').addClass('fa-bell-slash');
    } else {
      $('#notificationToggle i').removeClass('fa-bell-slash').addClass('fa-bell');
    }
  }
  
  $('#notificationToggle').on('click', function() {
    notificationsEnabled = !notificationsEnabled;
    localStorage.setItem('notificationsEnabled', notificationsEnabled);
    updateNotificationButtonIcon();
    if (notificationsEnabled) {
      requestNotificationPermission();
    }
  });

  function requestNotificationPermission() {
    if (!("Notification" in window)) {
      console.log("Browser ini tidak mendukung notifikasi desktop");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          console.log("Izin notifikasi diberikan");
        }
      });
    }
  }

  function showNotification(title, body) {
    if (Notification.permission === "granted" && notificationsEnabled) {
      new Notification(title, {
        body: body,
        icon: "/asset/android/android-launchericon-48-48.png",
        badge: "/asset/android/android-launchericon-48-48.png",
        vibrate: [200, 100, 200],
        tag: "prayer-time",
        renotify: true,
      });
    }
  }

  // Load wilayah data terlebih dahulu
  loadWilayahData().then(() => {
    console.log("Memuat daftar kota...");
    // Load Kota
    $.getJSON(urlKota, function (data) {
      console.log("Respons API kota:", data);
      if (data.status) {
        var items = [{ id: "", text: "- Pilih Kota -" }];
        $.each(data.data, function (key, val) {
          items.push({ id: val.id, text: val.lokasi });
        });
        $("#select-kota").select2({
          data: items,
          theme: "classic",
          width: "100%",
          dropdownParent: $("#select-kota").parent(),
        });
        console.log("Daftar kota berhasil dimuat.");

        // Set Jakarta as default
        $("#select-kota").val(jakartaId).trigger("change");
        getSchedule(jakartaId, "Jakarta");
      } else {
        $("#errorMsg").text("Gagal memuat daftar kota.").removeClass("hidden");
        console.error("Gagal memuat daftar kota:", data);
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error saat memuat daftar kota:", textStatus, errorThrown);
      $("#errorMsg")
        .text("Gagal memuat daftar kota: " + textStatus)
        .removeClass("hidden");
    });
  });

  // Event handler untuk tombol "Tampilkan Jadwal"
  $("#getSchedule").on("click", function () {
    var kotaId = $("#select-kota").val();
    var kota = $("#select-kota").select2("data")[0].text;
    getSchedule(kotaId, kota);
  });

  function getSchedule(kotaId, kota) {
    console.log("Kota yang dipilih:", kota, "dengan ID:", kotaId);

    if (kotaId) {
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var dd = String(today.getDate()).padStart(2, "0");

      var url = urlJadwal + kotaId + "/" + yyyy + "/" + mm + "/" + dd;
      console.log("URL jadwal sholat:", url);

      $.ajax({
        url: url,
        method: "GET",
        success: function (response) {
          console.log("Respons API jadwal sholat:", response);

          if (response.status) {
            currentScheduleData = response.data.jadwal;
            displaySchedule(kota, currentScheduleData);
            
            // Tambahkan ini untuk mendapatkan dan menampilkan cuaca
            const nearestWilayah = findNearestWilayah(kota);
            getWeather(nearestWilayah.id);
          } else {
            $("#schedule").addClass("hidden");
            $("#errorMsg")
              .text("Data jadwal sholat tidak tersedia.")
              .removeClass("hidden");
            console.error("Data jadwal sholat tidak tersedia:", response);
          }
        },
        error: function (xhr, status, error) {
          $("#schedule").addClass("hidden");
          $("#errorMsg")
            .text("Terjadi kesalahan dalam mengambil data: " + error)
            .removeClass("hidden");
          console.error("Error saat mengambil jadwal sholat:", status, error);
          console.log("XHR object:", xhr);
        },
      });
    } else {
      $("#errorMsg").text("Pilih kota terlebih dahulu.").removeClass("hidden");
      console.warn("Kota belum dipilih");
    }
  }

  var countdownInterval;

  // Fungsi untuk mendapatkan tanggal Gregorian
  function gregorianDate(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }
  
  // Fungsi untuk mendapatkan tanggal Hijriah dari API
  async function getHijriDate() {
    try {
      const response = await fetch('https://api.myquran.com/v2/cal/hijr/?adj=-1');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.status && data.data && data.data.date) {
        return data.data.date[1]; // Mengambil tanggal Hijriah dari respons
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Error fetching Hijri date:', error);
      return 'Tidak dapat memuat tanggal Hijriah';
    }
  }
  
  async function displaySchedule(city, data) {
    console.log("Menampilkan jadwal untuk kota:", city, "dengan data:", data);
    
    var now = new Date();
    var gregDate = gregorianDate(now);
    var hijDate = await getHijriDate();
    
    var fullDate = `${gregDate} : ${hijDate}`;
    
    $("#full-date").text(fullDate);
    $("#subuh").text(data.subuh);
    $("#dzuhur").text(data.dzuhur);
    $("#ashar").text(data.ashar);
    $("#maghrib").text(data.maghrib);
    $("#isya").text(data.isya);
    $("#imsak").text(data.imsak);
    $("#terbit").text(data.terbit);
    $("#dhuha").text(data.dhuha);
    
    // Dapatkan data cuaca untuk kota yang dipilih
    const nearestWilayah = findNearestWilayah(city);
    const weatherData = await getWeather(nearestWilayah.id);
    
    if (weatherData) {
        $("#location").text(`${city}, ${weatherData.cuaca}, ${weatherData.tempC}°C`);
        
        let weatherIcon;
        switch(weatherData.kodeCuaca) {
            case 0:
                weatherIcon = '<i class="fas fa-sun text-yellow-500"></i>';
                break;
            case 1:
            case 2:
                weatherIcon = '<i class="fas fa-cloud-sun text-gray-500"></i>';
                break;
            case 3:
                weatherIcon = '<i class="fas fa-cloud text-gray-500"></i>';
                break;
            case 4:
                weatherIcon = '<i class="fas fa-cloud-meatball text-gray-700"></i>';
                break;
            case 5:
                weatherIcon = '<i class="fas fa-smog text-gray-400"></i>';
                break;
            case 10:
                weatherIcon = '<i class="fas fa-smog text-gray-500"></i>';
                break;
            case 45:
                weatherIcon = '<i class="fas fa-smog text-gray-300"></i>';
                break;
            case 60:
                weatherIcon = '<i class="fas fa-cloud-showers-heavy text-blue-400"></i>';
                break;
            case 61:
                weatherIcon = '<i class="fas fa-cloud-rain text-blue-500"></i>';
                break;
            case 63:
                weatherIcon = '<i class="fas fa-cloud-showers-heavy text-blue-600"></i>';
                break;
            case 80:
                weatherIcon = '<i class="fas fa-cloud-sun-rain text-yellow-500"></i>';
                break;
            case 95:
            case 97:
                weatherIcon = '<i class="fas fa-bolt text-yellow-500"></i>';
                break;
            default:
                weatherIcon = '<i class="fas fa-sun text-yellow-500"></i>';
        }
        $("#weather-icon").html(weatherIcon);
    } else {
        $("#location").text(city);
        $("#weather-icon").html('');
    }
    
    $("#schedule").removeClass("hidden");
    $("#errorMsg").addClass("hidden");
    
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
        { name: "Imsak", time: scheduleData.imsak },
        { name: "Subuh", time: scheduleData.subuh },
        { name: "Terbit", time: scheduleData.terbit },
        { name: "Dhuha", time: scheduleData.dhuha },
        { name: "Dzuhur", time: scheduleData.dzuhur },
        { name: "Ashar", time: scheduleData.ashar },
        { name: "Maghrib", time: scheduleData.maghrib },
        { name: "Isya", time: scheduleData.isya },
      ];

      var nextPrayer = prayerTimes.find((prayer) => {
        var prayerTime = new Date(now.toDateString() + " " + prayer.time);
        return prayerTime > now;
      });

      if (!nextPrayer) {
        nextPrayer = prayerTimes[0];
        var nextPrayerTime = new Date(
          now.toDateString() + " " + nextPrayer.time
        );
        nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
      } else {
        var nextPrayerTime = new Date(
          now.toDateString() + " " + nextPrayer.time
        );
      }

      var timeDiff = nextPrayerTime - now;
      var hours = Math.floor(timeDiff / (1000 * 60 * 60));
      var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      $("#countdown").html(
        `Waktu menuju ${nextPrayer.name}: -${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );

      // Tampilkan notifikasi saat waktu sholat tiba
      if (hours === 0 && minutes === 0 && seconds === 0) {
        showNotification("Waktu Sholat", `Saatnya ${nextPrayer.name}!`);
      }
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  // Fungsi untuk memeriksa waktu sholat setiap menit
  function checkPrayerTimes() {
    if (currentScheduleData) {
      var now = new Date();
      var currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      for (var prayer in currentScheduleData) {
        if (currentScheduleData[prayer] === currentTime) {
          showNotification("Waktu Sholat", `Saatnya ${prayer}!`);
        }
      }
    }
  }

  // Jalankan pengecekan waktu sholat setiap menit
  setInterval(checkPrayerTimes, 60000);

  // Minta izin notifikasi saat halaman dimuat
  if (notificationsEnabled) {
    requestNotificationPermission();
  }
});