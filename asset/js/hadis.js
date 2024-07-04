let currentHadith = null;
let maxHadithNumber = {
  arbain: 42,
  bulughul: 1597,
};
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Fetch and display hadith functions
async function fetchHadith(type, number) {
  let url;
  switch (type) {
    case "arbain":
      url = `https://api.myquran.com/v2/hadits/arbain/${number}`;
      break;
    case "bulughul":
      url = `https://api.myquran.com/v2/hadits/bm/${number}`;
      break;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status && data.data) {
      if (type === "bulughul") {
        currentHadith = {
          judul: `Hadis Bulughul Maram No. ${data.data.no}`,
          arab: data.data.ar,
          indo: data.data.id,
          number: ` `,
        };
      } else {
        // For Arbain
        currentHadith = {
          judul: data.data.judul,
          arab: data.data.arab,
          indo: data.data.indo,
          number: `Hadis Arbain No. ${data.data.no}. Karya Iman an-Nawawi`,
        };
      }
      displayHadith();
    } else {
      throw new Error("Hadith not found");
    }
  } catch (error) {
    console.error("Error fetching hadith:", error);
    document.getElementById("hadith-container").innerHTML =
      '<p class="text-red-500">Error fetching hadith. Please try again.</p>';
  }
}

function displayHadith() {
  const container = document.getElementById("hadith-container");
  container.innerHTML = `
    <div id="hadith-content" class="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h2 class="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">${
          currentHadith.judul || "Hadith"
        }</h2>
        <p class="text-gray-800 dark:text-gray-200 mb-4 text-right text-lg leading-relaxed">${
          currentHadith.arab
        }</p>
        <p class="text-gray-600 dark:text-gray-400 italic">${
          currentHadith.indo
        }</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">${
          currentHadith.number
        }</p>
    </div>
`;
  document.getElementById("options-container").style.display = "flex";
  updateFavoriteButton();
}

// Event listeners
document.getElementById("fetch-hadith").addEventListener("click", () => {
  const type = document.getElementById("hadith-type").value;
  const number = document.getElementById("hadith-number").value;
  if (number >= 1 && number <= maxHadithNumber[type]) {
    fetchHadith(type, number);
  } else {
    alert(`Please enter a number between 1 and ${maxHadithNumber[type]}`);
  }
});

document.getElementById("random-hadith").addEventListener("click", () => {
  const type = document.getElementById("hadith-type").value;
  const randomNumber = Math.floor(Math.random() * maxHadithNumber[type]) + 1;
  fetchHadith(type, randomNumber);
});

document.getElementById("copy-options").addEventListener("change", (event) => {
  if (currentHadith) {
    let textToCopy = "";
    switch (event.target.value) {
      case "all":
        textToCopy = `${currentHadith.judul}\n\n${currentHadith.arab}\n\n${currentHadith.indo}\n\n${currentHadith.number}`;
        break;
      case "title":
        textToCopy = currentHadith.judul;
        break;
      case "arabic":
        textToCopy = currentHadith.arab;
        break;
      case "translation":
        textToCopy = currentHadith.indo;
        break;
      case "title-translation":
        textToCopy = `${currentHadith.judul}\n\n${currentHadith.indo}\n\n${currentHadith.number} `;
        break;
      case "arabic-translation":
        textToCopy = `${currentHadith.arab}\n\n${currentHadith.indo}`;
        break;
    }

    navigator.clipboard.writeText(textToCopy).then(
      () => {
        alert("Teks berhasil disalin ke clipboard!");
      },
      (err) => {
        console.error("Tidak dapat menyalin teks: ", err);
        alert("Gagal menyalin teks. Silakan coba lagi.");
      }
    );
  }
});

// Settings modal
const settingsModal = document.getElementById("settings-modal");
const settingsBtn = document.getElementById("settings-btn");
const closeSettingsBtn = document.getElementById("close-settings");

settingsBtn.addEventListener("click", () => {
  settingsModal.classList.remove("hidden");
});

closeSettingsBtn.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

// Dark mode toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.checked = document.documentElement.classList.contains("dark");

darkModeToggle.addEventListener("change", () => {
  document.documentElement.classList.toggle("dark");
});

// Background options
document.querySelectorAll('input[name="background"]').forEach((elem) => {
  elem.addEventListener("change", function () {
    const backgroundOptions = document.getElementById("background-options");
    backgroundOptions.style.display =
      this.value === "without-background" ? "block" : "none";
  });
});

