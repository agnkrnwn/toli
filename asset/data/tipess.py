import requests
import json
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch_and_save(url, folder, index):
    try:
        print(f"Memulai pengambilan data dari {url}")
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        filename = f"{folder}/{index}.json"
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Berhasil menyimpan {filename}")
        return f"Selesai: {url}"
    except Exception as e:
        print(f"Gagal mengambil atau menyimpan data untuk {url}: {str(e)}")
        return f"Gagal: {url}"

def main():
    base_url_surat = "https://equran.id/api/v2/surat/"
    base_url_tafsir = "https://equran.id/api/v2/tafsir/"
    
    tasks = []
    
    print("Memulai proses pengambilan data...")
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        for i in range(1, 115):
            print(f"Menambahkan tugas untuk Surat dan Tafsir ke-{i}")
            tasks.append(executor.submit(fetch_and_save, f"{base_url_surat}{i}", "datasurat", i))
            tasks.append(executor.submit(fetch_and_save, f"{base_url_tafsir}{i}", "datatafsir", i))
            
            if i % 5 == 0:
                print(f"Menambahkan jeda setelah menambahkan tugas ke-{i}")
                time.sleep(1)
        
        print("Semua tugas telah ditambahkan. Menunggu hasil...")
        
        completed = 0
        for future in as_completed(tasks):
            result = future.result()
            completed += 1
            print(f"Tugas {completed}/{len(tasks)} selesai: {result}")

    print("Semua tugas telah selesai.")

if __name__ == "__main__":
    start_time = time.time()
    main()
    end_time = time.time()
    print(f"Total waktu eksekusi: {end_time - start_time:.2f} detik")
