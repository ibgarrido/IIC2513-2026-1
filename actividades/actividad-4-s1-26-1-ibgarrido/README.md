[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/whRyFXuh)

# Actividad: Automatización con GitHub Actions 🚀 

En esta actividad, vas a trabajar con **GitHub Actions** para automatizar tareas comunes en un flujo de desarrollo moderno. Implementarás un workflow que:

- Ejecuta un **linter** automáticamente sobre el código base para asegurar que sigue un estilo consistente.
- Ejecuta **tests** automatizados sobre una mini aplicación incluida en el repositorio.
- Obtiene un superhéroe aleatorio de la [Superhero API](https://akabab.github.io/superhero-api/) cada vez que se ejecuta el workflow.
- Muestra la información de ese superhéroe (imagen, nombre, nombre completo, publisher, alignment y powerstats) en el `README.md`.

---

## 🧠 Objetivos de Aprendizaje

- Aprender a configurar workflows en GitHub Actions.
- Entender cómo automatizar chequeos de calidad de código.
- Ejecutar tests automatizados dentro de un pipeline CI/CD.
- Trabajar con llamadas HTTP dentro de un pipeline.
- Modificar archivos directamente desde un pipeline.

---

## 📝 Instrucciones


1. En la carpeta `.github/workflows/` crea un archivo llamado `main.yml`.

2. Configura un workflow que se dispare en el siguiente evento:
   - `push`


3. El workflow debe ejecutar las siguientes tareas:

   ### ✅ 1. Linting
   - Si estás trabajando en JavaScript, usa `eslint`.
   - Asegúrate de que el linter falle el pipeline si encuentra errores.

   ### 🧪 2. Testing
   - El repositorio incluye una mini aplicación en `src/utils.js` con dos funciones: `formatHeroCard` y `getHeroTier`.
   - Debes escribir **2 tests** (en `tests/utils.test.js`) usando **Jest** que verifiquen el correcto funcionamiento de estas funciones.
   - Tu workflow debe ejecutar estos tests automáticamente.

   ### 📡 3. Obtener superhéroe aleatorio
   - El workflow debe hacer un **GET** a la Superhero API para obtener un superhéroe aleatorio.
   - Debe extraer los siguientes datos del superhéroe:
      - Imagen
      - Nombre
      - Nombre completo (fullName)
      - Publisher
      - Alignment
      - Powerstats (intelligence, strength, speed, durability, power, combat)

   ### 🖊️ 4. Modificar README
   - El workflow debe modificar automáticamente el `README.md` para mostrar la información del superhéroe obtenido en una sección especial.
   - Cada vez que se ejecute el workflow, la información del superhéroe debe actualizarse con uno nuevo aleatorio.

   ### 🏷️ 5. Actualizar versión
   - Este `README.md` contiene un campo de versión como el siguiente:
     ```
     Versión actual: v1.0.0
     ```
   - Tu workflow debe actualizar automáticamente este número de versión siguiendo el esquema `v<major>.<minor>.<patch>`, por ejemplo: `v1.0.1`, `v1.1.0`, etc.
   - Para simplificar, puedes incrementar siempre el patch (`v1.0.0` → `v1.0.1`).

---

## ⚠️ Consideraciones importantes

- ⏱️ **Tiempo máximo de ejecución:** Tu workflow debe completarse en **menos de 3 minutos**. Si se excede ese tiempo, **la actividad no se considerará válida**.

   ```bash
   timeout 180s tu-comando-aqui
   ```

- 🖐️ **Ejecución manual:** Puedes agregar el siguiente bloque al inicio de tu archivo `main.yml` para permitir ejecutar el workflow de forma manual desde la interfaz de GitHub:
   ```yaml
   on:
      push:
      workflow_dispatch:
   ```

---

## 🧪 Revisión

Tu solución debe cumplir con los siguientes criterios:

- [✅] El workflow corre correctamente al hacer `push`.
- [✅] No se excede el tiempo máximo de ejecución.
- [✅] Se ejecuta un linter y el pipeline falla si hay errores.
- [✅] Se ejecutan los 2 tests de la mini app y pasan correctamente.
- [✅] Se obtiene un superhéroe aleatorio de la Superhero API y se actualiza el `README.md` con su información (imagen, nombre, nombre completo, publisher, alignment y powerstats).
- [✅] El número de versión en este archivo se actualiza automáticamente en cada ejecución.

---

## 🦸 Superhéroe del día

Versión actual: v1.0.0

Aquí debes colocar el superhéroe del día con la información solicitada.
