document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const surahList = document.getElementById("surahList");
  const surahDetail = document.getElementById("surahDetail");
  const darkModeToggle = document.getElementById("darkModeToggle");

  let allSurahs = [];

  fetchSurahList();

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
      const response = await fetch(
        `https://equran.id/api/v2/surat/${nomorSurah}`
      );
      const data = await response.json();

      if (data.code === 200) {
        displaySurahDetail(data.data);
      } else {
        surahDetail.innerHTML =
          '<p class="text-red-500">Gagal memuat detail surah.</p>';
      }
    } catch (error) {
      console.error("Error:", error);
      surahDetail.innerHTML =
        '<p class="text-red-500">Terjadi kesalahan. Silakan coba lagi nanti.</p>';
    }
  };

  function displaySurahDetail(surah) {
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
                <button id="toggleAyatBtn" class="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200">
                    Tampilkan Ayat
                </button>
                <div id="ayatContainer" class="mt-4 hidden"></div>
            </div>
        `;

    const audioToggle = document.getElementById("audioToggle");
    const audio = document.getElementById("surahAudio");
    const toggleAyatBtn = document.getElementById("toggleAyatBtn");
    const ayatContainer = document.getElementById("ayatContainer");

    audioToggle.addEventListener("click", () =>
      toggleAudio(audio, audioToggle)
    );
    toggleAyatBtn.addEventListener("click", () =>
      toggleAyat(surah.ayat, toggleAyatBtn, ayatContainer)
    );
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

  function toggleAyat(ayat, button, container) {
    if (container.classList.contains("hidden")) {
      displayAyat(ayat, container);
      button.textContent = "Sembunyikan Ayat";
      container.classList.remove("hidden");
    } else {
      container.innerHTML = "";
      button.textContent = "Tampilkan Ayat";
      container.classList.add("hidden");
    }
  }

  function displayAyat(ayat, container) {
    container.innerHTML = `
            <h3 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Ayat-ayat:</h3>
            <div class="space-y-6">
                ${ayat
                  .map(
                    (a) => `
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-lg font-semibold">${a.nomorAyat}.</span>
                            <button class="play-audio-btn text-primary-800 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200" data-audio="${a.audio["05"]}">
                                <i class="fas fa-play"></i>
                            </button>

                        </div>
                        <p class="text-right text-2xl mb-2 font-arabic">${a.teksArab}</p>
                        <p class="mb-1 text-lg">${a.teksLatin}</p>
                        <p class="text-gray-600 dark:text-gray-400">${a.teksIndonesia}</p>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;

    // Add event listeners to play audio buttons
    const audioButtons = container.querySelectorAll(".play-audio-btn");
    audioButtons.forEach((button) => {
      button.addEventListener("click", () => playAyatAudio(button));
    });
  }

  function playAyatAudio(button) {
    const audioSrc = button.dataset.audio;
    const audio = new Audio(audioSrc);

    // Stop any currently playing audio
    document.querySelectorAll("audio").forEach((a) => a.pause());

    audio.play();

    // Change button icon while playing
    button.innerHTML = '<i class="fas fa-pause"></i>';

    // Reset button icon when audio ends
    audio.onended = () => {
      button.innerHTML = '<i class="fas fa-play"></i>';
    };
  }
});
