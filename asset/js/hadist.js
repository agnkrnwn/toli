$(document).ready(function() {
  // Event listener for generate-hadith button click
  $('#generate-hadith').click(function() {
    getRandomHadith();
  });

  // Event listener for generate-custom button click
  $('#generate-custom').click(function() {
    const authorSlug = $('#hadith-author').val();
    const hadithNumber = $('#hadith-number').val();

    if (!authorSlug) {
      alert('Silakan pilih pencipta hadis.');
      return;
    }

    if (!hadithNumber) {
      alert('Silakan masukkan nomor hadis.');
      return;
    }

    const apiUrl = `https://hadis-api-id.vercel.app/hadith/${authorSlug}/${hadithNumber}`;

    $.getJSON(apiUrl, function(data) {
      const hadithText = data.arab; // Teks hadis dalam bahasa Arab
      const hadithTranslation = data.id; // Teks terjemahan hadis

      // Update HTML elements with retrieved data
      $('#quote-text').html(`<p>${hadithText}</p><p>${hadithTranslation}</p>`);
      $('#quote-reference').text(`${data.name} - ${data.number}`);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.error('Error fetching detailed Hadith:', textStatus, errorThrown);
      alert('Failed to fetch Hadith details. Please try again later.');
    });
  });

  // Event listener for save-screenshot button click
  $('#save-screenshot').click(function() {
    html2canvas(document.querySelector('.potrait'), { scale: 2 }).then(canvas => {
      canvas.toBlob(function(blob) {
        saveAs(blob, `Hadith_${Date.now()}.png`);
      });
    });
  });

  // Function to get a random hadith
  function getRandomHadith() {
    const apiUrl = 'https://hadis-api-id.vercel.app/hadith';

    // Request random hadith from API
    $.getJSON(apiUrl, function(response) {
      if (response && response.length > 0) {
        // Pick a random hadith from the response
        const randomIndex = Math.floor(Math.random() * response.length);
        const randomHadith = response[randomIndex];

        // Fetch full details of the random hadith
        const hadithNumber = randomHadith.total > 1 ? Math.floor(Math.random() * randomHadith.total) + 1 : 1;
        const hadithUrl = `https://hadis-api-id.vercel.app/hadith/${randomHadith.slug}/${hadithNumber}`;

        $.getJSON(hadithUrl, function(data) {
          const hadithText = data.arab;
          const hadithTranslation = data.id; // Teks terjemahan

          // Update the HTML elements with the retrieved data
          $('#quote-text').html(`<p>${hadithText}</p><p>${hadithTranslation}</p>`);
          $('#quote-reference').text(`${data.name} - ${data.number}`);

          adjustFontSize(); // Adjust font size after setting the text
          setRandomBackground();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          console.error('Error fetching detailed Hadith:', textStatus, errorThrown);
          alert('Failed to fetch Hadith details. Please try again later.');
        });
      } else {
        console.error('Empty response from API or invalid format:', response);
        alert('Failed to fetch Hadith. Please try again later.');
      }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.error('Error fetching Hadith:', textStatus, errorThrown);
      alert('Failed to fetch Hadith. Please try again later.');
    });
  }

  // Function to adjust font size based on text length
  function adjustFontSize() {
    const quoteBox = $('#quote');
    const quoteText = $('#quote-text');
    let fontSize = parseInt(quoteText.css('font-size'));

    while (quoteBox[0].scrollHeight > quoteBox.height() && fontSize > 10) {
      fontSize -= 1;
      quoteText.css('font-size', fontSize + 'px');
    }
  }

  // Array to store background image URLs
  const backgrounds = [];

  // Populate array with background image URLs
  for (let i = 1; i <= 95; i++) {
    backgrounds.push(`asset/background/background${i}.jpg`);
  }

  // Function to set a random background
  function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    $('.potrait').css('background-image', `url('${backgrounds[randomIndex]}')`);
  }

  setRandomBackground(); // Set initial random background

});