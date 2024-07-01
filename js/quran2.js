$(document).ready(function () {
  let surahNameLatin = "";
  let surahNumber = "";
  let ayahNumber = "";
  let randomBgEnabled = true;
  let selectedQari = "ar.alafasy"; // Default qari
  let showArabic = true;
  let showTransliteration = true;

  const backgrounds = [];
  for (let i = 1; i <= 95; i++) {
    backgrounds.push(`../../asset/background/background${i}.jpg`);
  }

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
    }
    console.log(
      "Background set:",
      $("#quoteContainer").css("background-image")
    );
  }

  $("#toggle-random-bg").click(function () {
    randomBgEnabled = !randomBgEnabled;
    setRandomBackground();
    $(this).toggleClass("bg-purple-500 bg-red-500");
    $(this).html(
      randomBgEnabled
        ? '<i class="fas fa-image mr-2"></i> Disable BG'
        : '<i class="fas fa-image mr-2"></i> Enable BG'
    );
  });

  function generateQuote(apiUrl) {
    setRandomBackground();

    $.getJSON(apiUrl, function (data) {
      const arabicText = data.data[0].text;
      const translationText = data.data[1].text;
      const transliterationText = data.data[2].text;
      const surahNameArabic = data.data[0].surah.name;
      surahNameLatin = data.data[0].surah.englishName;
      surahNumber = data.data[0].surah.number;
      const ayahInSurah = data.data[0].numberInSurah;

      $("#quote-details").html(
        `Surah <strong>${surahNameArabic}</strong> (<em>${surahNameLatin}</em>) - ${surahNumber}:${ayahInSurah}`
      );
      $("#quote-arabic").text(arabicText);
      $("#quote-transliteration").text(transliterationText);
      $("#quote-translation").text(translationText);

      updateQuoteVisibility();
      adjustFontSizes();

      const audioPlayer = document.getElementById("audioPlayer");
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedQari}/${data.data[0].number}.mp3`;

      audioPlayer.src = audioUrl;
      audioPlayer.load();
      audioPlayer.play();

      const audioTitle = `${selectedQari} : ${surahNameLatin} (${surahNumber}:${ayahInSurah})`;
      $("#audio-title").text(audioTitle);

      console.log("Audio loaded and playing:", audioUrl);

      audioPlayer.onerror = function () {
        alert("Audio not available for this reciter. Please try another.");
      };
    }).fail(function (error) {
      alert("Failed to retrieve ayah. Please try again later.");
      console.error(error);
    });
  }

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

  $("#generate-quote").click(function () {
    const totalAyahs = 6236;
    ayahNumber = Math.floor(Math.random() * totalAyahs) + 1;
    const apiUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,id.indonesian,en.transliteration`;
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

    // Simpan ukuran asli
    const originalStyle = quoteContainer.getAttribute("style");

    // Set ukuran tetap untuk capture
    quoteContainer.style.width = "1080px";
    quoteContainer.style.height = "1920px";
    quoteContainer.style.overflow = "hidden";
    quoteContainer.style.padding = "20% 15%"; // Tambahkan padding yang lebih besar

    // Sesuaikan ukuran font
    const elements = quoteContainer.querySelectorAll(
      "#quote-arabic, #quote-transliteration, #quote-translation, #quote-details"
    );
    elements.forEach((el) => {
      const currentSize = window.getComputedStyle(el).fontSize;
      el.style.fontSize = `${parseFloat(currentSize) * 2}px`; // Sesuaikan faktor perbesaran
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
          // Kembalikan ukuran dan style ke semula
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

  // Fungsi baru untuk mengupdate visibilitas quote
  function updateQuoteVisibility() {
    $("#quote-arabic").toggle(showArabic);
    $("#quote-transliteration").toggle(showTransliteration);
  }

  // Toggle untuk Arabic text
  $("#toggle-arabic").click(function () {
    showArabic = !showArabic;
    updateQuoteVisibility();
    $(this).toggleClass("bg-blue-500 bg-red-500");
    $(this).html(
      showArabic
        ? '<i class="fas fa-language mr-2"></i> Hide Arabic'
        : '<i class="fas fa-language mr-2"></i> Show Arabic'
    );
  });

  // Toggle untuk Transliteration
  $("#toggle-transliteration").click(function () {
    showTransliteration = !showTransliteration;
    updateQuoteVisibility();
    $(this).toggleClass("bg-green-500 bg-red-500");
    $(this).html(
      showTransliteration
        ? '<i class="fas fa-spell-check mr-2"></i> Hide Transliteration'
        : '<i class="fas fa-spell-check mr-2"></i> Show Transliteration'
    );
  });

  populateQariDropdown();
  setRandomBackground();
});