// Fetch a random hadith on page load
const initialType = document.getElementById("hadith-type").value;
fetchHadith(
  initialType,
  Math.floor(Math.random() * maxHadithNumber[initialType]) + 1
);

// Note: The download-image functionality is not included here as per your request
document.getElementById("download-image").addEventListener("click", () => {
  if (currentHadith) {
    const includeArabic = document.getElementById("include-arabic").checked;
    const backgroundOption = document.querySelector(
      'input[name="background"]:checked'
    ).value;
    const backgroundColorOption = document.querySelector(
      'input[name="background-color"]:checked'
    ).value;

    let backgroundStyle = "";
    let textColor = "#000";
    let arabicTextColor = "#1f2937";
    let headerColor = "#13203a";
    let secondaryTextColor = "#4b5563";
    let numberColor = "#6b7280";

    if (backgroundOption === "with-background") {
      backgroundStyle = `
                background-image: url('../../asset/icon/bg.jpg');
                background-color: #f5f5f5;
            `;
    } else {
      backgroundStyle =
        backgroundColorOption === "dark"
          ? "background-color: #333; color: #fff;"
          : "background-color: #fff; color: #000;";

      if (backgroundColorOption === "dark") {
        textColor = "#fff";
        arabicTextColor = "#fff";
        headerColor = "#fff";
        secondaryTextColor = "#ccc";
        numberColor = "#bbb";
      }
    }

    const imageElement = document.createElement("div");
    imageElement.innerHTML = `
            <div id="hadith-image" style="
                width: 1080px; 
                height: 1920px; 
                padding: 100px 60px; 
                ${backgroundStyle}
                background-size: cover;
                background-position: center;
                font-family: 'Arial', sans-serif; 
                display: flex; 
                flex-direction: column; 
                justify-content: center;">
                <div style="
                    background-color: ${
                      backgroundOption === "with-background"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "transparent"
                    }; 
                    border-radius: 20px; 
                    padding: 40px; 
                    box-shadow: ${
                      backgroundOption === "with-background"
                        ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                        : "none"
                    }; 
                    max-height: 1620px; 
                    overflow-y: auto;">
                    <h2 style="font-size: 52px; font-weight: 700; color: ${headerColor}; margin-bottom: 40px; text-align: center;">${
      currentHadith.judul || "Hadith"
    }</h2>
                    ${
                      includeArabic
                        ? `<p style="font-size: 40px; color: ${arabicTextColor}; margin-bottom: 40px; text-align: right; direction: rtl; line-height: 1.6;">${currentHadith.arab}</p>`
                        : ""
                    }
                    <p style="font-size: 26px; color: ${secondaryTextColor}; margin-bottom: 40px; font-style: italic; line-height: 1.4;">${
      currentHadith.indo
    }</p>
                    <p style="font-size: 22px; color: ${numberColor}; text-align: center;">${
      currentHadith.number
    }</p>
                </div>
            </div>
        `;

    document.body.appendChild(imageElement);

    html2canvas(document.getElementById("hadith-image"), {
      scale: 2,
      width: 1080,
      height: 1920,
      useCORS: true,
      scrollY: -window.scrollY,
      onclone: function (clonedDoc) {
        clonedDoc.querySelector("#hadith-image > div").style.overflow =
          "visible";
      },
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `hadith_${currentHadith.number.replace(/\s+/g, "_")}_${
        includeArabic ? "with" : "without"
      }_arabic.png`;
      link.href = canvas.toDataURL();
      link.click();

      document.body.removeChild(imageElement);
    });
  }
});

// Service Worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../../service-worker.js")
      .then((reg) => console.log("Service worker registered.", reg))
      .catch((err) => console.log("Service worker registration failed:", err));
  });
}

// Bottom navigation functionality
document.getElementById("home-btn").addEventListener("click", () => {
  // Implement home functionality
  console.log("Home button clicked");
  location.reload();
});

// Fungsi untuk menambah atau menghapus hadits dari favorit
function toggleFavorite() {
  if (!currentHadith) return;

  const index = favorites.findIndex((h) => h.judul === currentHadith.judul);
  if (index > -1) {
    // Hapus dari favorit jika sudah ada
    favorites.splice(index, 1);
    alert("Hadits dihapus dari favorit");
  } else {
    // Tambahkan ke favorit jika belum ada
    favorites.push(currentHadith);
    alert("Hadits ditambahkan ke favorit");
  }

  // Simpan ke localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoriteButton();
}

