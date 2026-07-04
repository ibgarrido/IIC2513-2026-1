import hmac
import hashlib

def resolver_bonus():
    # Una vez confirmado el Match, coloca tu clave secreta y palabra final
    # en el archivo solucion.csv

    # clave_secreta y palabra_final son la respuesta del primer y segundo acertijo respectivamente,
    # concatenados con su "-XXX" y "-YYY" respectivamente.
    # El hash_objetivo lo puedes encontrar dentro del archivo .txt que lograste abrir!
    hash_objetivo = "d12717410b3d6f7f3d8d6931ac7d3b73c168e20b65d64f9993c48f756911377a"

    for i in range(100, 1000):
        clave_secreta = f"dns-{i}"
        
        for j in range(100, 1000):
            palabra_final = f"npm-{j}"
            
            hash_calculado = hmac.new(
                key=clave_secreta.encode('utf-8'),
                msg=palabra_final.encode('utf-8'),
                digestmod=hashlib.sha256
            ).hexdigest()
            
            if hash_calculado == hash_objetivo:
                print(f"✅ ¡Match encontrado!")
                print(f"🔑 Clave correcta: {clave_secreta}")
                print(f"📦 Palabra final: {palabra_final}")
                return

    print("❌ No se encontró coincidencia.")

if __name__ == "__main__":
    resolver_bonus()