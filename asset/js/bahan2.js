// bahan.js

function hitungBahan() {
  var lebarBahan = parseFloat(document.getElementById("lebarBahan").value);
  var lebarPola = parseFloat(document.getElementById("lebarPola").value);
  var panjangPola = parseFloat(document.getElementById("panjangPola").value);
  var jumlahLusin = parseInt(document.getElementById("jumlahLusin").value);

  var jumlahPotonganPerlebar = Math.floor(lebarBahan / lebarPola);
  var sisaBahanPerlebar = lebarBahan % lebarPola;
  var jumlahPotonganTotal = jumlahLusin * 12;
  var jumlahBarisPola = Math.ceil(jumlahPotonganTotal / jumlahPotonganPerlebar);
  var panjangBahanTotal = jumlahBarisPola * panjangPola;

  // Hitung pola tambahan dari sisa bahan
  var polaTambahanVertikal =
    Math.floor(panjangBahanTotal / lebarPola) *
    Math.floor(sisaBahanPerlebar / panjangPola);
  var polaTambahanHorizontal =
    Math.floor(sisaBahanPerlebar / lebarPola) *
    Math.floor(panjangBahanTotal / panjangPola);
  var polaTambahan = Math.max(polaTambahanVertikal, polaTambahanHorizontal);

  var jumlahPotonganTotalOptimized = jumlahPotonganTotal + polaTambahan;
  var panjangBahanTotalYard = panjangBahanTotal / 91.44;

  var luasBahanTotal = lebarBahan * panjangBahanTotal;
  var luasBahanTerpakai =
    jumlahPotonganTotalOptimized * lebarPola * panjangPola;
  var efisiensiPenggunaanBahan = (luasBahanTerpakai / luasBahanTotal) * 100;

  var hasilPerlusan = `
    <p class="mb-2"><span class="font-semibold">Lebar Bahan:</span> ${lebarBahan} cm</p>
    <p class="mb-2"><span class="font-semibold">Pola:</span> L ${lebarPola} cm X P ${panjangPola} cm</p>
    <p class="mb-2"><span class="font-semibold">Jumlah Lusin:</span> ${jumlahLusin}</p>
    <p class="mb-2"><span class="font-semibold">Potongan didapatkan perbaris:</span> ${jumlahPotonganPerlebar} pcs</p>
    <p class="mb-2"><span class="font-semibold">Sisa bahan perlebar:</span> ${sisaBahanPerlebar.toFixed(
      2
    )} cm</p>
    <p class="mb-2"><span class="font-semibold">Total panjang bahan yang diperlukan:</span> ${panjangBahanTotal.toFixed(
      2
    )} cm (${panjangBahanTotalYard.toFixed(2)} yard)</p>
    <p class="mb-2"><span class="font-semibold">Pola tambahan dari sisa bahan:</span> ${polaTambahan} pcs</p>
    <p class="mb-2"><span class="font-semibold">Total potongan setelah optimisasi:</span> ${jumlahPotonganTotalOptimized} pcs</p>
    <p class="mb-2"><span class="font-semibold">Efisiensi penggunaan bahan:</span> ${efisiensiPenggunaanBahan.toFixed(
      2
    )}%</p>
  `;

  document.getElementById("hasilContent").innerHTML = hasilPerlusan;
  document.getElementById("hasil").classList.remove("hidden");
}

