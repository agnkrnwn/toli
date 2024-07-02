let asmaulHusna = [];
const backgroundCount = 95;

fetch('../../asset/data/asmaul/asmaul-husna.json')
    .then(response => response.json())
    .then(data => {
        asmaulHusna = data;
    })
    .catch(error => console.error('Error fetching the JSON:', error));

function updateSearchLink(query) {
    const searchLink = document.getElementById('search-link');
    searchLink.href = `${(query)}`;
}

function setBackground() {
    const randomBackgroundIndex = Math.floor(Math.random() * backgroundCount) + 1;
    const backgroundUrl = `../../asset/background/background${randomBackgroundIndex}.jpg`;
    console.log("Attempting to set background:", backgroundUrl);
    
    const img = new Image();
    img.onload = function() {
        document.getElementById('quote-box').style.backgroundImage = `url('${backgroundUrl}')`;
        console.log("Background set successfully");
    };
    img.onerror = function() {
        console.error("Failed to load background image:", backgroundUrl);
    };
    img.src = backgroundUrl;
}

function generateQuote() {
    console.log("generateQuote called");
    if (asmaulHusna.length === 0) {
        alert('Data belum dimuat, coba lagi nanti.');
        return;
    }

    const randomIndex = Math.floor(Math.random() * asmaulHusna.length);
    const quote = asmaulHusna[randomIndex];

    document.getElementById('quote-nomer').innerText = quote.urutan;
    document.getElementById('quote-arab').innerText = quote.arab;
    document.getElementById('quote-latin').innerText = quote.latin;
    document.getElementById('quote-arti').innerText = quote.arti;

    setBackground();

    updateSearchLink(quote.url);
    hideDetail();
}

function generateQuoteByNumber() {
    console.log("generateQuoteByNumber called");
    if (asmaulHusna.length === 0) {
        alert('Data belum dimuat, coba lagi nanti.');
        return;
    }

    const quoteNumber = parseInt(document.getElementById('quote-number-input').value);
    console.log("Quote number:", quoteNumber);
    const quote = asmaulHusna.find(item => item.urutan === quoteNumber);

    if (!quote) {
        alert(`Quote dengan urutan ${quoteNumber} tidak ditemukan.`);
        return;
    }

    document.getElementById('quote-nomer').innerText = quote.urutan;
    document.getElementById('quote-arab').innerText = quote.arab;
    document.getElementById('quote-latin').innerText = quote.latin;
    document.getElementById('quote-arti').innerText = quote.arti;

    setBackground();

    updateSearchLink(quote.url);
    hideDetail();
}

function downloadQuote() {
    const quoteBox = document.getElementById('quote-box');
    html2canvas(quoteBox).then(canvas => {
        const quoteNumber = document.getElementById('quote-nomer').innerText;
        const quote = asmaulHusna.find(item => item.urutan === parseInt(quoteNumber));

        if (!quote) {
            console.error(`Quote dengan urutan ${quoteNumber} tidak ditemukan.`);
            return;
        }

        const link = document.createElement('a');
        link.download = `${quote.urutan}_${quote.latin.replace(/\s/g, '_')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

function showDetail() {
    console.log("showDetail called");
    const quoteNumber = document.getElementById('quote-nomer').innerText;
    const quote = asmaulHusna.find(item => item.urutan === parseInt(quoteNumber));

    if (!quote) {
        alert(`Quote dengan urutan ${quoteNumber} tidak ditemukan.`);
        return;
    }
    document.getElementById('quote-judul').innerText = `No: ${quote.urutan} - ${quote.latin}`;
    document.getElementById('quote-content').innerText = `${quote.content || 'Tidak tersedia'}`;

    $('#quoteModal').modal('show');
}

function hideDetail() {
    console.log('Trying to hide detail');
    const quoteModal = document.getElementById('quoteModal');
    if (quoteModal) {
        $(quoteModal).modal('hide');
        console.log('Modal hidden');
    } else {
        console.log('quoteModal element not found');
    }
}

function copyDetail() {
    const quoteArtilengkap = document.getElementById('quote-content').innerText;

    const detailText = `${quoteArtilengkap}`;

    navigator.clipboard.writeText(detailText).then(() => {
        alert('Detail disalin ke clipboard!');
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
}

// Initialize modal when document is ready
$(document).ready(function(){
    $('#quoteModal').modal({
        show: false
    });
});