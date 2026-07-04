# Actividad 6 — Seguridad: Fuerza Bruta sobre bcrypt

## Entrega
- **Fecha:** Jueves 11 de Junio del 2026, 22:00
- **Lugar:** repositorio personal, rama `main`

## Descripción

Se te entregó un archivo `.zip` protegido con una contraseña de **3 caracteres** del conjunto Base64 (`a-zA-Z0-9+/`), lo que da **262.144 combinaciones posibles** (`64^3`). Tu misión es encontrar esa contraseña.

## Materiales

- Archivo `.zip` con tu número de alumno: [enlace a los zips](https://github.com/IIC2513/Syllabus-S1/tree/main/Actividades/Act-6/zips)
- Hash bcrypt de tu contraseña en `claves.csv` (busca tu número de alumno)
- Archivo `bonusHelp.py` para verificar la solución del bonus

## Instrucciones

1. Generar todas las posibles contraseñas de 3 caracteres Base64.
2. Comparar cada contraseña con tu hash. Se recomienda `bcrypt.checkpw` de Python (visto en clase), pero puedes usar cualquier herramienta: `hashcat`, `John the Ripper`, u otras.
3. Usar la contraseña encontrada para abrir el `.txt` dentro del `.zip`.

## Bonus (+1 punto)

Dentro del `.txt` encontrarás dos acertijos y un hash firmado. El objetivo es romper ese hash mediante fuerza bruta:

1. Resolver los dos acertijos.
2. La respuesta del primer acertijo es la **clave secreta**, la del segundo es la **palabra final**.
3. Concatenar cada respuesta con `-XXX` (donde XXX es un número entre 100 y 999, distinto para cada una).
4. Probar combinaciones hasta que el HMAC-SHA256 coincida con el hash entregado.
5. Verificar con `bonusHelp.py` antes de entregar.

El bonus otorga **1 punto adicional** que puede suplir una actividad no realizada o incompleta.

## Entregables

1. `main.py` con tu script de solución.
2. `solucion.csv` con el formato:
   - **Con bonus:** `contraseña,clave-XXX,palabra-YYY` → Ejemplo: `jsL,WEB-777,CANVAS-987`
   - **Sin bonus:** `contraseña,,` → Ejemplo: `jsL,,`

**Ambos archivos son necesarios para obtener puntaje.**

> [!CAUTION]
> La fuerza bruta secuencial puede tardar **hasta 3 horas**. Se recomienda paralelizar con `ThreadPoolExecutor` o `multiprocessing`.

> [!TIP]
> **Libertad de herramientas:** puedes usar cualquier herramienta, librería o técnica que estimes conveniente. 

> [!NOTE]
> Si usaste IA o referencias externas, decláralo en el README de tu repositorio. La actividad es **estrictamente individual**.




## Soluciones:

contraseña zip: 2t1

acertijo 1: DNS

acertijo 2: npm

🔑 Clave correcta: dns-626
📦 Palabra final: npm-536