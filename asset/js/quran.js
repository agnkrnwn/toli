$(document).ready(function() {
  let surahNameLatin = '';
  let surahNumber = '';
  let ayahNumber = '';

  function adjustFontSize() {
    const quoteBox = $('#quote');
    const quoteTextElements = $('#quote-arabic, #quote-transliteration, #quote-translation, #quote-details');
    let fontSize = parseInt(quoteTextElements.css('font-size'));

    while (quoteBox[0].scrollHeight > quoteBox.height() && fontSize > 12) {
      fontSize -= 1;
      quoteTextElements.css('font-size', fontSize + 'px');
    }
  }

  // Function to set random background
  const backgrounds = [];
  for (let i = 1; i <= 95; i++) {
    backgrounds.push(`asset/background/background${i}.jpg`);
  }

  function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    $('.potrait').css('background-image', `url('${backgrounds[randomIndex]}')`);
  }

  // Function to get the number of ayahs in a surah
  function getSurahDetails(surahNumber) {
    return new Promise((resolve, reject) => {
      const apiUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani`;
      $.getJSON(apiUrl, function(data) {
        const totalAyahs = data.data.numberOfAyahs;
        resolve(totalAyahs);
      }).fail(function() {
        reject('Failed to retrieve surah details.');
      });
    });
  }

  // Event handler when "Generate Random Ayah" button is clicked
  $('#generate-quote').click(function() {
    setRandomBackground(); // Call function to set random background

    const totalAyahs = 6236;  // Total number of Ayahs in the Quran
    const ayahNumber = Math.floor(Math.random() * totalAyahs) + 1;
    const apiUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,id.indonesian,en.transliteration`;

    $.getJSON(apiUrl, function(data) {
      const arabicText = data.data[0].text;
      const translationText = data.data[1].text;
      const transliterationText = data.data[2].text;
      const surahNameArabic = data.data[0].surah.name;
      surahNameLatin = data.data[0].surah.englishName;
      surahNumber = data.data[0].surah.number;
      const ayahInSurah = data.data[0].numberInSurah;

      $('#quote-details').html(`Surah <strong>${surahNameArabic}</strong> (<em>${surahNameLatin}</em>) - ${surahNumber}:${ayahInSurah}`);
      $('#quote-arabic').text(arabicText);
      $('#quote-transliteration').text(transliterationText);
      $('#quote-translation').text(translationText);

      adjustFontSize(); // Adjust font size after setting the text
    }).fail(function(error) {
      alert('Failed to retrieve ayah. Please try again later.');
      console.error(error);
    });
  });

  // Event handler when "Generate by Number" button is clicked
  $('#generate-by-number').click(function() {
    setRandomBackground(); // Call function to set random background

    surahNumber = $('#surah-number').val();
    ayahNumber = $('#ayah-number').val();

    // Check the number of ayahs in the selected surah
    getSurahDetails(surahNumber).then(function(totalAyahs) {
      if (ayahNumber > totalAyahs || ayahNumber <= 0) {
        alert(`Surah ${surahNumber} only has ${totalAyahs} ayah(s). Please enter a valid ayah number.`);
      } else {
        const apiUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-uthmani,id.indonesian,en.transliteration`;

        $.getJSON(apiUrl, function(data) {
          const arabicText = data.data[0].text;
          const translationText = data.data[1].text;
          const transliterationText = data.data[2].text;
          const surahNameArabic = data.data[0].surah.name;
          surahNameLatin = data.data[0].surah.englishName;
          const ayahInSurah = data.data[0].numberInSurah;

          $('#quote-details').html(`Surah <strong>${surahNameArabic}</strong> (<em>${surahNameLatin}</em>) - ${surahNumber}:${ayahInSurah}`);
          $('#quote-arabic').text(arabicText);
          $('#quote-transliteration').text(transliterationText);
          $('#quote-translation').text(translationText);

          adjustFontSize(); // Adjust font size after setting the text
        }).fail(function(error) {
          alert('gagal bro ayatnya kebanyakan kurangi.');
          console.error(error);
        });
      }
    }).catch(function(error) {
      alert('gagal bro cuman 114 surah dalam quran');
      console.error(error);
    });
  });

  // Event handler when "Save as Image" button is clicked
  $('#save-screenshot').click(function() {
    html2canvas(document.querySelector('.potrait'), { scale: 2 }).then(canvas => {
      canvas.toBlob(function(blob) {
        saveAs(blob, `Surah_${surahNameLatin}_${surahNumber}.png`);
      });
    });
  });
});


