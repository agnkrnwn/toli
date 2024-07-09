import requests
import json
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch_and_save(url, folder, index):
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        filename = f"{folder}/{index}.json"
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Berhasil menyimpan {filename}")
    except Exception as e:
        print(f"Gagal mengambil atau menyimpan data untuk {url}: {str(e)}")

def main():
    base_url_surat = "https://equran.id/api/v2/surat/"
    base_url_tafsir = "https://equran.id/api/v2/tafsir/"
    
    tasks = []
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        for i in range(1, 115):
            tasks.append(executor.submit(fetch_and_save, f"{base_url_surat}{i}", "datasurat", i))
            tasks.append(executor.submit(fetch_and_save, f"{base_url_tafsir}{i}", "datatafsir", i))
            
            # Menambahkan jeda setiap 10 permintaan untuk mengurangi beban server
            if i % 5 == 0:
                time.sleep(1)
        
        for future in as_completed(tasks):
            future.result()

if __name__ == "__main__":
    main()
