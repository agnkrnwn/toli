import os

# Mendapatkan daftar file dalam direktori saat ini (folder yang sama dengan skrip Python)
folder_path = '.'  # Path direktori saat ini, bisa diganti jika gambar ada di folder lain

# Mendapatkan daftar file dalam folder tersebut
list_gambar = os.listdir(folder_path)

# List untuk menyimpan nama file yang baru
list_gambar_baru = []

# Fungsi untuk mengubah nama file
def ubah_nama_file(judul_gambar, nomor):
    ext = os.path.splitext(judul_gambar)[1]  # Mendapatkan ekstensi file
    nama_baru = f'background{nomor}{ext}'
    os.rename(judul_gambar, nama_baru)
    return nama_baru

# Mengubah nama file untuk setiap gambar dalam list
nomor = 1
for gambar in list_gambar:
    if os.path.isfile(gambar):  # Memeriksa apakah itu file
        nama_baru = ubah_nama_file(gambar, nomor)
        list_gambar_baru.append(nama_baru)
        nomor += 1

# Print list nama file yang baru
print("List nama file yang baru:")
print(list_gambar_baru)
