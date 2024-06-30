let languagesData = [];
let surahData = [];
let recitersData = [];
let currentSurahIndex = 0;
let isPlaying = false;
let wavesurfer;

// Initialize WaveSurfer
document.addEventListener('DOMContentLoaded', function() {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#4B5563',
        progressColor: '#10B981',
        cursorColor: '#10B981',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 40,
        barGap: 3
    });

    wavesurfer.on('finish', function() {
        nextSurah();
    });
});

// Fetch languages data
fetch("https://mp3quran.net/api/v3/languages")
    .then((response) => response.json())
    .then((data) => {
        languagesData = data.language;
        const languageSelect = document.getElementById("language-select");
        languageSelect.innerHTML = data.language.map(lang => 
            `<option value="${lang.id}">${lang.language}</option>`
        ).join('');
        // Initialize with default language
        languageSelect.value = "18"; // Default to Arabic
        updateSurahAndReciter();
    })
    .catch((error) => console.error("Error fetching languages:", error));

// Update Surah and Reciter based on selected language
function updateSurahAndReciter() {
    const languageId = document.getElementById("language-select").value;
    const selectedLanguage = languagesData.find((l) => l.id === languageId);
    if (selectedLanguage) {
        fetchSurahData(selectedLanguage.surah);
        fetchRecitersData(selectedLanguage.reciters);
    }
}

// Fetch surah data
function fetchSurahData(surahUrl) {
    fetch(surahUrl)
        .then((response) => response.json())
        .then((data) => {
            surahData = data.suwar;
            const surahSelect = document.getElementById("surah-select");
            surahSelect.innerHTML = data.suwar.map(surah => 
                `<option value="${surah.id}">${surah.id}. ${surah.name}</option>`
            ).join('');
            updateSurahQariTitle();
        })
        .catch((error) => console.error("Error fetching surahs:", error));
}

// Fetch reciters data
function fetchRecitersData(recitersUrl) {
    fetch(recitersUrl)
        .then((response) => response.json())
        .then((data) => {
            recitersData = data.reciters;
            const reciterSelect = document.getElementById("reciter-select");
            reciterSelect.innerHTML = data.reciters.map(reciter => 
                `<option value="${reciter.id}">${reciter.name}</option>`
            ).join('');
            updateSurahQariTitle();
        })
        .catch((error) => console.error("Error fetching reciters:", error));
}

function togglePlay() {
    if (isPlaying) {
        wavesurfer.pause();
        isPlaying = false;
    } else {
        if (wavesurfer.isReady) {
            wavesurfer.play();
        } else {
            playSurah();
        }
        isPlaying = true;
    }
    updatePlayPauseIcon();
}

function playSurah() {
    const reciterId = document.getElementById("reciter-select").value;
    const surahId = document.getElementById("surah-select").value;
    currentSurahIndex = surahData.findIndex((s) => s.id === parseInt(surahId));
    playAudio(reciterId, surahId);
    updateSurahQariTitle();
}

function playAudio(reciterId, surahId) {
    const reciter = recitersData.find((r) => r.id === parseInt(reciterId));
    const surah = surahData.find((s) => s.id === parseInt(surahId));

    if (reciter && surah) {
        const moshaf = reciter.moshaf[0];
        const surahList = moshaf.surah_list.split(",");
        if (surahList.includes(surahId)) {
            const surahNumber = surahId.padStart(3, "0");
            const newSrc = `${moshaf.server}${surahNumber}.mp3`;
            wavesurfer.load(newSrc);
            wavesurfer.on('ready', function() {
                wavesurfer.play();
                isPlaying = true;
                updatePlayPauseIcon();
            });
        } else {
            alert(`The selected reciter (${reciter.name}) does not have Surah ${surah.name} available.`);
        }
    } else {
        alert("Error: Reciter or surah not found. Please try selecting again.");
    }
}

function updatePlayPauseIcon() {
    const playPauseIcon = document.getElementById("play-pause-icon");
    playPauseIcon.classList.remove(isPlaying ? "fa-play" : "fa-pause");
    playPauseIcon.classList.add(isPlaying ? "fa-pause" : "fa-play");
}

function nextSurah() {
    if (currentSurahIndex < surahData.length - 1) {
        currentSurahIndex++;
        const nextSurah = surahData[currentSurahIndex];
        document.getElementById("surah-select").value = nextSurah.id;
        const reciterId = document.getElementById("reciter-select").value;
        playAudio(reciterId, nextSurah.id.toString());
        updateSurahQariTitle();
    }
}

function previousSurah() {
    if (currentSurahIndex > 0) {
        currentSurahIndex--;
        const prevSurah = surahData[currentSurahIndex];
        document.getElementById("surah-select").value = prevSurah.id;
        const reciterId = document.getElementById("reciter-select").value;
        playAudio(reciterId, prevSurah.id.toString());
        updateSurahQariTitle();
    }
}

function updateSurahQariTitle() {
    const surahSelect = document.getElementById("surah-select");
    const reciterSelect = document.getElementById("reciter-select");
    const titleElement = document.getElementById("surah-qari-title");

    if (surahSelect.selectedIndex !== -1 && reciterSelect.selectedIndex !== -1) {
        const selectedSurah = surahSelect.options[surahSelect.selectedIndex].text;
        const selectedQari = reciterSelect.options[reciterSelect.selectedIndex].text;
        titleElement.textContent = `${selectedSurah} - ${selectedQari}`;
    }
}

const volumeSlider = document.getElementById("volume-slider");
const volumeIcon = document.getElementById("volume-icon");

volumeSlider.addEventListener("input", (e) => {
    const volume = e.target.value;
    wavesurfer.setVolume(volume);
    updateVolumeIcon(volume);
});

function updateVolumeIcon(volume) {
    volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down', 'fa-volume-off');
    if (volume > 0.5) {
        volumeIcon.classList.add('fa-volume-up');
    } else if (volume > 0) {
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.add('fa-volume-off');
    }
}

// Add event listeners for surah and reciter selection changes
document.getElementById("surah-select").addEventListener("change", playSurah);
document.getElementById("reciter-select").addEventListener("change", playSurah);
document.getElementById("language-select").addEventListener("change", updateSurahAndReciter);