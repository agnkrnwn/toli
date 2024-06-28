let asmaulHusna = [];
const backgroundCount = 95;

fetch('asset/data/asmaul-husna.json')
    .then(response => response.json())
    .then(data => {
        asmaulHusna = data;
    })
    .catch(error => console.error('Error fetching the JSON:', error));

function updateSearchLink(query) {
    const searchLink = document.getElementById('search-link');
    searchLink.href = `${(query)}`;
}

function generateQuote() {
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

    const randomBackgroundIndex = Math.floor(Math.random() * backgroundCount) + 1;
    document.getElementById('quote-box').style.backgroundImage = `url('asset/background/background${randomBackgroundIndex}.jpg')`;

    updateSearchLink(quote.url);
    hideDetail(); // Sembunyikan detail jika ada yang ditampilkan
}

function generateQuoteByNumber() {
    if (asmaulHusna.length === 0) {
        alert('Data belum dimuat, coba lagi nanti.');
        return;
    }

    const quoteNumber = parseInt(document.getElementById('quote-number-input').value);
    const quote = asmaulHusna.find(item => item.urutan === quoteNumber);

    if (!quote) {
        alert(`Quote dengan urutan ${quoteNumber} tidak ditemukan.`);
        return;
    }

    document.getElementById('quote-nomer').innerText = quote.urutan;
    document.getElementById('quote-arab').innerText = quote.arab;
    document.getElementById('quote-latin').innerText = quote.latin;
    document.getElementById('quote-arti').innerText = quote.arti;

    const randomBackgroundIndex = Math.floor(Math.random() * backgroundCount) + 1;
    document.getElementById('quote-box').style.backgroundImage = `url('asset/background/background${randomBackgroundIndex}.jpg')`;

    updateSearchLink(quote.url);
    hideDetail(); // Sembunyikan detail jika ada yang ditampilkan
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
    const quoteNumber = document.getElementById('quote-nomer').innerText;
    const quote = asmaulHusna.find(item => item.urutan === parseInt(quoteNumber));

    if (!quote) {
        alert(`Quote dengan urutan ${quoteNumber} tidak ditemukan.`);
        return;
    }
    document.getElementById('quote-judul').innerText = `No: ${quote.urutan} - ${quote.latin}`;
    document.getElementById('quote-content').innerText = `${quote.content || 'Tidak tersedia'}`;

    document.getElementById('quote-detail').style.display = 'block';
}

function hideDetail() {
    document.getElementById('quote-detail').style.display = 'none';
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
