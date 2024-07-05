let asmaulHusna = [];
const backgroundCount = 95;

fetch('../../asset/data/asmaul/asmaul-husna.json')
    .then(response => response.json())
    .then(data => {
        asmaulHusna = data;
        generateQuote();
    })
    .catch(error => console.error('Error fetching the JSON:', error));

function updateSearchLink(query) {
    document.getElementById('search-link').href = `${query}`;
}

function setBackground() {
    const randomBackgroundIndex = Math.floor(Math.random() * backgroundCount) + 1;
    document.getElementById('quote-box').style.backgroundImage = `url('../../asset/background/background${randomBackgroundIndex}.jpg')`;
}

function generateQuote() {
    if (asmaulHusna.length === 0) {
       // alert('Data belum dimuat, coba lagi nanti.');
        return;
    }

    const randomIndex = Math.floor(Math.random() * asmaulHusna.length);
    const quote = asmaulHusna[randomIndex];

    updateQuoteDisplay(quote);
    setBackground();
    updateSearchLink(quote.url);
    hideDetail();
}

function generateQuoteByNumber() {
    if (asmaulHusna.length === 0) {
       // alert('Data belum dimuat, coba lagi nanti.');
        return;
    }

    const quoteNumber = parseInt(document.getElementById('quote-number-input').value);
    const quote = asmaulHusna.find(item => item.urutan === quoteNumber);

    if (!quote) {
        alert(`Quote dengan urutan ${quoteNumber} tidak ditemukan.`);
        return;
    }

    updateQuoteDisplay(quote);
    setBackground();
    updateSearchLink(quote.url);
    hideDetail();
}

