let languagesData = [];
let surahData = [];
let recitersData = [];
let currentSurahIndex = 0;
let isPlaying = false;

// Inisialisasi Bootstrap Select
function initializeSelectPicker() {
  $(".selectpicker").selectpicker({
    noneSelectedText: "Nothing selected",
  });
}

// Fungsi untuk memperbarui pilihan setelah memuat data
function updateSelectOptions() {
  $(".selectpicker").selectpicker("refresh");
}

// Fetch languages data
fetch("https://mp3quran.net/api/v3/languages")
  .then((response) => response.json())
  .then((data) => {
    languagesData = data.language;
    const languageSelect = $("#language-select");
    languageSelect.empty();
    data.language.forEach((language) => {
      languageSelect.append(
        $("<option>", {
          value: language.id,
          text: language.language,
        })
      );
    });
    // Initialize with default language
    const defaultLanguage = "18"; // Default to Arabic
    languageSelect.val(defaultLanguage);
    initializeSelectPicker();
    updateSurahAndReciter();
  })
  .catch((error) => console.error("Error fetching languages:", error));

// Update Surah and Reciter based on selected language
function updateSurahAndReciter() {
  const languageId = $("#language-select").val();
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
      console.log("Surah data loaded:", surahData);
      const surahSelect = $("#surah-select");
      surahSelect.empty();
      data.suwar.forEach((surah) => {
        surahSelect.append(
          $("<option>", {
            value: surah.id,
            text: `${surah.id}. ${surah.name}`,
          })
        );
      });
      updateSelectOptions();
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
      console.log("Reciters data loaded:", recitersData);
      const reciterSelect = $("#reciter-select");
      reciterSelect.empty();
      data.reciters.forEach((reciter) => {
        reciterSelect.append(
          $("<option>", {
            value: reciter.id,
            text: reciter.name,
          })
        );
      });
      updateSelectOptions();
      updateSurahQariTitle();
    })
    .catch((error) => console.error("Error fetching reciters:", error));
}

function togglePlay() {
  const audioPlayer = document.getElementById("audio-player");
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
  } else {
    if (audioPlayer.src) {
      audioPlayer.play();
    } else {
      playSurah();
    }
    isPlaying = true;
  }
  updatePlayPauseIcon();
}

function playSurah() {
  const reciterId = $("#reciter-select").val();
  const surahId = $("#surah-select").val();
  currentSurahIndex = surahData.findIndex((s) => s.id === parseInt(surahId));
  playAudio(reciterId, surahId);
  updateSurahQariTitle();
}

function playAudio(reciterId, surahId) {
  console.log("Playing audio:", reciterId, surahId);
  const reciter = recitersData.find((r) => r.id === parseInt(reciterId));
  const surah = surahData.find((s) => s.id === parseInt(surahId));
  const audioPlayer = document.getElementById("audio-player");

  if (reciter && surah) {
    const moshaf = reciter.moshaf[0];
    const surahList = moshaf.surah_list.split(",");
    if (surahList.includes(surahId)) {
      const surahNumber = surahId.padStart(3, "0");
      const newSrc = `${moshaf.server}${surahNumber}.mp3`;
      console.log("New audio source:", newSrc);
      if (audioPlayer.src !== newSrc) {
        audioPlayer.src = newSrc;
      }
      audioPlayer.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      isPlaying = true;
      updatePlayPauseIcon();
    } else {
      // Show an alert instead of just logging to console
      alert(
        `The selected reciter (${reciter.name}) does not have Surah ${surah.name} available.`
      );
      console.error("Selected reciter does not have the selected surah.");
    }
  } else {
    alert("Error: Reciter or surah not found. Please try selecting again.");
    console.error("Reciter or surah not found.");
  }
}

