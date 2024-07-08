document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const surahList = document.getElementById("surahList");
  const surahDetail = document.getElementById("surahDetail");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const scrollToTopBtn = document.createElement("button");
 
  let allSurahs = [];
  let surahCache = new Map();

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

  fetchSurahList();

  // Dark mode toggle functionality
  darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true' || 
    (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

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

  function displayAllSurahs(surahs) {
    surahList.innerHTML = surahs
      .map(
        (surah) => `
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer" onclick="fetchSurahDetail(${surah.nomor})" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
            <h3 class="text-lg font-semibold text-primary-600 dark:text-primary-400">${surah.nomor}. ${surah.namaLatin}</h3>
            <p class="text-gray-600 dark:text-gray-400">${surah.arti}</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">${surah.jumlahAyat} ayat</p>
            </div>
            <h3 class="text-lg font-semibold text-primary-600 dark:text-primary-400">${surah.nama}</h3>
            </div>
        `
      )
      .join("");
  }

  window.fetchSurahDetail = async function (nomorSurah) {
    try {
      if (surahCache.has(nomorSurah)) {
        const { surahData, tafsirData } = surahCache.get(nomorSurah);
        displaySurahDetail(surahData, tafsirData);
        surahDetail.scrollIntoView({ behavior: "smooth" });
        return;
      }

      const [surahResponse, tafsirResponse] = await Promise.all([
        fetch(`https://equran.id/api/v2/surat/${nomorSurah}`),
        fetch(`https://equran.id/api/v2/tafsir/${nomorSurah}`)
      ]);

      let surahData, tafsirData;

      try {
        surahData = await surahResponse.json();
      } catch (error) {
        console.error("Error parsing surah data:", error);
        surahData = { code: 500, message: "Error parsing surah data" };
      }

      try {
        tafsirData = await tafsirResponse.json();
      } catch (error) {
        console.error("Error parsing tafsir data:", error);
        tafsirData = { code: 500, message: "Error parsing tafsir data" };
      }

      if (surahData.code === 200 && tafsirData.code === 200) {
        surahCache.set(nomorSurah, { surahData: surahData.data, tafsirData: tafsirData.data });
        displaySurahDetail(surahData.data, tafsirData.data);
        surahDetail.scrollIntoView({ behavior: "smooth" });
      } else {
        let errorMessage = "";
        if (surahData.code !== 200) errorMessage += `Gagal memuat detail surah: ${surahData.message}. `;
        if (tafsirData.code !== 200) errorMessage += `Gagal memuat tafsir: ${tafsirData.message}.`;
        surahDetail.innerHTML = `<p class="text-red-500">${errorMessage}</p>`;
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
                <div class="mt-4 space-x-2">
                    <button id="toggleAyatBtn" class="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200">
                        Show Ayat
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
      button.textContent = "Hide Ayat";
      container.classList.remove("hidden");
    } else {
      container.innerHTML = "";
      button.textContent = "Show Ayat";
      container.classList.add("hidden");
    }
  }

  function displayAyatWithTafsir(ayat, tafsir, container) {
    container.innerHTML = `
            <h3 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Ayat-ayat:</h3>
            <div id="ayatList" class="space-y-6"></div>
        `;

    const ayatList = document.getElementById("ayatList");
    const batchSize = 10;
    let currentIndex = 0;

    function loadMoreAyat() {
      const fragment = document.createDocumentFragment();
      const endIndex = Math.min(currentIndex + batchSize, ayat.length);

      for (let i = currentIndex; i < endIndex; i++) {
        const a = ayat[i];
        const div = document.createElement("div");
        div.className = "border-b border-gray-200 dark:border-gray-700 pb-4";
        div.innerHTML = `
          <div class="flex justify-between items-center mb-2">
            <span class="text-lg font-semibold">${a.nomorAyat}.</span>
            <button class="play-audio-btn text-primary-800 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200" data-audio="${a.audio["05"]}">
              <i class="fas fa-play"></i>
            </button>
          </div>
          <p class="text-right text-2xl mb-2 font-arabic">${a.teksArab}</p>
          <p class="mb-1 text-lg">${a.teksLatin}</p>
          <p class="text-gray-600 dark:text-gray-400">${a.teksIndonesia}</p>
          <button class="toggle-tafsir-btn mt-2 text-primary-600 dark:text-primary-400 hover:underline" data-ayat="${a.nomorAyat}">
            Show Tafsir
          </button>
          <div class="tafsir-container hidden mt-2">
            <p class="text-gray-600 dark:text-gray-400">${tafsir[i] ? tafsir[i].teks : 'Tafsir tidak tersedia'}</p>
          </div>
        `;
        fragment.appendChild(div);
      }

      ayatList.appendChild(fragment);

      currentIndex = endIndex;

      if (currentIndex < ayat.length) {
        const options = {
          root: null,
          rootMargin: "0px",
          threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            observer.unobserve(entries[0].target);
            loadMoreAyat();
          }
        }, options);

        observer.observe(ayatList.lastElementChild);
      }

      const audioButtons = ayatList.querySelectorAll(".play-audio-btn");
      audioButtons.forEach((button) => {
        button.addEventListener("click", () => playAyatAudio(button));
      });

      const tafsirButtons = ayatList.querySelectorAll(".toggle-tafsir-btn");
      tafsirButtons.forEach((button) => {
        button.addEventListener("click", () => toggleTafsirPerAyat(button));
      });
    }

    loadMoreAyat();
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

  function toggleTafsirPerAyat(button) {
    const tafsirContainer = button.nextElementSibling;
    if (tafsirContainer.classList.contains("hidden")) {
      tafsirContainer.classList.remove("hidden");
      button.textContent = "Hide Tafsir";
    } else {
      tafsirContainer.classList.add("hidden");
      button.textContent = "Show Tafsir";
    }
  }
});
