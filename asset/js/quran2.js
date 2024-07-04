$(document).ready(function () {
  let surahNameLatin = "";
  let surahNumber = "";
  let ayahNumber = "";
  let randomBgEnabled = true;
  let selectedQari = "ar.alafasy"; // Default qari
  let showArabic = true;
  let showTransliteration = true;
  let bookmarks = JSON.parse(localStorage.getItem("quranBookmarks-v1")) || [];
  let selectedArabicFont = "hurufb";
  let backgroundSetting = "random";

  const backgrounds = [];
  for (let i = 1; i <= 95; i++) {
    backgrounds.push(`../../asset/background/background${i}.jpg`);
  }

  function setBackground() {
    const quoteContainer = $("#quoteContainer");
    const quoteContent = $(".quote-content");

    switch (backgroundSetting) {
      case "random":
        // Jika Anda masih ingin opsi random
        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        quoteContainer.css({
          "background-image": `url('${backgrounds[randomIndex]}')`,
          "background-size": "cover",
          "background-position": "center",
        });
        quoteContent.removeClass("text-gray-900").addClass("text-white");
        break;
      case "specific":
        // Menggunakan gambar spesifik
        quoteContainer.css({
          "background-image": "url('../../asset/background/background20.jpg')",
          "background-size": "cover",
          "background-position": "center",
        });
        quoteContent.removeClass("text-gray-900").addClass("text-white");
        break;
      case "solid-dark":
        quoteContainer.css({
          "background-image": "none",
          "background-color": "#1f2937",
        });
        quoteContent.removeClass("text-gray-900").addClass("text-white");
        break;
      case "solid-light":
        quoteContainer.css({
          "background-image": "none",
          "background-color": "#f3f4f6",
        });
        quoteContent.removeClass("text-white").addClass("text-gray-900");
        break;
    }
  }
  // Fungsi untuk memperbarui pengaturan
  function updateSettings() {
    // Background
    backgroundSetting = $("#background-setting").val();
    setBackground();

    randomBgEnabled = $("#background-setting").val() === "random";
    setRandomBackground();

    // Arabic text
    showArabic = $("#show-arabic-setting").prop("checked");

    // Transliteration
    showTransliteration = $("#show-transliteration-setting").prop("checked");

    // Arabic font
    selectedArabicFont = $("#arabic-font-setting").val();

    updateQuoteVisibility();
    updateArabicFont();
  }

  $("#arabic-font-setting").change(function () {
    updateFontPreview();
  });

  // Fungsi untuk menampilkan modal pengaturan
  function showSettingsModal() {
    $("#background-setting").val(backgroundSetting);
    $("#show-arabic-setting").prop("checked", showArabic);
    $("#show-transliteration-setting").prop("checked", showTransliteration);
    $("#arabic-font-setting").val(selectedArabicFont);
    updateFontPreview();
    $("#settingsModal").removeClass("hidden");
  }

  // Event listeners
  $("#show-settings").click(showSettingsModal);
  $("#close-settings").click(function () {
    $("#settingsModal").addClass("hidden");
    updateSettings();
  });

  function setRandomBackground() {
    if (randomBgEnabled) {
      const randomIndex = Math.floor(Math.random() * backgrounds.length);
      $("#quoteContainer").css(
        "background-image",
        `url('${backgrounds[randomIndex]}')`
      );
      $("#quoteContainer").css("background-size", "cover");
      $("#quoteContainer").css("background-position", "center");
    } else {
      $("#quoteContainer").css("background-image", "none");
      $("#quoteContainer").css("background-color", "#1f2937"); // atau warna solid lain yang Anda inginkan
    }
  }

  function updateBookmarkButton() {
    const currentAyah = `${surahNumber}:${ayahNumber}`;
    if (bookmarks.includes(currentAyah)) {
      $("#toggle-bookmark")
        .addClass("text-yellow-500")
        .removeClass("text-gray-500");
    } else {
      $("#toggle-bookmark")
        .addClass("text-gray-500")
        .removeClass("text-yellow-500");
    }
  }

  function toggleBookmark() {
    const currentAyah = `${surahNumber}:${ayahNumber}`;
    const index = bookmarks.indexOf(currentAyah);
    if (index > -1) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(currentAyah);
    }
    localStorage.setItem("quranBookmarks-v1", JSON.stringify(bookmarks));
    updateBookmarkButton();
  }

  function updateFontPreview() {
    const selectedFont = $("#arabic-font-setting").val();
    $("#font-preview").css(
      "font-family",
      `${selectedFont}, KFGQPCUthmanic, hurufa, amiri, serif`
    );
  }

  function generateQuote(apiUrl) {
    setRandomBackground();

    $.getJSON(apiUrl, function (data) {
      const arabicText = data.data[0].text;
      const translationText = data.data[1].text;
      const transliterationText = data.data[2].text;
      const surahNameArabic = data.data[0].surah.name;
      surahNameLatin = data.data[0].surah.englishName;
      surahNumber = data.data[0].surah.number;
      ayahNumber = data.data[0].numberInSurah;

      $("#quote-details").html(
        `Surah <strong>${surahNameArabic}</strong> (<em>${surahNameLatin}</em>) - ${surahNumber}:${ayahNumber}`
      );
      $("#quote-arabic").text(arabicText);
      $("#quote-transliteration").text(transliterationText);
      $("#quote-translation").text(translationText);

      updateBookmarkButton();
      updateQuoteVisibility();
      adjustFontSizes();
      updateArabicFont();
      setRandomBackground();
      setBackground();

      const audioPlayer = document.getElementById("audioPlayer");
      const audioFileName = `${data.data[0].number}.mp3`;
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedQari}/${audioFileName}`;

      audioPlayer.src = audioUrl;
      audioPlayer.load();
      audioPlayer.play();

      // const audioTitle = `${selectedQari} : ${surahNameLatin} (${surahNumber}:${ayahNumber}) - ${audioFileName}`;
      const audioTitle = `${surahNameLatin} (${surahNumber}:${ayahNumber}) - ${audioFileName}`;
      $("#audio-title").text(audioTitle);

      audioPlayer.onerror = function () {
        alert("Audio not available for this reciter. Please try another.");
      };
      // Set the download URL and file name for the download button
      $("#download-button")
        .attr("href", audioUrl)
        .attr("download", audioFileName);
    }).fail(function (error) {
      alert("Failed to retrieve ayah. Please try again later.");
      console.error(error);
    });
  }

  // Assuming you have a button with id="download-button" in your HTML
  document
    .getElementById("download-button")
    .addEventListener("click", function () {
      const audioPlayer = document.getElementById("audioPlayer");
      window.open(audioPlayer.src, "_blank");
    });

  const surahNames = [
    "Al-Fatihah",
    "Al-Baqarah",
    "Ali 'Imran",
    "An-Nisa",
    "Al-Ma'idah",
    "Al-An'am",
    "Al-A'raf",
    "Al-Anfal",
    "At-Tawbah",
    "Yunus",
    "Hud",
    "Yusuf",
    "Ar-Ra'd",
    "Ibrahim",
    "Al-Hijr",
    "An-Nahl",
    "Al-Isra",
    "Al-Kahf",
    "Maryam",
    "Taha",
    "Al-Anbya",
    "Al-Hajj",
    "Al-Mu'minun",
    "An-Nur",
    "Al-Furqan",
    "Ash-Shu'ara",
    "An-Naml",
    "Al-Qasas",
    "Al-'Ankabut",
    "Ar-Rum",
    "Luqman",
    "As-Sajdah",
    "Al-Ahzab",
    "Saba",
    "Fatir",
    "Ya-Sin",
    "As-Saffat",
    "Sad",
    "Az-Zumar",
    "Ghafir",
    "Fussilat",
    "Ash-Shura",
    "Az-Zukhruf",
    "Ad-Dukhan",
    "Al-Jathiyah",
    "Al-Ahqaf",
    "Muhammad",
    "Al-Fath",
    "Al-Hujurat",
    "Qaf",
    "Adh-Dhariyat",
    "At-Tur",
    "An-Najm",
    "Al-Qamar",
    "Ar-Rahman",
    "Al-Waqi'ah",
    "Al-Hadid",
    "Al-Mujadilah",
    "Al-Hashr",
    "Al-Mumtahanah",
    "As-Saff",
    "Al-Jumu'ah",
    "Al-Munafiqun",
    "At-Taghabun",
    "At-Talaq",
    "At-Tahrim",
    "Al-Mulk",
    "Al-Qalam",
    "Al-Haqqah",
    "Al-Ma'arij",
    "Nuh",
    "Al-Jinn",
    "Al-Muzzammil",
    "Al-Muddaththir",
    "Al-Qiyamah",
    "Al-Insan",
    "Al-Mursalat",
    "An-Naba",
    "An-Nazi'at",
    "'Abasa",
    "At-Takwir",
    "Al-Infitar",
    "Al-Mutaffifin",
    "Al-Inshiqaq",
    "Al-Buruj",
    "At-Tariq",
    "Al-A'la",
    "Al-Ghashiyah",
    "Al-Fajr",
    "Al-Balad",
    "Ash-Shams",
    "Al-Layl",
    "Ad-Duha",
    "Ash-Sharh",
    "At-Tin",
    "Al-'Alaq",
    "Al-Qadr",
    "Al-Bayyinah",
    "Az-Zalzalah",
    "Al-'Adiyat",
    "Al-Qari'ah",
    "At-Takathur",
    "Al-'Asr",
    "Al-Humazah",
    "Al-Fil",
    "Quraysh",
    "Al-Ma'un",
    "Al-Kawthar",
    "Al-Kafirun",
    "An-Nasr",
    "Al-Masad",
    "Al-Ikhlas",
    "Al-Falaq",
    "An-Nas",
  ];

  function showBookmarks() {
    let bookmarkList = '<div class="space-y-2">';
    if (bookmarks.length === 0) {
      bookmarkList +=
        '<p class="text-center text-gray-500">No bookmarks available.</p>';
    } else {
      bookmarks.forEach((bookmark) => {
        const [surah, ayah] = bookmark.split(":");
        const surahName = surahNames[parseInt(surah) - 1];
        bookmarkList += `
              <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                  <div class="flex-grow">
                      <a href="#" class="load-bookmark text-blue-500 hover:text-blue-700" data-ayah="${bookmark}">
                          <i class="fas fa-bookmark mr-2"></i>${surahName} (${bookmark})
                      </a>
                      <p class="text-sm text-gray-500 dark:text-gray-400 ml-6">Surah ${surah}, Ayah ${ayah}</p>
                  </div>
                  <button class="delete-bookmark text-red-500 hover:text-red-700" data-ayah="${bookmark}">
                      <i class="fas fa-trash-alt"></i>
                  </button>
              </div>
          `;
      });
    }
    bookmarkList += "</div>";

    $("#bookmarkList").html(bookmarkList);
    $("#bookmarkModal").removeClass("hidden");
  }

  $("#show-bookmarks").click(showBookmarks);

  $("#closeBookmarkModal").click(function () {
    $("#bookmarkModal").addClass("hidden");
  });

  $("#hapus-bookmark-btn").click(function () {
    if (confirm("Are you sure you want to delete all bookmarks?")) {
      localStorage.removeItem("quranBookmarks-v1");
      bookmarks = [];
      showBookmarks();
      updateBookmarkButton();
    }
  });

  $(document).on("click", ".load-bookmark", function (e) {
    e.preventDefault();
    const [surah, ayah] = $(this).data("ayah").split(":");
    $("#surah-number").val(surah);
    $("#ayah-number").val(ayah);
    $("#generate-by-number").click();
    $("#bookmarkModal").addClass("hidden");
  });

  $(document).on("click", ".delete-bookmark", function (e) {
    e.preventDefault();
    const bookmarkToDelete = $(this).data("ayah");
    bookmarks = bookmarks.filter((bookmark) => bookmark !== bookmarkToDelete);
    localStorage.setItem("quranBookmarks-v1", JSON.stringify(bookmarks));
    showBookmarks();
    updateBookmarkButton();
  });

  $(document).on("click", ".load-bookmark", function (e) {
    e.preventDefault();
    const [surah, ayah] = $(this).data("ayah").split(":");
    $("#surah-number").val(surah);
    $("#ayah-number").val(ayah);
    $("#generate-by-number").click();
    $("#bookmarkModal").addClass("hidden");
  });

  function adjustFontSizes() {
    const container = document.querySelector("#quoteContainer");
    if (!container) {
      console.error("Element #quoteContainer not found");
      return;
    }

    const elements = container.querySelectorAll(
      "#quote-arabic, #quote-transliteration, #quote-translation, #quote-details"
    );

    elements.forEach((el) => {
      let fontSize = parseInt(window.getComputedStyle(el).fontSize);
      while (el.scrollHeight > el.offsetHeight && fontSize > 12) {
        fontSize--;
        el.style.fontSize = `${fontSize}px`;
      }
    });
  }

  function updateQuoteVisibility() {
    $("#quote-arabic").toggle(showArabic);
    $("#quote-transliteration").toggle(showTransliteration);
  }

  function updateArabicFont() {
    $("#quote-arabic").css(
      "font-family",
      `${selectedArabicFont}, KFGQPCUthmanic, hurufa, amiri, serif`
    );
  }

  $("#generate-quote").click(function () {
    const totalAyahs = 6236;
    const randomAyah = Math.floor(Math.random() * totalAyahs) + 1;
    const apiUrl = `https://api.alquran.cloud/v1/ayah/${randomAyah}/editions/quran-uthmani,id.indonesian,en.transliteration`;
    generateQuote(apiUrl);
  });

  $("#generate-by-number").click(function () {
    surahNumber = parseInt($("#surah-number").val());
    ayahNumber = parseInt($("#ayah-number").val());

    if (isNaN(surahNumber) || surahNumber <= 0 || surahNumber > 114) {
      alert("Please enter a valid surah number (1-114).");
      return;
    }

    if (isNaN(ayahNumber) || ayahNumber <= 0) {
      alert("Please enter a valid ayah number.");
      return;
    }

    const apiUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-uthmani,id.indonesian,en.transliteration`;
    generateQuote(apiUrl);
  });

  $("#save-screenshot").click(function () {
    const quoteContainer = document.querySelector("#quoteContainer");
    const originalStyle = quoteContainer.getAttribute("style");

    quoteContainer.style.width = "1080px";
    quoteContainer.style.height = "1920px";
    quoteContainer.style.overflow = "hidden";
    quoteContainer.style.padding = "20% 15%";

    const elements = quoteContainer.querySelectorAll(
      "#quote-arabic, #quote-transliteration, #quote-translation, #quote-details"
    );
    elements.forEach((el) => {
      const currentSize = window.getComputedStyle(el).fontSize;
      el.style.fontSize = `${parseFloat(currentSize) * 2}px`;
      el.style.lineHeight = "1.8";
      el.style.letterSpacing = "normal";
      el.style.wordSpacing = "normal";
    });

    setTimeout(() => {
      html2canvas(quoteContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 1080,
        height: 1920,
        windowWidth: 1080,
        windowHeight: 1920,
        onclone: function (clonedDoc) {
          clonedDoc.querySelector("#quoteContainer").style.transform =
            "scale(1)";
        },
      })
        .then((canvas) => {
          quoteContainer.setAttribute("style", originalStyle);
          elements.forEach((el) => {
            el.style.fontSize = "";
            el.style.lineHeight = "";
            el.style.letterSpacing = "";
            el.style.wordSpacing = "";
          });

          canvas.toBlob(
            function (blob) {
              saveAs(blob, `Surah_${surahNameLatin}_${surahNumber}.png`);
            },
            "image/png",
            1.0
          );
        })
        .catch((error) => {
          console.error("Error capturing screenshot:", error);
          quoteContainer.setAttribute("style", originalStyle);
          elements.forEach((el) => {
            el.style.fontSize = "";
            el.style.lineHeight = "";
            el.style.letterSpacing = "";
            el.style.wordSpacing = "";
          });
        });
    }, 500);
  });

  function populateQariDropdown() {
    const qariDropdown = $("#qari-dropdown");
    $.getJSON(
      "https://api.alquran.cloud/v1/edition/format/audio",
      function (data) {
        data.data.forEach((qari) => {
          qariDropdown.append(
            new Option(`${qari.englishName} (${qari.name})`, qari.identifier)
          );
        });
      }
    ).fail(function () {
      alert("Failed to retrieve qaris data.");
    });
  }

  $("#qari-dropdown").change(function () {
    selectedQari = $(this).val();
  });

  $("#toggle-random-bg").click(function () {
    randomBgEnabled = !randomBgEnabled;
    setRandomBackground();
    $(this).toggleClass("text-purple-500 text-red-500");
    $(this).find("i").toggleClass("fa-image fa-ban");
  });

  $("#toggle-arabic").click(function () {
    showArabic = !showArabic;
    updateQuoteVisibility();
    $(this).toggleClass("text-blue-500 text-red-500");
    $(this).find("i").toggleClass("fa-language fa-ban");
  });

  $("#toggle-transliteration").click(function () {
    showTransliteration = !showTransliteration;
    updateQuoteVisibility();
    $(this).toggleClass("text-green-500 text-red-500");
    $(this).find("i").toggleClass("fa-spell-check fa-ban");
  });

  $("#toggle-bookmark").click(toggleBookmark);

  $("#show-bookmarks").click(showBookmarks);

  $(document).on("click", ".load-bookmark", function (e) {
    e.preventDefault();
    const [surah, ayah] = $(this).data("ayah").split(":");
    $("#surah-number").val(surah);
    $("#ayah-number").val(ayah);
    $("#generate-by-number").click();
  });

  updateSettings();
  populateQariDropdown();
  setRandomBackground();
});
