$(document).ready(function () {
    let excludeArabic = true; // Default state for excluding Arabic text
  
    $("#generate-hadith").click(function () {
      getRandomHadith();
    });
  
    $("#toggle-arabic").click(function () {
      excludeArabic = !excludeArabic;
      $(this).toggleClass("bg-gray-700 bg-green-500", !excludeArabic);
      $(this).find("i").toggleClass("fa-eye-slash fa-eye");
    });
  
    $("#generate-custom").click(function () {
      const authorSlug = $("#hadith-author").val();
      const hadithNumber = $("#hadith-number").val();
  
      if (!authorSlug) {
        alert("Silakan pilih pencipta hadis.");
        return;
      }
  
      if (!hadithNumber) {
        alert("Silakan masukkan nomor hadis.");
        return;
      }
  
      const hadithPath = `asset/data/hadist/${authorSlug}.json`;
  
      $.getJSON(hadithPath, function (data) {
        const hadith = data.find((item) => item.number == hadithNumber);
  
        if (hadith) {
          const hadithText = excludeArabic
            ? ""
            : `<p class="arabic">${hadith.arab}</p>`;
          const hadithTranslation = `<p class="latin">${hadith.id}</p>`;
  
          $("#quote-text").html(`${hadithText}${hadithTranslation}`);
          $("#quote-reference").text(
            `${authorSlug.replace("-", " ")} - ${hadith.number}`
          );
        } else {
          alert("Hadith not found.");
        }
      }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching detailed Hadith:", textStatus, errorThrown);
        alert("Failed to fetch Hadith details. Please try again later.");
      });
    });
  
    $("#save-screenshot").click(function () {
      const quoteContainer = document.querySelector(".potrait-container");
  
      // Simpan ukuran asli dan style
      const originalStyle = quoteContainer.getAttribute("style");
      const originalWidth = quoteContainer.offsetWidth;
      const originalHeight = quoteContainer.offsetHeight;
  
      // Set ukuran tetap untuk capture
      quoteContainer.style.width = "1080px";
      quoteContainer.style.height = "1920px";
      quoteContainer.style.overflow = "hidden";
      quoteContainer.style.padding = "20% 15%"; // Sesuaikan dengan kebutuhan
  
      // Tunggu sebentar sebelum mengambil screenshot
      setTimeout(() => {
        html2canvas(quoteContainer, {
          scale: 2, // Sesuaikan dengan kebutuhan
          useCORS: true,
          allowTaint: true,
          width: 1080,
          height: 1920,
          windowWidth: 1080,
          windowHeight: 1920,
          onclone: function (clonedDoc) {
            // Sesuaikan transformasi atau style lain jika diperlukan
            const quoteBox = clonedDoc.querySelector(".potrait-container");
            if (quoteBox) {
              quoteBox.style.transform = "scale(1)";
              // Sesuaikan style lain jika perlu
            }
          },
        })
          .then((canvas) => {
            // Kembalikan ukuran dan style ke semula
            quoteContainer.setAttribute("style", originalStyle);
  
            // Simpan sebagai blob dan download
            canvas.toBlob(
              function (blob) {
                saveAs(blob, `Hadith_${Date.now()}.png`);
              },
              "image/png",
              1.0
            );
          })
          .catch(function (error) {
            console.error("html2canvas error:", error);
            // Kembalikan ukuran dan style ke semula jika terjadi error
            quoteContainer.setAttribute("style", originalStyle);
          });
      }, 500);
    });
  
    function getRandomHadith() {
      const authors = [
        "abu-dawud",
        "ahmad",
        "bukhari",
        "ibnu-majah",
        "malik",
        "nasai",
        "tirmidzi",
      ];
  
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      const hadithPath = `asset/data/hadist/${randomAuthor}.json`;
  
      $.getJSON(hadithPath, function (data) {
        if (data && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const randomHadith = data[randomIndex];
  
          const hadithText = excludeArabic
            ? ""
            : `<p class="arabic">${randomHadith.arab}</p>`;
          const hadithTranslation = `<p class="latin">${randomHadith.id}</p>`;
  
          $("#quote-text").html(`${hadithText}${hadithTranslation}`);
          $("#quote-reference").text(
            `${randomAuthor.replace("-", " ")} - ${randomHadith.number}`
          );
  
          adjustFontSize();
          setRandomBackground();
        } else {
          console.error("Empty response from JSON or invalid format:", data);
          alert("Failed to fetch Hadith. Please try again later.");
        }
      }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching Hadith:", textStatus, errorThrown);
        alert("Failed to fetch Hadith. Please try again later.");
      });
    }
  
    function adjustFontSize() {
      const quoteBox = $(".quote-box");
      const maxFontSize = 28;
      let fontSize = maxFontSize;
  
      do {
        quoteBox.css("font-size", `${fontSize}px`);
        fontSize--;
      } while (quoteBox.height() > quoteBox.parent().height() && fontSize > 12);
    }
  
    function setRandomBackground() {
      const backgrounds = [];
      for (let i = 1; i <= 5; i++) {
        backgrounds.push(`url('asset/background/background${i}.jpg')`);
      }
  
      const randomBackground =
        backgrounds[Math.floor(Math.random() * backgrounds.length)];
      $(".potrait-container").css("background-image", randomBackground);
      $(".potrait-container").css("background-size", "cover");
      $(".potrait-container").css("background-position", "center");
    }
  
    setRandomBackground();
    getRandomHadith();
  });
  