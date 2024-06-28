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
        icon: "/asset/android/android-launchericon-48-48.png", // Tambahkan ikon jika diinginkan
        badge: "/asset/android/android-launchericon-48-48.png", // Untuk beberapa browser mobile
        vibrate: [200, 100, 200], // Pola getaran untuk device yang mendukung
        tag: "prayer-time", // Tag untuk mengelompokkan notifikasi
        renotify: true, // Memaksa notifikasi baru muncul meskipun ada notifikasi dengan tag yang sama
      });
    }
  }

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

  // Nama bulan Hijriah
  const hijriMonths = [
    "Muharram",
    "Safar",
    "Rabi'ul Awal",
    "Rabi'ul Akhir",
    "Jumadil Awal",
    "Jumadil Akhir",
    "Rajab",
    "Sya'ban",
    "Ramadhan",
    "Syawwal",
    "Dzul Qa'dah",
    "Dzul Hijjah",
  ];

  // Fungsi konversi tanggal Gregorian ke Hijriah dengan format tertentu
  function konversiTanggalHijriah(date) {
    const islamicDate = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).formatToParts(date);

    const day = islamicDate.find((part) => part.type === "day").value;
    const monthIndex =
      parseInt(islamicDate.find((part) => part.type === "month").value) - 1;
    const month = hijriMonths[monthIndex];
    const year = islamicDate.find((part) => part.type === "year").value;

    return `${day} ${month} ${year} AH`;
  }

  // Fungsi konversi tanggal Gregorian ke Jawa
  function konversiTanggalJawa(date) {
    const hari = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const pasaran = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
    const bulanJawa = [
      "Suro",
      "Sapar",
      "Mulud",
      "Bakdo Mulud",
      "Jumadil Awal",
      "Jumadil Akhir",
      "Rejeb",
      "Ruwah",
      "Poso",
      "Sawal",
      "Selo",
      "Besar",
    ];
    const startGregorianDate = new Date(1633, 7, 8);
    const startJavaneseDate = [1, 1, 1555];

    const msPerDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.floor((date - startGregorianDate) / msPerDay);
    const daysCycle = daysDifference % 5;

    const dayOfWeek = hari[date.getDay()];
    const dayPasaran = pasaran[daysCycle];

    const totalDays = daysDifference + startJavaneseDate[0];
    const yearCycle = Math.floor(totalDays / 365);
    const year = startJavaneseDate[2] + yearCycle;
    const remainingDays = totalDays % 365;
    const month = Math.floor(remainingDays / 30);
    const day = (remainingDays % 30) + 1;

    return `${dayOfWeek} ${dayPasaran}, ${day} ${bulanJawa[month]} ${year}`;
  }

  // Fungsi menampilkan jadwal
  function displaySchedule(city, data) {
    console.log("Menampilkan jadwal untuk kota:", city, "dengan data:", data);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    var now = new Date();
    var hijriDate = konversiTanggalHijriah(now);
    var javaneseDate = konversiTanggalJawa(now);

    var gregorianDate = now.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    $("#location").text(city);
    $("#gregorian-date").text(gregorianDate);
    $("#hijri-date").text(hijriDate);
    $("#javanese-date").text(javaneseDate);
    $("#subuh").text(data.subuh);
    $("#dzuhur").text(data.dzuhur);
    $("#ashar").text(data.ashar);
    $("#maghrib").text(data.maghrib);
    $("#isya").text(data.isya);
    $("#imsak").text(data.imsak);
    $("#terbit").text(data.terbit);
    $("#dhuha").text(data.dhuha);

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