function tampilkanVisual() {
  var lebarBahan = parseFloat(document.getElementById("lebarBahan").value);
  var lebarPola = parseFloat(document.getElementById("lebarPola").value);
  var panjangPola = parseFloat(document.getElementById("panjangPola").value);
  var jumlahLusin = parseInt(document.getElementById("jumlahLusin").value);

  var jumlahPotonganPerlebar = Math.floor(lebarBahan / lebarPola);
  var sisaBahanPerlebar = lebarBahan % lebarPola;
  var jumlahPotonganTotal = jumlahLusin * 12;
  var jumlahBarisPola = Math.ceil(jumlahPotonganTotal / jumlahPotonganPerlebar);
  var panjangBahanTotal = jumlahBarisPola * panjangPola;

  // Set up SVG dimensions
  var baseWidth = 500;
  var baseHeight = 300;
  var aspectRatio = baseHeight / baseWidth;

  var scaleX = baseWidth / lebarBahan;
  var scaleY = baseHeight / panjangBahanTotal;

  // Create SVG
  var svg = `
    <svg width="100%" height="100%" viewBox="0 0 ${baseWidth} ${
    baseHeight + 80
  }" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  `;

  // Draw fabric background
  svg += `<rect x="0" y="0" width="${baseWidth}" height="${baseHeight}" fill="#f0f0f0" stroke="#999" stroke-width="2"/>`;

  // Menggambar pola utama
  var nomorPola = 1;
  for (var i = 0; i < jumlahBarisPola; i++) {
    for (var j = 0; j < jumlahPotonganPerlebar; j++) {
      if (nomorPola <= jumlahPotonganTotal) {
        var x = j * lebarPola * scaleX;
        var y = i * panjangPola * scaleY;
        svg += `<rect x="${x}" y="${y}" width="${lebarPola * scaleX}" height="${
          panjangPola * scaleY
        }" fill="#3b82f6" stroke="#2563eb" stroke-width="1"/>`;
        svg += `<text x="${x + (lebarPola * scaleX) / 2}" y="${
          y + (panjangPola * scaleY) / 2
        }" fill="white" text-anchor="middle" dominant-baseline="middle" font-size="10">${nomorPola}</text>`;
        nomorPola++;
      }
    }
  }

  // Menggambar pola sisa bahan
  var sisaBahanX = jumlahPotonganPerlebar * lebarPola * scaleX;
  var sisaBahanWidth = sisaBahanPerlebar * scaleX;
  var sisaBahanHeight = baseHeight;

  // Menentukan orientasi optimal untuk sisa bahan
  var polaTambahanHorizontal =
    Math.floor(sisaBahanPerlebar / lebarPola) *
    Math.floor(panjangBahanTotal / panjangPola);
  var polaTambahanVertikal =
    Math.floor(panjangBahanTotal / lebarPola) *
    Math.floor(sisaBahanPerlebar / panjangPola);

  var orientasiSisaBahan =
    polaTambahanHorizontal > polaTambahanVertikal ? "horizontal" : "vertical";

  var nomorPolaTambahan = jumlahPotonganTotal + 1;
  if (orientasiSisaBahan === "horizontal") {
    for (var i = 0; i < Math.floor(sisaBahanPerlebar / lebarPola); i++) {
      for (var j = 0; j < Math.floor(panjangBahanTotal / panjangPola); j++) {
        var x = sisaBahanX + i * lebarPola * scaleX;
        var y = j * panjangPola * scaleY;
        svg += `<rect x="${x}" y="${y}" width="${lebarPola * scaleX}" height="${
          panjangPola * scaleY
        }" fill="#fca5a5" stroke="#ef4444" stroke-width="1"/>`;
        svg += `<text x="${x + (lebarPola * scaleX) / 2}" y="${
          y + (panjangPola * scaleY) / 2
        }" fill="#7f1d1d" text-anchor="middle" dominant-baseline="middle" font-size="8">${nomorPolaTambahan}</text>`;
        nomorPolaTambahan++;
      }
    }
  } else {
    for (var i = 0; i < Math.floor(panjangBahanTotal / lebarPola); i++) {
      for (var j = 0; j < Math.floor(sisaBahanPerlebar / panjangPola); j++) {
        var x = sisaBahanX + j * panjangPola * scaleX;
        var y = i * lebarPola * scaleY;
        svg += `<rect x="${x}" y="${y}" width="${
          panjangPola * scaleX
        }" height="${
          lebarPola * scaleY
        }" fill="#fca5a5" stroke="#ef4444" stroke-width="1"/>`;
        svg += `<text x="${x + (panjangPola * scaleX) / 2}" y="${
          y + (lebarPola * scaleY) / 2
        }" fill="#7f1d1d" text-anchor="middle" dominant-baseline="middle" font-size="8">${nomorPolaTambahan}</text>`;
        nomorPolaTambahan++;
      }
    }
  }

  // Menggambar sisa bahan yang tidak bisa digunakan
  var sisaBahanTidakTerpakai =
    orientasiSisaBahan === "horizontal"
      ? sisaBahanPerlebar % lebarPola
      : sisaBahanPerlebar % panjangPola;

  if (sisaBahanTidakTerpakai > 0) {
    var xTidakTerpakai =
      orientasiSisaBahan === "horizontal"
        ? sisaBahanX +
          Math.floor(sisaBahanPerlebar / lebarPola) * lebarPola * scaleX
        : sisaBahanX +
          Math.floor(sisaBahanPerlebar / panjangPola) * panjangPola * scaleX;

    svg += `<rect x="${xTidakTerpakai}" y="0" width="${
      sisaBahanTidakTerpakai * scaleX
    }" height="${baseHeight}" fill="#fee2e2" stroke="#ef4444" stroke-width="1" opacity="0.5"/>`;
  }

  // Add dimension labels
  svg += `<text x="${baseWidth / 2}" y="${
    baseHeight + 20
  }" text-anchor="middle" font-size="12">Lebar Bahan: ${lebarBahan} cm</text>`;
  svg += `<text x="-20" y="${
    baseHeight / 2
  }" text-anchor="middle" font-size="12" transform="rotate(-90 -20 ${
    baseHeight / 2
  })">Panjang Bahan: ${panjangBahanTotal.toFixed(2)} cm</text>`;

  // Add legend
  svg += `
    <g transform="translate(10, ${baseHeight + 40})">
      <rect width="15" height="15" fill="#3b82f6"/>
      <text x="20" y="12" font-size="12">Pola Utama</text>
      
      <rect y="20" width="15" height="15" fill="#fca5a5"/>
      <text x="20" y="32" font-size="12">Pola Tambahan</text>
      
      <rect y="40" width="15" height="15" fill="#fee2e2"/>
      <text x="20" y="52" font-size="12">Sisa Tidak Terpakai</text>
    </g>
  `;

  svg += "</svg>";

  var container = document.getElementById("svgContainer");
  container.innerHTML = svg;
  container.style.width = "100%";
  container.style.height = `${container.offsetWidth * aspectRatio}px`;

  document.getElementById("visualisasi").classList.remove("hidden");
}

// Zoom functionality
var currentZoom = 1;
function zoomIn() {
  currentZoom *= 1.2;
  document.querySelector(
    "#svgContainer svg"
  ).style.transform = `scale(${currentZoom})`;
}

function zoomOut() {
  currentZoom /= 1.2;
  document.querySelector(
    "#svgContainer svg"
  ).style.transform = `scale(${currentZoom})`;
}

// Toggle dark mode
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("tampilkanVisual")
    .addEventListener("click", tampilkanVisual);
  document.getElementById("zoomIn").addEventListener("click", zoomIn);
  document.getElementById("zoomOut").addEventListener("click", zoomOut);
  document
    .getElementById("themeToggle")
    .addEventListener("click", toggleDarkMode);
});
