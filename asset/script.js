// Konfigurasi Awal
let currentHadith = null;
let isDarkMode = false;

// Inisialisasi Aplikasi
$(document).ready(function() {
  initEventListeners();
});

// Event Listeners
function initEventListeners() {
  // Toggle Tema
  $('#toggle-theme').click(toggleTheme);
  
  // Cari Hadis
  $('#generate-custom').click(handleSearch);
  
  // Hadis Acak
  $('#generate-hadith').click(handleRandom);
  
  // Edit Hadis
  $(document).on('click', '#edit-hadith', toggleEditMode);
  
  // Download Gambar
  $('#download-btn').click(handleDownload);
}

// Fungsi Toggle Tema
function toggleTheme() {
  isDarkMode = !isDarkMode;
  $('body').toggleClass('dark');
  $('#toggle-theme').html(
    isDarkMode 
      ? '<i class="fas fa-sun mr-2"></i>Light Mode' 
      : '<i class="fas fa-moon mr-2"></i>Dark Mode'
  );
}

// Handle Pencarian Hadis
async function handleSearch() {
  const author = $('#hadith-author').val();
  const number = $('#hadith-number').val();

  if (!author || !number) {
    showAlert('error', 'Harap pilih penulis dan masukkan nomor hadis');
    return;
  }

  try {
    const response = await fetch(`data/hadith/${author}.json`);
    const data = await response.json();
    
    const hadith = data.find(h => h.number == number);
    if (!hadith) throw new Error('Hadis tidak ditemukan');
    
    displayHadith(hadith, author);
  } catch (error) {
    showAlert('error', error.message);
  }
}

// Handle Hadis Acak
async function handleRandom() {
  const authors = ['bukhari', 'muslim', 'tirmidzi', 'ibnu-majah'];
  const randomAuthor = authors[Math.floor(Math.random() * authors.length)];

  try {
    const response = await fetch(`data/hadith/${randomAuthor}.json`);
    const data = await response.json();
    const randomHadith = data[Math.floor(Math.random() * data.length)];
    
    displayHadith(randomHadith, randomAuthor);
  } catch (error) {
    showAlert('error', 'Gagal memuat hadis acak');
  }
}

// Tampilkan Hadis
function displayHadith(hadith, author) {
  currentHadith = hadith;
  
  $('#quote-text').html(hadith.id);
  $('#quote-reference').html(`
    <i class="fas fa-user-tie mr-2"></i>${formatAuthorName(author)} 
    <i class="fas fa-hashtag mx-2"></i>${hadith.number}
  `);
  
  $('#action-buttons').show();
  $('#edit-area').hide();
}

// Format Nama Penulis
function formatAuthorName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Toggle Edit Mode
function toggleEditMode() {
  const isEditing = $('#edit-area').is(':visible');
  
  if (!isEditing) {
    $('#hadith-editor').val($('#quote-text').text());
  }
  
  $('#quote-text').toggle(!isEditing);
  $('#edit-area').toggle(!isEditing);
}

// Handle Download
async function handleDownload() {
  try {
    // Update Template
    $('#template-text').text($('#hadith-editor').val());
    $('#template-reference').html($('#quote-reference').html());
    $('#download-date').text(new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    // Konversi ke Gambar
    const canvas = await html2canvas(document.querySelector("#download-template"), {
      scale: 2,
      useCORS: true,
      logging: true
    });

    // Trigger Download
    const link = document.createElement('a');
    link.download = `hadis-${currentHadith.number}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    showAlert('success', 'Download berhasil!');
  } catch (error) {
    showAlert('error', 'Gagal mengunduh gambar');
  }
}

// Tampilkan Notifikasi
function showAlert(type, message) {
  const alert = $(`
    <div class="fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
      type === 'error' ? 'bg-red-500' : 
      type === 'warning' ? 'bg-yellow-500' : 
      'bg-green-500'
    }">
      ${message}
    </div>
  `);
  
  alert.appendTo('body').delay(3000).fadeOut();
}