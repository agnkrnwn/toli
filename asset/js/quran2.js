$(document).ready(function () {
  let surahNameLatin = '';
  let surahNumber = '';
  let ayahNumber = '';
  let randomBgEnabled = true;
  let selectedQari = 'ar.alafasy'; // Default qari

  // Adjust font size function
  function adjustFontSize() {
    const quoteBox = $('#quote');
    const quoteTextElements = $('#quote-arabic, #quote-transliteration, #quote-translation, #quote-details');
    let fontSize = parseInt(quoteTextElements.css('font-size'));

    while (quoteBox[0].scrollHeight > quoteBox.height() && fontSize > 12) {
      fontSize -= 1;
      quoteTextElements.css('font-size', fontSize + 'px');
    }
  }

  // Backgrounds setup
  const backgrounds = [];
  for (let i = 1; i <= 95; i++) {
    backgrounds.push(`asset/background/background${i}.jpg`);
  }

  // Set random background function
  function setRandomBackground() {
    if (randomBgEnabled) {
      const randomIndex = Math.floor(Math.random() * backgrounds.length);
      $('.potrait').css('background-image', `url('${backgrounds[randomIndex]}')`);
    }
  }

  // Toggle random background
  $('#toggle-random-bg').click(function () {
    randomBgEnabled = !randomBgEnabled;
    if (randomBgEnabled) {
      setRandomBackground();
      $(this).removeClass('btn-danger').addClass('btn-success').html('<i class="material-icons">autorenew</i>');
    } else {
      $('.potrait').css('background-image', 'none');
      $(this).removeClass('btn-success').addClass('btn-danger').html('<i class="material-icons">block</i>');
    }
  });

  // Generate quote
  $('#generate-quote').click(function () {
    setRandomBackground();

    const totalAyahs = 6236;
    ayahNumber = Math.floor(Math.random() * totalAyahs) + 1;
    const apiUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,id.indonesian,en.transliteration`;

    $.getJSON(apiUrl, function (data) {
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

      adjustFontSize();

      const audioPlayer = document.getElementById('audioPlayer');
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedQari}/${ayahNumber}.mp3`;

      audioPlayer.src = audioUrl;
      audioPlayer.load();
      audioPlayer.play();

      const audioTitle = ` ${selectedQari} : ${surahNameLatin} (${surahNumber}:${ayahInSurah}) - ${ayahNumber}.mp3`;
      $('#audio-title').text(audioTitle);
      const qariah = `Reciter: ${selectedQari}`;
      $('#qari-title').text(qariah);


      console.log("Audio loaded and playing:", audioUrl);

      audioPlayer.onerror = function () {
        alert('Qori / pembaca Quran tidak tersedia, silakan ganti yang lain.');
      };
    }).fail(function (error) {
      alert('Failed to retrieve ayah. Please try again later.');
      console.error(error);
    });
  });

  $('#generate-by-number').click(function () {
    setRandomBackground();

    surahNumber = parseInt($('#surah-number').val());
    ayahNumber = parseInt($('#ayah-number').val());

    if (isNaN(surahNumber) || surahNumber <= 0 || surahNumber > 114) {
      alert('Please enter a valid surah number (1-114).');
      return;
    }

    if (isNaN(ayahNumber) || ayahNumber <= 0) {
      alert('Please enter a valid ayah number.');
      return;
    }

    getGlobalAyahNumber(surahNumber, ayahNumber)
      .then(globalAyahNumber => {
        const apiUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-uthmani,id.indonesian,en.transliteration`;

        fetchAyahDataAndPlayAudio(apiUrl, globalAyahNumber);
      })
      .catch(error => {
        console.error("Error fetching global ayah number:", error);
        alert('Failed to calculate the global ayah number. Please try again later.');
      });
  });

  function getGlobalAyahNumber(surahNumber, ayahNumber) {
    return new Promise((resolve, reject) => {
      $.getJSON('https://api.alquran.cloud/v1/meta', function (data) {
        let globalAyahNumber = 0;

        for (let i = 0; i < surahNumber - 1; i++) {
          globalAyahNumber += data.data.surahs.references[i].numberOfAyahs;
        }
        globalAyahNumber += ayahNumber;

        resolve(globalAyahNumber);
      }).fail(function () {
        reject('Failed to retrieve meta data.');
      });
    });
  }

  function fetchAyahDataAndPlayAudio(apiUrl, globalAyahNumber) {
    $.getJSON(apiUrl, function (data) {
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

      adjustFontSize();

      const audioPlayer = document.getElementById('audioPlayer');
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedQari}/${globalAyahNumber}.mp3`;

      audioPlayer.src = audioUrl;
      audioPlayer.load();
      audioPlayer.play();

      const audioTitle = `${selectedQari} : ${surahNameLatin} (${surahNumber}:${ayahInSurah}) - ${globalAyahNumber}.mp3`;
      $('#audio-title').text(audioTitle);
      const qariah = `Reciter: ${selectedQari}`;
      $('#qari-title').text(qariah);

      console.log("Audio URL:", audioUrl);

      audioPlayer.onerror = function () {
        alert('Qori / pembaca Quran tidak tersedia, silakan ganti yang lain.');
      };
    }).fail(function (error) {
      alert('Failed to retrieve ayah. Please try again later.');
      console.error(error);
    });
  }

  $('#save-screenshot').click(function () {
    html2canvas(document.querySelector('.potrait'), { scale: 2 }).then(canvas => {
      canvas.toBlob(function (blob) {
        saveAs(blob, `Surah_${surahNameLatin}_${surahNumber}.png`);
      });
    });
  });

  // Fetch qaris data and populate dropdown
  function populateQariDropdown() {
    const qariDropdown = $('#qari-dropdown');
    $.getJSON('https://api.alquran.cloud/v1/edition/format/audio', function (data) {
      data.data.forEach(qari => {
        qariDropdown.append(new Option(`${qari.englishName} (${qari.name})`, qari.identifier));
      });
    }).fail(function () {
      alert('Failed to retrieve qaris data.');
    });
  }

  $('#qari-dropdown').change(function () {
    selectedQari = $(this).val();
  });

  populateQariDropdown();


});
