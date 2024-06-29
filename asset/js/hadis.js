let currentHadith = null;
let maxHadithNumber = {
    arbain: 42,
    bulughul: 1597
};

async function fetchHadith(type, number) {
    let url;
    switch (type) {
        case 'arbain':
            url = `https://api.myquran.com/v2/hadits/arbain/${number}`;
            break;
        case 'bulughul':
            url = `https://api.myquran.com/v2/hadits/bm/${number}`;
            break;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status && data.data) {
            if (type === 'bulughul') {
                currentHadith = {
                    judul: `Hadis Bulughul Maram No. ${data.data.no}`,
                    arab: data.data.ar,
                    indo: data.data.id,
                    number: ` `
                };
            } else {
                // For Arbain
                currentHadith = {
                    judul: data.data.judul,
                    arab: data.data.arab,
                    indo: data.data.indo,
                    number: `Hadis Arbain No. ${data.data.no}. Karya Iman an-Nawawi`
                };
            }
            displayHadith();
        } else {
            throw new Error('Hadith not found');
        }
    } catch (error) {
        console.error('Error fetching hadith:', error);
        document.getElementById('hadith-container').innerHTML = '<p class="text-red-500">Error fetching hadith. Please try again.</p>';
    }
}

function displayHadith() {
    const container = document.getElementById('hadith-container');
    container.innerHTML = `
        <div id="hadith-content" class="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 class="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-4">${currentHadith.judul || 'Hadith'}</h2>
            <p class="text-gray-800 dark:text-gray-200 mb-4 text-right text-lg leading-relaxed">${currentHadith.arab}</p>
            <p class="text-gray-600 dark:text-gray-400 italic">${currentHadith.indo}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">${currentHadith.number}</p>
        </div>
    `;
    document.getElementById('copy-options').style.display = 'block';
    document.getElementById('download-image').style.display = 'block';
}

document.getElementById('fetch-hadith').addEventListener('click', () => {
    const type = document.getElementById('hadith-type').value;
    const number = document.getElementById('hadith-number').value;
    if (number >= 1 && number <= maxHadithNumber[type]) {
        fetchHadith(type, number);
    } else {
        alert(`Please enter a number between 1 and ${maxHadithNumber[type]}`);
    }
});

document.getElementById('random-hadith').addEventListener('click', () => {
    const type = document.getElementById('hadith-type').value;
    const randomNumber = Math.floor(Math.random() * maxHadithNumber[type]) + 1;
    fetchHadith(type, randomNumber);
});

document.getElementById('toggle-dark-mode').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

document.getElementById('copy-options').addEventListener('change', (event) => {
    if (currentHadith) {
        let textToCopy = '';
        switch (event.target.value) {
            case 'all':
                textToCopy = `${currentHadith.judul}\n\n${currentHadith.arab}\n\n${currentHadith.indo}\n\n${currentHadith.number}`;
                break;
            case 'title':
                textToCopy = currentHadith.judul;
                break;
            case 'arabic':
                textToCopy = currentHadith.arab;
                break;
            case 'translation':
                textToCopy = currentHadith.indo;
                break;
            case 'title-translation':
                textToCopy = `${currentHadith.judul}\n\n${currentHadith.indo}`;
                break;
            case 'arabic-translation':
                textToCopy = `${currentHadith.arab}\n\n${currentHadith.indo}`;
                break;
        }
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Teks berhasil disalin ke clipboard!');
        }, (err) => {
            console.error('Tidak dapat menyalin teks: ', err);
            alert('Gagal menyalin teks. Silakan coba lagi.');
        });
    }
});

document.getElementById('download-image').addEventListener('click', () => {
    if (currentHadith) {
        html2canvas(document.getElementById('hadith-content')).then(canvas => {
            const link = document.createElement('a');
            link.download = `hadith_${currentHadith.number}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    }
});

// Fetch a random hadith on page load
const initialType = document.getElementById('hadith-type').value;
fetchHadith(initialType, Math.floor(Math.random() * maxHadithNumber[initialType]) + 1);

// Initially hide the copy options and download button
document.getElementById('copy-options').style.display = 'none';
document.getElementById('download-image').style.display = 'none';