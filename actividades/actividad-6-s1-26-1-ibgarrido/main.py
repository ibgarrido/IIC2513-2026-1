# Puedes desarrollar aquí tu script principal aquí para encontrar las soluciones!
from itertools import product, islice
import bcrypt
import csv
from concurrent.futures import ThreadPoolExecutor, as_completed
import zipfile

def cargar_hash_objetivo(ruta_csv):
    with open(ruta_csv,'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['StudentId'] == '22200398':
                return row['bcrypt_hash'].encode('utf-8')
    raise ValueError("No se encontró el hash para el StudentId especificado.")

def generar_combinaciones_3():
    base_64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    for c1, c2, c3 in product(base_64, repeat=3):
        yield (c1 + c2 + c3).encode('utf-8')

def iterador_combinaciones(chunk_size=5000):
    combinaciones = generar_combinaciones_3()
    while True:
        chunk = list(islice(combinaciones, chunk_size))
        if not chunk:
            break
        yield chunk

def procesar_chunk(chunk, hash_obj):
    for candidato in chunk:
        if bcrypt.checkpw(candidato, hash_obj):
            return candidato
    return None

if __name__ == "__main__":
    hash_objetivo = cargar_hash_objetivo('claves.csv')
    with ThreadPoolExecutor() as executor:
        futures = []
        for chunk in iterador_combinaciones():
            futures.append(executor.submit(procesar_chunk, chunk, hash_objetivo))
        
        for future in as_completed(futures):
            resultado = future.result()
            if resultado is not None:
                print(f"¡Hash encontrado! La combinación es: {resultado.decode('utf-8')}")
                for f in futures:
                    f.cancel()
                
                with zipfile.ZipFile('22200398.zip', 'r') as archivo_zip:
                    archivo_zip.extractall(pwd=resultado)
                    print("Archivo descomprimido exitosamente con la contraseña encontrada.")
                
                break