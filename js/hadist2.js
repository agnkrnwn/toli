$(document).ready(function() {
    let excludeArabic = true; // Default state for excluding Arabic text
  
    // Event listener for generate-hadith button click
    $('#generate-hadith').click(function() {
      getRandomHadith();
    });
  
    // Event listener for toggle Arabic button click
    $('#toggle-arabic').click(function() {
      excludeArabic = !excludeArabic;
      $(this).toggleClass('off', excludeArabic);
      $(this).find('i').text(excludeArabic ? 'visibility_off' : 'visibility');
      $(this).find('span').text(excludeArabic ? 'Include Arabic' : 'Exclude Arabic');
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
  
      const hadithPath = `../../asset/data/hadist/${authorSlug}.json`;
  
      $.getJSON(hadithPath, function(data) {
        const hadith = data.find(item => item.number == hadithNumber);
  
        if (hadith) {
          const hadithText = excludeArabic ? '' : `<p>${hadith.arab}</p>`;
          const hadithTranslation = `<p>${hadith.id}</p>`;
  
          // Update HTML elements with retrieved data
          $('#quote-text').html(`${hadithText}${hadithTranslation}`);
          $('#quote-reference').text(`${authorSlug.replace('-', ' ')} - ${hadith.number}`);
        } else {
          alert('Hadith not found.');
        }
      }).fail(function(jqXHR, textStatus, errorThrown) {
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
      const authors = [
        'abu-dawud', 'ahmad', 'bukhari', 'ibnu-majah', 'malik', 'nasai', 'tirmidzi'
      ];
  
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      const hadithPath = `../../asset/data/hadist/${randomAuthor}.json`;
  
      $.getJSON(hadithPath, function(data) {
        if (data && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const randomHadith = data[randomIndex];
  
          const hadithText = excludeArabic ? '' : `<p>${randomHadith.arab}</p>`;
          const hadithTranslation = `<p>${randomHadith.id}</p>`;
  
          // Update the HTML elements with the retrieved data
          $('#quote-text').html(`${hadithText}${hadithTranslation}`);
          $('#quote-reference').text(`${randomAuthor.replace('-', ' ')} - ${randomHadith.number}`);
  
          adjustFontSize(); // Adjust font size after setting the text
          setRandomBackground();
        } else {
          console.error('Empty response from JSON or invalid format:', data);
          alert('Failed to fetch Hadith. Please try again later.');
        }
      }).fail(function(jqXHR, textStatus, errorThrown) {
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
      backgrounds.push(`../../asset/background/background${i}.jpg`);
    }
  
    // Function to set a random background
    function setRandomBackground() {
      const randomIndex = Math.floor(Math.random() * backgrounds.length);
      $('.potrait').css('background-image', `url('${backgrounds[randomIndex]}')`);
    }
  });
  