function updateQuoteDisplay(quote) {
    document.getElementById('quote-nomer').innerText = quote.urutan;
    document.getElementById('quote-arab').innerText = quote.arab;
    document.getElementById('quote-latin').innerText = quote.latin;
    document.getElementById('quote-arti').innerText = quote.arti;
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

async function downloadQuote() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1440;

    // Background
    const backgroundUrl = document.getElementById('quote-box').style.backgroundImage.slice(4, -1).replace(/"/g, "");
    try {
        const backgroundImg = await loadImage(backgroundUrl);
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    } catch (error) {
        console.error("Error loading background image:", error);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(0,0,0,0.3)");
    gradient.addColorStop(1, "rgba(0,0,0,0.6)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text settings
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const padding = canvas.width * 0.05;
    const contentWidth = canvas.width - (padding * 2);
    const centerY = canvas.height / 2;

    // Title
    // Anda dapat menyesuaikan ukuran font dan posisi vertikal di sini
    ctx.font = "bold 40px Readex Pro"; // Diperkecil dari 48px
    ctx.fillText("أسماء الله الحسنى", canvas.width / 2, padding + 20);

    // Number
    // Sesuaikan ukuran font dan offset dari centerY untuk mengubah posisi
    ctx.font = "bold 150px Poppins"; // Diperkecil dari 180px
    ctx.fillText(document.getElementById('quote-nomer').innerText, canvas.width / 2, centerY - 250);

    // Arabic
    // Sesuaikan ukuran font dan offset dari centerY untuk mengubah posisi
    ctx.font = "bold 140px Readex Pro"; // Diperkecil dari 160px
    ctx.fillText(document.getElementById('quote-arab').innerText, canvas.width / 2, centerY - 100);

    // Latin
    // Sesuaikan ukuran font dan offset dari centerY untuk mengubah posisi
    ctx.font = "bold 60px Poppins"; // Diperkecil dari 72px
    const latin = document.getElementById('quote-latin').innerText;
    ctx.fillText(latin, canvas.width / 2, centerY + 50);

    // Meaning
    // Sesuaikan ukuran font, offset dari centerY, dan lineHeight untuk mengubah posisi dan spacing
    ctx.font = "40px Poppins"; // Diperkecil dari 48px
    const arti = document.getElementById('quote-arti').innerText;
    wrapText(ctx, arti, canvas.width / 2, centerY + 150, contentWidth, 50); // lineHeight dikurangi menjadi 50

    // Download image
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `asmaul_husna_${document.getElementById('quote-nomer').innerText}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    });
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testY = y;

    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, testY);
            line = words[n] + ' ';
            testY += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, testY);
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

    document.getElementById('quoteModal').classList.remove('hidden');
    document.getElementById('quoteModal').classList.add('flex');
}

function hideDetail() {
    document.getElementById('quoteModal').classList.add('hidden');
    document.getElementById('quoteModal').classList.remove('flex');
}

function copyDetail() {
    const quoteArtilengkap = document.getElementById('quote-content').innerText;
    navigator.clipboard.writeText(quoteArtilengkap)
        .then(() => alert('Detail disalin ke clipboard!'))
        .catch(err => console.error('Error copying text: ', err));
}

let favorites = JSON.parse(localStorage.getItem('favorites-v1')) || [];

function toggleFavorite() {
    const currentQuote = getCurrentQuote();
    const index = favorites.findIndex(f => f.urutan === currentQuote.urutan);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(currentQuote);
    }
    localStorage.setItem('favorites-v1', JSON.stringify(favorites));
    updateFavoriteButton();
}

function updateFavoriteButton() {
    const btn = document.getElementById('favoriteBtn');
    const currentQuote = getCurrentQuote();
    if (favorites.some(f => f.urutan === currentQuote.urutan)) {
        btn.innerHTML = '<i class="fas fa-star mr-2"></i>';
        btn.classList.add('bg-yellow-600');
    } else {
        btn.innerHTML = '<i class="far fa-star mr-2"></i>';
        btn.classList.remove('bg-yellow-600');
    }
}

function getCurrentQuote() {
    const quoteNumber = parseInt(document.getElementById('quote-nomer').innerText);
    return asmaulHusna.find(item => item.urutan === quoteNumber);
}

function showHome() {
    generateQuote();
}

function showFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="text-lg">Belum ada favorit yang ditambahkan.</p>';
    } else {
        favorites.forEach(fav => {
            const favItem = document.createElement('div');
            favItem.className = 'bg-gray-200 dark:bg-gray-700 p-4 rounded-lg';
            favItem.innerHTML = `
                <h3 class="text-xl font-bold">${fav.urutan}. ${fav.latin}</h3>
                <p class="text-lg">${fav.arab}</p>
                <p class="text-md">${fav.arti}</p>
                <button onclick="removeFavorite(${fav.urutan})" class="mt-2 bg-red-500 text-white rounded px-3 py-1">Hapus dari Favorit</button>
            `;
            favoritesList.appendChild(favItem);
        });
    }

    document.getElementById('favoritesModal').classList.remove('hidden');
    document.getElementById('favoritesModal').classList.add('flex');
}

function hideFavorites() {
    document.getElementById('favoritesModal').classList.add('hidden');
    document.getElementById('favoritesModal').classList.remove('flex');
}

function removeFavorite(urutan) {
    favorites = favorites.filter(fav => fav.urutan !== urutan);
    localStorage.setItem('favorites-v1', JSON.stringify(favorites));
    showFavorites();
    updateFavoriteButton();
}

function showSettings() {
    
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
}

document.addEventListener('DOMContentLoaded', function() {
    generateQuote();
    updateFavoriteButton();
});

// Fungsi untuk menyesuaikan ukuran teks
function adjustTextSize() {
    const quoteBox = document.getElementById('quote-box');
    const quoteNomer = document.getElementById('quote-nomer');
    const quoteArab = document.getElementById('quote-arab');
    const quoteLatin = document.getElementById('quote-latin');
    const quoteArti = document.getElementById('quote-arti');

    const boxHeight = quoteBox.offsetHeight;
    const boxWidth = quoteBox.offsetWidth;

    quoteNomer.style.fontSize = `${Math.min(boxHeight * 0.12, boxWidth * 0.15)}px`;
    quoteArab.style.fontSize = `${Math.min(boxHeight * 0.1, boxWidth * 0.13)}px`;
    quoteLatin.style.fontSize = `${Math.min(boxHeight * 0.06, boxWidth * 0.08)}px`;
    quoteArti.style.fontSize = `${Math.min(boxHeight * 0.04, boxWidth * 0.06)}px`;
}

// Panggil adjustTextSize saat halaman dimuat dan saat ukuran jendela berubah
window.addEventListener('load', adjustTextSize);
window.addEventListener('resize', adjustTextSize);

// Panggil fungsi adjustTextSize saat halaman dimuat dan saat ukuran jendela berubah
window.addEventListener('load', adjustTextSize);
window.addEventListener('resize', adjustTextSize);

// Fungsi untuk mengatur tema gelap/terang
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

// Periksa preferensi tema saat halaman dimuat
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Tambahkan event listener untuk tombol pengaturan
document.querySelector('button[onclick="showSettings()"]').addEventListener('click', function() {
    const settingsHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" id="settingsModal">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full">
                <h2 class="text-2xl font-bold mb-4">Random funfact</h2>
                <div id="funFact" class="mb-4">
                    <!-- Tempat untuk menampilkan fun fact -->
                </div>
                <button id="generateFunFactBtn" class="bg-blue-500 text-white rounded px-4 py-2 mb-2">Generate Fun Fact</button>
                <button onclick="closeSettings()" class="bg-blue-500 text-white rounded px-4 py-2">Tutup</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', settingsHTML);

    // Fungsi untuk mendapatkan data fun fact dari API
    async function getFunFact() {
        const apiUrl = 'https://uselessfacts.jsph.pl/api/v2/facts/random';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch fun fact data');
            }
            const data = await response.json();
            const funFactText = data.text;
            
            // Menampilkan fun fact ke dalam elemen dengan id funFact
            const funFactElement = document.getElementById('funFact');
            funFactElement.innerHTML = `
                <p>${funFactText}</p>
            `;
        } catch (error) {
            console.error('Error fetching fun fact data:', error);
        }
    }

    // Panggil fungsi getFunFact() saat modal dibuka atau halaman dimuat
    getFunFact();

    // Tambahkan event listener untuk tombol "Generate Fun Fact"
    const generateFunFactBtn = document.getElementById('generateFunFactBtn');
    generateFunFactBtn.addEventListener('click', getFunFact);
});





function closeSettings() {
    document.getElementById('settingsModal').remove();
}

// Fungsi untuk memperbarui tampilan saat mengubah quote
function updateQuoteDisplay(quote) {
    document.getElementById('quote-nomer').innerText = quote.urutan;
    document.getElementById('quote-arab').innerText = quote.arab;
    document.getElementById('quote-latin').innerText = quote.latin;
    document.getElementById('quote-arti').innerText = quote.arti;
    adjustTextSize();
    updateFavoriteButton();
}