// Fungsi untuk memperbarui tampilan tombol favorit
function updateFavoriteButton() {
  const favoriteBtn = document.getElementById("favorite-btn");
  if (currentHadith && favorites.some((h) => h.judul === currentHadith.judul)) {
    favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
    favoriteBtn.classList.add("text-yellow-500");
  } else {
    favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
    favoriteBtn.classList.remove("text-yellow-500");
  }
}

// Fungsi untuk menampilkan daftar favorit
function showFavorites() {
  const container = document.getElementById("hadith-container");
  if (favorites.length === 0) {
    container.innerHTML =
      '<p class="text-gray-600 dark:text-gray-400">Belum ada hadits favorit.</p>';
  } else {
    let html =
      '<h2 class="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-4">Hadits Favorit</h2>';
    favorites.forEach((hadith, index) => {
      html += `
                <div class="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">${hadith.judul}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">${hadith.indo}</p>
                    <button onclick="removeFavorite(${index})" class="mt-2 text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i> Hapus dari Favorit
                    </button>
                </div>
            `;
    });
    container.innerHTML = html;
  }
  document.getElementById("options-container").style.display = "none";
}

// Fungsi untuk menghapus hadits dari favorit
function removeFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  showFavorites();
}

// Fungsi untuk menampilkan daftar favorit
function showFavoritesList() {
  const container = document.getElementById("hadith-container");
  let html = `
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-blue-600 dark:text-blue-400">Daftar Hadits Favorit</h2>
        <button id="close-favorites" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            <i class="fas fa-times"></i>
        </button>
    </div>
`;

  if (favorites.length === 0) {
    html +=
      '<p class="text-gray-600 dark:text-gray-400">Belum ada hadits favorit.</p>';
  } else {
    favorites.forEach((hadith, index) => {
      html += `
                <div class="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">${
                      hadith.judul
                    }</h3>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">${hadith.indo.substring(
                      0,
                      100
                    )}...</p>
                    <div class="mt-2">
                        <button onclick="showFullHadith(${index})" class="text-blue-500 hover:text-blue-700 mr-2">
                            <i class="fas fa-eye"></i> Lihat Lengkap
                        </button>
                        <button onclick="removeFavorite(${index})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i> Hapus dari Favorit
                        </button>
                    </div>
                </div>
            `;
    });
  }
  container.innerHTML = html;
  document.getElementById("options-container").style.display = "none";

  // Tambahkan event listener untuk tombol close
  document
    .getElementById("close-favorites")
    .addEventListener("click", showLastHadith);
}

function showLastHadith() {
  if (currentHadith) {
    displayHadith();
  } else {
    // Jika tidak ada hadits yang ditampilkan sebelumnya, tampilkan hadits acak
    const type = document.getElementById("hadith-type").value;
    const randomNumber = Math.floor(Math.random() * maxHadithNumber[type]) + 1;
    fetchHadith(type, randomNumber);
  }
}

// Fungsi untuk menampilkan hadits favorit secara lengkap
function showFullHadith(index) {
  currentHadith = favorites[index];
  displayHadith();
}

// Fungsi untuk menghapus hadits dari favorit
function removeFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  showFavoritesList();
}

// Event listener untuk tombol daftar favorit
document
  .getElementById("favorite-list-btn")
  .addEventListener("click", showFavoritesList);

// Ubah fungsi toggleFavorite
function toggleFavorite() {
  if (!currentHadith) return;

  const index = favorites.findIndex((h) => h.judul === currentHadith.judul);
  if (index > -1) {
    favorites.splice(index, 1);
    alert("Hadits dihapus dari favorit");
  } else {
    favorites.push(currentHadith);
    alert("Hadits ditambahkan ke favorit");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoriteButton();
}

// Fungsi untuk memperbarui tampilan tombol favorit
function updateFavoriteButton() {
  const favoriteBtn = document.getElementById("favorite-btn");
  if (currentHadith && favorites.some((h) => h.judul === currentHadith.judul)) {
    favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
    favoriteBtn.classList.add("text-yellow-500");
  } else {
    favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
    favoriteBtn.classList.remove("text-yellow-500");
  }
}

// Ubah event listener untuk tombol favorit
document
  .getElementById("favorite-btn")
  .addEventListener("click", toggleFavorite);
