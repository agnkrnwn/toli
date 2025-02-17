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
    const response = await fetch(`data/hadist/${author}.json`);
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
  const authors = ['abu-dawud', 'ahmad', 'bukhari', 'ibnu-majah', 'malik', 'nasai', 'tirmidzi'];
  const randomAuthor = authors[Math.floor(Math.random() * authors.length)];

  try {
    const response = await fetch(`data/hadist/${randomAuthor}.json`);
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
// Handle Download (Revisi)
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

    // Buat clone dari #download-template untuk diproses tanpa mengganggu tampilan asli
    const $templateClone = $('#download-template').clone();

    // Terapkan styling tetap agar konsisten (misalnya lebar tetap, padding dan teks terpusat)
    $templateClone.css({
      width: '600px',
      padding: '20px',
      margin: '0 auto',
      backgroundColor: $('body').hasClass('dark') ? '#2d3748' : '#2d3748',
      position: 'absolute',
      top: '-10000px',
      left: '-10000px'
    });
    // Pastikan teks di dalam template terpusat dan membungkus kata dengan rapi
    $templateClone.find('#template-text').css({
      textAlign: 'center',
      wordWrap: 'break-word'
    });
    $templateClone.find('#template-reference').css({
      textAlign: 'center'
    });

    // Tambahkan clone ke body (secara tersembunyi)
    $('body').append($templateClone);

    // Konversi clone ke gambar menggunakan html2canvas yeee
    const canvas = await html2canvas($templateClone[0], {
      scale: 2,
      useCORtokapnS: true,
      logging: false
    });

    // Hapus clone dari DOM
    $templateClone.remove();

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