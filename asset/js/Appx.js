document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const surahList = document.getElementById("surahList");
  const surahDetail = document.getElementById("surahDetail");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const scrollToTopBtn = document.createElement("button");

  const allSurahs = [
  { nomor: 1, namaLatin: "Al-Fatihah", nama: "الفاتحة", arti: "Pembukaan", jumlahAyat: 7 },
  { nomor: 2, namaLatin: "Al-Baqarah", nama: "البقرة", arti: "Sapi Betina", jumlahAyat: 286 },
  { nomor: 3, namaLatin: "Ali 'Imran", nama: "آل عمران", arti: "Keluarga Imran", jumlahAyat: 200 },
  { nomor: 4, namaLatin: "An-Nisa'", nama: "النساء", arti: "Wanita", jumlahAyat: 176 },
  { nomor: 5, namaLatin: "Al-Ma'idah", nama: "المائدة", arti: "Hidangan", jumlahAyat: 120 },
  { nomor: 6, namaLatin: "Al-An'am", nama: "الأنعام", arti: "Binatang Ternak", jumlahAyat: 165 },
  { nomor: 7, namaLatin: "Al-A'raf", nama: "الأعراف", arti: "Tempat Tertinggi", jumlahAyat: 206 },
  { nomor: 8, namaLatin: "Al-Anfal", nama: "الأنفال", arti: "Harta Rampasan Perang", jumlahAyat: 75 },
  { nomor: 9, namaLatin: "At-Taubah", nama: "التوبة", arti: "Pengampunan", jumlahAyat: 129 },
  { nomor: 10, namaLatin: "Yunus", nama: "يونس", arti: "Yunus", jumlahAyat: 109 },
  { nomor: 11, namaLatin: "Hud", nama: "هود", arti: "Hud", jumlahAyat: 123 },
  { nomor: 12, namaLatin: "Yusuf", nama: "يوسف", arti: "Yusuf", jumlahAyat: 111 },
  { nomor: 13, namaLatin: "Ar-Ra'd", nama: "الرعد", arti: "Guruh", jumlahAyat: 43 },
  { nomor: 14, namaLatin: "Ibrahim", nama: "ابراهيم", arti: "Ibrahim", jumlahAyat: 52 },
  { nomor: 15, namaLatin: "Al-Hijr", nama: "الحجر", arti: "Hijr", jumlahAyat: 99 },
  { nomor: 16, namaLatin: "An-Nahl", nama: "النحل", arti: "Lebah", jumlahAyat: 128 },
  { nomor: 17, namaLatin: "Al-Isra'", nama: "الإسراء", arti: "Perjalanan Malam", jumlahAyat: 111 },
  { nomor: 18, namaLatin: "Al-Kahf", nama: "الكهف", arti: "Gua", jumlahAyat: 110 },
  { nomor: 19, namaLatin: "Maryam", nama: "مريم", arti: "Maryam", jumlahAyat: 98 },
  { nomor: 20, namaLatin: "Ta Ha", nama: "طه", arti: "Ta Ha", jumlahAyat: 135 },
  { nomor: 21, namaLatin: "Al-Anbiya'", nama: "الأنبياء", arti: "Para Nabi", jumlahAyat: 112 },
  { nomor: 22, namaLatin: "Al-Hajj", nama: "الحج", arti: "Haji", jumlahAyat: 78 },
  { nomor: 23, namaLatin: "Al-Mu'minun", nama: "المؤمنون", arti: "Orang-orang Mukmin", jumlahAyat: 118 },
  { nomor: 24, namaLatin: "An-Nur", nama: "النور", arti: "Cahaya", jumlahAyat: 64 },
  { nomor: 25, namaLatin: "Al-Furqan", nama: "الفرقان", arti: "Pembeda", jumlahAyat: 77 },
  { nomor: 26, namaLatin: "Asy-Syu'ara'", nama: "الشعراء", arti: "Para Penyair", jumlahAyat: 227 },
  { nomor: 27, namaLatin: "An-Naml", nama: "النمل", arti: "Semut", jumlahAyat: 93 },
  { nomor: 28, namaLatin: "Al-Qasas", nama: "القصص", arti: "Kisah-kisah", jumlahAyat: 88 },
  { nomor: 29, namaLatin: "Al-'Ankabut", nama: "العنكبوت", arti: "Laba-laba", jumlahAyat: 69 },
  { nomor: 30, namaLatin: "Ar-Rum", nama: "الروم", arti: "Romawi", jumlahAyat: 60 },
  { nomor: 31, namaLatin: "Luqman", nama: "لقمان", arti: "Luqman", jumlahAyat: 34 },
  { nomor: 32, namaLatin: "As-Sajdah", nama: "السجدة", arti: "Sajdah", jumlahAyat: 30 },
  { nomor: 33, namaLatin: "Al-Ahzab", nama: "الأحزاب", arti: "Golongan yang Bersekutu", jumlahAyat: 73 },
  { nomor: 34, namaLatin: "Saba'", nama: "سبإ", arti: "Saba'", jumlahAyat: 54 },
  { nomor: 35, namaLatin: "Fatir", nama: "فاطر", arti: "Pencipta", jumlahAyat: 45 },
  { nomor: 36, namaLatin: "Ya Sin", nama: "يس", arti: "Ya Sin", jumlahAyat: 83 },
  { nomor: 37, namaLatin: "As-Saffat", nama: "الصافات", arti: "Barisan-barisan", jumlahAyat: 182 },
  { nomor: 38, namaLatin: "Sad", nama: "ص", arti: "Sad", jumlahAyat: 88 },
  { nomor: 39, namaLatin: "Az-Zumar", nama: "الزمر", arti: "Rombongan-rombongan", jumlahAyat: 75 },
  { nomor: 40, namaLatin: "Gafir", nama: "غافر", arti: "Maha Pengampun", jumlahAyat: 85 },
  { nomor: 41, namaLatin: "Fussilat", nama: "فصلت", arti: "Yang Dijelaskan", jumlahAyat: 54 },
  { nomor: 42, namaLatin: "Asy-Syura", nama: "الشورى", arti: "Musyawarah", jumlahAyat: 53 },
  { nomor: 43, namaLatin: "Az-Zukhruf", nama: "الزخرف", arti: "Perhiasan", jumlahAyat: 89 },
  { nomor: 44, namaLatin: "Ad-Dukhan", nama: "الدخان", arti: "Kabut", jumlahAyat: 59 },
  { nomor: 45, namaLatin: "Al-Jasiyah", nama: "الجاثية", arti: "Yang Bertekuk Lutut", jumlahAyat: 37 },
  { nomor: 46, namaLatin: "Al-Ahqaf", nama: "الأحقاف", arti: "Bukit-bukit Pasir", jumlahAyat: 35 },
  { nomor: 47, namaLatin: "Muhammad", nama: "محمد", arti: "Muhammad", jumlahAyat: 38 },
  { nomor: 48, namaLatin: "Al-Fath", nama: "الفتح", arti: "Kemenangan", jumlahAyat: 29 },
  { nomor: 49, namaLatin: "Al-Hujurat", nama: "الحجرات", arti: "Kamar-kamar", jumlahAyat: 18 },
  { nomor: 50, namaLatin: "Qaf", nama: "ق", arti: "Qaf", jumlahAyat: 45 },
  { nomor: 51, namaLatin: "Az-Zariyat", nama: "الذاريات", arti: "Angin yang Menerbangkan", jumlahAyat: 60 },
  { nomor: 52, namaLatin: "At-Tur", nama: "الطور", arti: "Bukit", jumlahAyat: 49 },
  { nomor: 53, namaLatin: "An-Najm", nama: "النجم", arti: "Bintang", jumlahAyat: 62 },
  { nomor: 54, namaLatin: "Al-Qamar", nama: "القمر", arti: "Bulan", jumlahAyat: 55 },
  { nomor: 55, namaLatin: "Ar-Rahman", nama: "الرحمن", arti: "Maha Pengasih", jumlahAyat: 78 },
  { nomor: 56, namaLatin: "Al-Waqi'ah", nama: "الواقعة", arti: "Hari Kiamat", jumlahAyat: 96 },
  { nomor: 57, namaLatin: "Al-Hadid", nama: "الحديد", arti: "Besi", jumlahAyat: 29 },
  { nomor: 58, namaLatin: "Al-Mujadilah", nama: "المجادلة", arti: "Wanita yang Mengajukan Gugatan", jumlahAyat: 22 },
  { nomor: 59, namaLatin: "Al-Hasyr", nama: "الحشر", arti: "Pengusiran", jumlahAyat: 24 },
  { nomor: 60, namaLatin: "Al-Mumtahanah", nama: "الممتحنة", arti: "Wanita yang Diuji", jumlahAyat: 13 },
  { nomor: 61, namaLatin: "As-Saff", nama: "الصف", arti: "Barisan", jumlahAyat: 14 },
  { nomor: 62, namaLatin: "Al-Jumu'ah", nama: "الجمعة", arti: "Jumat", jumlahAyat: 11 },
  { nomor: 63, namaLatin: "Al-Munafiqun", nama: "المنافقون", arti: "Orang-orang Munafik", jumlahAyat: 11 },
  { nomor: 64, namaLatin: "At-Tagabun", nama: "التغابن", arti: "Hari Dinampakkan Kesalahan-kesalahan", jumlahAyat: 18 },
  { nomor: 65, namaLatin: "At-Talaq", nama: "الطلاق", arti: "Talak", jumlahAyat: 12 },
  { nomor: 66, namaLatin: "At-Tahrim", nama: "التحريم", arti: "Mengharamkan", jumlahAyat: 12 },
  { nomor: 67, namaLatin: "Al-Mulk", nama: "الملك", arti: "Kerajaan", jumlahAyat: 30 },
  { nomor: 68, namaLatin: "Al-Qalam", nama: "القلم", arti: "Pena", jumlahAyat: 52 },
  { nomor: 69, namaLatin: "Al-Haqqah", nama: "الحاقة", arti: "Hari Kiamat", jumlahAyat: 52 },
  { nomor: 70, namaLatin: "Al-Ma'arij", nama: "المعارج", arti: "Tempat Naik", jumlahAyat: 44 },
  { nomor: 71, namaLatin: "Nuh", nama: "نوح", arti: "Nuh", jumlahAyat: 28 },
  { nomor: 72, namaLatin: "Al-Jinn", nama: "الجن", arti: "Jin", jumlahAyat: 28 },
  { nomor: 73, namaLatin: "Al-Muzzammil", nama: "المزمل", arti: "Orang yang Berselimut", jumlahAyat: 20 },
  { nomor: 74, namaLatin: "Al-Muddassir", nama: "المدثر", arti: "Orang yang Berkemul", jumlahAyat: 56 },
  { nomor: 75, namaLatin: "Al-Qiyamah", nama: "القيامة", arti: "Hari Kiamat", jumlahAyat: 40 },
  { nomor: 76, namaLatin: "Al-Insan", nama: "الانسان", arti: "Manusia", jumlahAyat: 31 },
  { nomor: 77, namaLatin: "Al-Mursalat", nama: "المرسلات", arti: "Malaikat-malaikat yang Diutus", jumlahAyat: 50 },
  { nomor: 78, namaLatin: "An-Naba'", nama: "النبإ", arti: "Berita Besar", jumlahAyat: 40 },
  { nomor: 79, namaLatin: "An-Nazi'at", nama: "النازعات", arti: "Malaikat-malaikat yang Mencabut", jumlahAyat: 46 },
  { nomor: 80, namaLatin: "'Abasa", nama: "عبس", arti: "Ia Bermuka Masam", jumlahAyat: 42 },
  { nomor: 81, namaLatin: "At-Takwir", nama: "التكوير", arti: "Menggulung", jumlahAyat: 29 },
  { nomor: 82, namaLatin: "Al-Infitar", nama: "الإنفطار", arti: "Terbelah", jumlahAyat: 19 },
  { nomor: 83, namaLatin: "Al-Mutaffifin", nama: "المطففين", arti: "Orang-orang yang Curang", jumlahAyat: 36 },
  { nomor: 84, namaLatin: "Al-Insyiqaq", nama: "الإنشقاق", arti: "Terbelah", jumlahAyat: 25 },
  { nomor: 85, namaLatin: "Al-Buruj", nama: "البروج", arti: "Gugusan Bintang", jumlahAyat: 22 },
  { nomor: 86, namaLatin: "At-Tariq", nama: "الطارق", arti: "Yang Datang di Malam Hari", jumlahAyat: 17 },
  { nomor: 87, namaLatin: "Al-A'la", nama: "الأعلى", arti: "Yang Paling Tinggi", jumlahAyat: 19 },
  { nomor: 88, namaLatin: "Al-Gasyiyah", nama: "الغاشية", arti: "Hari Pembalasan", jumlahAyat: 26 },
  { nomor: 89, namaLatin: "Al-Fajr", nama: "الفجر", arti: "Fajar", jumlahAyat: 30 },
  { nomor: 90, namaLatin: "Al-Balad", nama: "البلد", arti: "Negeri", jumlahAyat: 20 },
  { nomor: 91, namaLatin: "Asy-Syams", nama: "الشمس", arti: "Matahari", jumlahAyat: 15 },
  { nomor: 92, namaLatin: "Al-Lail", nama: "الليل", arti: "Malam", jumlahAyat: 21 },
  { nomor: 93, namaLatin: "Ad-Duha", nama: "الضحى", arti: "Waktu Duha", jumlahAyat: 11 },
  { nomor: 94, namaLatin: "Asy-Syarh", nama: "الشرح", arti: "Melapangkan", jumlahAyat: 8 },
  { nomor: 95, namaLatin: "At-Tin", nama: "التين", arti: "Buah Tin", jumlahAyat: 8 },
  { nomor: 96, namaLatin: "Al-'Alaq", nama: "العلق", arti: "Segumpal Darah", jumlahAyat: 19 },
  { nomor: 97, namaLatin: "Al-Qadr", nama: "القدر", arti: "Kemuliaan", jumlahAyat: 5 },
  { nomor: 98, namaLatin: "Al-Bayyinah", nama: "البينة", arti: "Bukti yang Nyata", jumlahAyat: 8 },
  { nomor: 99, namaLatin: "Az-Zalzalah", nama: "الزلزلة", arti: "Kegoncangan", jumlahAyat: 8 },
  { nomor: 100, namaLatin: "Al-'Adiyat", nama: "العاديات", arti: "Kuda Perang yang Berlari Kencang", jumlahAyat: 11 },
  { nomor: 101, namaLatin: "Al-Qari'ah", nama: "القارعة", arti: "Hari Kiamat", jumlahAyat: 11 },
  { nomor: 102, namaLatin: "At-Takasur", nama: "التكاثر", arti: "Bermegah-megahan", jumlahAyat: 8 },
  { nomor: 103, namaLatin: "Al-'Asr", nama: "العصر", arti: "Masa", jumlahAyat: 3 },
  { nomor: 104, namaLatin: "Al-Humazah", nama: "الهمزة", arti: "Pengumpat", jumlahAyat: 9 },
  { nomor: 105, namaLatin: "Al-Fil", nama: "الفيل", arti: "Gajah", jumlahAyat: 5 },
  { nomor: 106, namaLatin: "Quraisy", nama: "قريش", arti: "Suku Quraisy", jumlahAyat: 4 },
  { nomor: 107, namaLatin: "Al-Ma'un", nama: "الماعون", arti: "Barang-barang yang Berguna", jumlahAyat: 7 },
  { nomor: 108, namaLatin: "Al-Kausar", nama: "الكوثر", arti: "Nikmat yang Berlimpah", jumlahAyat: 3 },
  { nomor: 109, namaLatin: "Al-Kafirun", nama: "الكافرون", arti: "Orang-orang Kafir", jumlahAyat: 6 },
  { nomor: 110, namaLatin: "An-Nasr", nama: "النصر", arti: "Pertolongan", jumlahAyat: 3 },
  { nomor: 111, namaLatin: "Al-Lahab", nama: "اللهب", arti: "Gejolak Api", jumlahAyat: 5 },
  { nomor: 112, namaLatin: "Al-Ikhlas", nama: "الإخلاص", arti: "Ikhlas", jumlahAyat: 4 },
  { nomor: 113, namaLatin: "Al-Falaq", nama: "الفلق", arti: "Waktu Subuh", jumlahAyat: 5 },
  { nomor: 114, namaLatin: "An-Nas", nama: "الناس", arti: "Manusia", jumlahAyat: 6 }
];

  // Membuat tombol scroll to top
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.className = "fixed bottom-4 right-4 bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors duration-200 z-50";
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    transform: translateY(100px);
  `;
  document.body.appendChild(scrollToTopBtn);

  displayAllSurahs(allSurahs);

  darkModeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredSurahs = allSurahs.filter(
      (surah) =>
        surah.namaLatin.toLowerCase().includes(searchTerm) ||
        surah.arti.toLowerCase().includes(searchTerm) ||
        surah.nama.toLowerCase().includes(searchTerm) ||
        surah.nomor.toString().includes(searchTerm)
    );
    displayAllSurahs(filteredSurahs);
  });

  // ... (kode lainnya tetap sama)
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.transform = "translateY(0)";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.transform = "translateY(100px)";
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function fetchSurahList() {
    try {
      const response = await fetch("https://equran.id/api/v2/surat");
      const data = await response.json();

      if (data.code === 200) {
        allSurahs = data.data;
        displayAllSurahs(allSurahs);
      } else {
        surahList.innerHTML =
          '<p class="text-red-500">Gagal memuat daftar surah.</p>';
      }
    } catch (error) {
      console.error("Error:", error);
      surahList.innerHTML =
        '<p class="text-red-500">Terjadi kesalahan. Silakan coba lagi nanti.</p>';
    }
  }

  function displayAllSurahs(surahs) {
    surahList.innerHTML = surahs
      .map(
        (surah) => `
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer" onclick="fetchSurahDetail(${surah.nomor})">
                <h3 class="text-lg font-semibold text-primary-600 dark:text-primary-400">${surah.nomor}. ${surah.namaLatin}</h3>
                <p class="text-gray-600 dark:text-gray-400">${surah.arti}</p>
                <p class="text-sm text-gray-500 dark:text-gray-500">${surah.jumlahAyat} ayat</p>
            </div>
        `
      )
      .join("");
  }

  window.fetchSurahDetail = async function (nomorSurah) {
    try {
      const [surahResponse, tafsirResponse] = await Promise.all([
        fetch(`https://equran.id/api/v2/surat/${nomorSurah}`),
        fetch(`https://equran.id/api/v2/tafsir/${nomorSurah}`)
      ]);
      const surahData = await surahResponse.json();
      const tafsirData = await tafsirResponse.json();

      if (surahData.code === 200 && tafsirData.code === 200) {
        displaySurahDetail(surahData.data, tafsirData.data);
        surahDetail.scrollIntoView({ behavior: "smooth" });
      } else {
        surahDetail.innerHTML =
          '<p class="text-red-500">Gagal memuat detail surah atau tafsir.</p>';
      }
    } catch (error) {
      console.error("Error:", error);
      surahDetail.innerHTML =
        '<p class="text-red-500">Terjadi kesalahan. Silakan coba lagi nanti.</p>';
    }
  };

  function displaySurahDetail(surah, tafsir) {
    surahDetail.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-primary-600 dark:text-primary-400">${surah.nomor}. ${surah.namaLatin} (${surah.nama})</h2>
                    <button id="audioToggle" class="text-primary-800 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <audio id="surahAudio" src="${surah.audioFull["05"]}" preload="none"></audio>
                <div class="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong class="font-semibold">Arti:</strong> ${surah.arti}</p>
                    <p><strong class="font-semibold">Jumlah Ayat:</strong> ${surah.jumlahAyat}</p>
                    <p><strong class="font-semibold">Tempat Turun:</strong> ${surah.tempatTurun}</p>
                    <p><strong class="font-semibold">Deskripsi:</strong> ${surah.deskripsi}</p>
                </div>
                <div class="mt-4">
                    <button id="toggleAyatBtn" class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200">
                        Tampilkan Ayat
                    </button>
                </div>
                <div id="ayatContainer" class="mt-4 hidden"></div>
            </div>
        `;

    const audioToggle = document.getElementById("audioToggle");
    const audio = document.getElementById("surahAudio");
    const toggleAyatBtn = document.getElementById("toggleAyatBtn");
    const ayatContainer = document.getElementById("ayatContainer");

    audioToggle.addEventListener("click", () => toggleAudio(audio, audioToggle));
    toggleAyatBtn.addEventListener("click", () => toggleAyat(surah.ayat, tafsir.tafsir, toggleAyatBtn, ayatContainer));
  }

  function toggleAudio(audio, button) {
    if (audio.paused) {
      audio.play();
      button.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      audio.pause();
      button.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  function toggleAyat(ayat, tafsir, button, container) {
    if (container.classList.contains("hidden")) {
      displayAyatWithTafsir(ayat, tafsir, container);
      button.textContent = "Sembunyikan Ayat";
      container.classList.remove("hidden");
    } else {
      container.innerHTML = "";
      button.textContent = "Tampilkan Ayat";
      container.classList.add("hidden");
    }
  }

  function displayAyatWithTafsir(ayat, tafsir, container) {
    container.innerHTML = `
            <div class="space-y-6">
                ${ayat
                  .map(
                    (a, index) => `
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-lg font-semibold">${a.nomorAyat}.</span>
                            <div>
                                <button class="play-audio-btn text-primary-800 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 mr-2" data-audio="${a.audio["05"]}">
                                    <i class="fas fa-play"></i>
                                </button>
                                <button class="toggle-tafsir-btn text-secondary-800 dark:text-secondary-200 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors duration-200" data-ayat="${a.nomorAyat}">
                                    <i class="fas fa-book"></i>
                                </button>
                            </div>
                        </div>
                        <p class="text-right text-2xl mb-2 font-arabic">${a.teksArab}</p>
                        <p class="mb-1 text-lg">${a.teksLatin}</p>
                        <p class="text-gray-600 dark:text-gray-400">${a.teksIndonesia}</p>
                        <div class="tafsir-content hidden mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                            <h4 class="text-lg font-semibold mb-2">Tafsir:</h4>
                            <p>${tafsir[index].teks}</p>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;

    const audioButtons = container.querySelectorAll(".play-audio-btn");
    audioButtons.forEach((button) => {
      button.addEventListener("click", () => playAyatAudio(button));
    });

    const tafsirButtons = container.querySelectorAll(".toggle-tafsir-btn");
    tafsirButtons.forEach((button) => {
      button.addEventListener("click", () => toggleTafsir(button));
    });
  }

  function playAyatAudio(button) {
    const audioSrc = button.dataset.audio;
    const audio = new Audio(audioSrc);

    document.querySelectorAll("audio").forEach((a) => a.pause());

    audio.play();

    button.innerHTML = '<i class="fas fa-pause"></i>';

    audio.onended = () => {
      button.innerHTML = '<i class="fas fa-play"></i>';
    };
  }

  function toggleTafsir(button) {
    const ayatNumber = button.dataset.ayat;
    const tafsirContent = button.closest("div").nextElementSibling.nextElementSibling.nextElementSibling;
    
    if (tafsirContent.classList.contains("hidden")) {
      tafsirContent.classList.remove("hidden");
      button.innerHTML = '<i class="fas fa-book-open"></i>';
    } else {
      tafsirContent.classList.add("hidden");
      button.innerHTML = '<i class="fas fa-book"></i>';
    }
  }
});