function stopAudio() {
  const audioPlayer = document.getElementById("audio-player");
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  isPlaying = false;
  updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
  const playPauseIcon = document.getElementById("play-pause-icon");
  playPauseIcon.textContent = isPlaying ? "pause" : "play_arrow";
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function nextSurah() {
  console.log("Next surah called");
  if (currentSurahIndex < surahData.length - 1) {
    currentSurahIndex++;
    const nextSurah = surahData[currentSurahIndex];
    $("#surah-select").val(nextSurah.id).selectpicker("refresh");
    const reciterId = $("#reciter-select").val();
    playAudio(reciterId, nextSurah.id.toString());
    updateSurahQariTitle();
  }
}

function previousSurah() {
  console.log("Previous surah called");
  if (currentSurahIndex > 0) {
    currentSurahIndex--;
    const prevSurah = surahData[currentSurahIndex];
    $("#surah-select").val(prevSurah.id).selectpicker("refresh");
    const reciterId = $("#reciter-select").val();
    playAudio(reciterId, prevSurah.id.toString());
    updateSurahQariTitle();
  }
}

function updateSurahQariTitle() {
  const surahSelect = $("#surah-select");
  const reciterSelect = $("#reciter-select");
  const titleElement = document.getElementById("surah-qari-title");

  const selectedSurah = surahSelect.find("option:selected").text();
  const selectedQari = reciterSelect.find("option:selected").text();

  titleElement.textContent = `${selectedSurah} - ${selectedQari}`;
}

const audioPlayer = document.getElementById("audio-player");
const progressBar = document.getElementById("progress-bar");
const currentTimeSpan = document.getElementById("current-time");
const durationSpan = document.getElementById("duration");
const volumeSlider = document.getElementById("volume-slider");
const volumeIcon = document.getElementById("volume-icon");

audioPlayer.addEventListener("timeupdate", () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${progress}%`;
  currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener("loadedmetadata", () => {
  durationSpan.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("ended", () => {
  nextSurah();
});

volumeSlider.addEventListener("input", (e) => {
  const volume = e.target.value;
  audioPlayer.volume = volume;
  updateVolumeIcon(volume);
});

function updateVolumeIcon(volume) {
  if (volume > 0.5) {
    volumeIcon.textContent = "volume_up";
  } else if (volume > 0) {
    volumeIcon.textContent = "volume_down";
  } else {
    volumeIcon.textContent = "volume_mute";
  }
}

// Add event listeners for surah and reciter selection changes
$("#surah-select, #reciter-select, #language-select").on(
  "changed.bs.select",
  function (e) {
    console.log(`${e.target.id} changed to:`, $(this).val());
    if (e.target.id === "language-select") {
      updateSurahAndReciter();
    } else {
      playSurah();
    }
  }
);

// Initialize Bootstrap Select
$(document).ready(function () {
  initializeSelectPicker();
});

function downloadAudio() {
  const reciterId = $("#reciter-select").val();
  const surahId = $("#surah-select").val();
  const reciter = recitersData.find((r) => r.id === parseInt(reciterId));
  const surah = surahData.find((s) => s.id === parseInt(surahId));

  if (reciter && surah) {
    const moshaf = reciter.moshaf[0];
    const surahList = moshaf.surah_list.split(",");
    if (surahList.includes(surahId)) {
      const surahNumber = surahId.padStart(3, "0");
      const audioUrl = `${moshaf.server}${surahNumber}.mp3`;
      const fileName = `${reciter.name} - Surah ${surah.name}.mp3`;

      // Buat elemen anchor sementara untuk download
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(
        `The selected reciter (${reciter.name}) does not have Surah ${surah.name} available for download.`
      );
    }
  } else {
    alert("Error: Reciter or surah not found. Please try selecting again.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleButton");
  const toggleIcon = document.getElementById("toggleIcon");
  const popupOverlay = document.getElementById("popupOverlay");
  const closePopup = document.getElementById("closePopup");

  function togglePopup(show) {
    popupOverlay.style.display = show ? "flex" : "none";
    toggleIcon.textContent = show ? "playlist_remove" : "playlist_add";
  }

  toggleButton.addEventListener("click", function () {
    togglePopup(
      popupOverlay.style.display === "none" || popupOverlay.style.display === ""
    );
  });

  closePopup.addEventListener("click", function () {
    togglePopup(false);
  });

  popupOverlay.addEventListener("click", function (event) {
    if (event.target === popupOverlay) {
      togglePopup(false);
    }
  });
});
