# 📝 Tarea: To-Do List con IndexedDB + Caché
Esta aplicación es una pequeña To-Do list que persiste datos en IndexedDB y permite subir/quitar una imagen de fondo guardada en la caché del navegador.

## Instalación y Ejecución
```bash
yarn
yarn dev
```


## 😁 Funcionalidades preexistentes
El código entregado actualmente permite:

- Crear, tachar y eliminar tareas.
- Cargar tareas desde una API (para generar ejemplos rápidamente).

> **Nota:** La API utilizada es JSONPlaceholder. Los POST a esta API son simulados y no persisten en un servidor real — la persistencia real de tus tareas depende de tu implementación en IndexedDB.

## 🎯 Objetivo
Completar y verificar que la aplicación permita:

- Guardar la información localmente usando **IndexedDB**.
- Subir y quitar una imagen de fondo, utilizando la **caché** del navegador.


## 📦 Código a Completar

### `src/db.js` — Funciones de IndexedDB
Todas estas funciones son utilizadas en `src/components/Container.jsx`

1. **`initDB()`** - Inicializar la base de datos IndexedDB
   - Debe abrir la base de datos con el nombre `TodoAppDB` y versión 2
   - Crear los object stores necesarios: `todos`, `pending_todos` definidos en las variables globales.
   - Retornar una promesa que resuelva con la conexión a la base de datos

2. **`saveTodos(todos)`** - Guardar una lista de todos en IndexedDB
   - Limpiar todos existentes en el store de `todos`
   - Guardar los nuevos todos en el store
   - Normalizar los todos con `normalizeTodo()` antes de guardarlos

3. **`loadTodos()`** - Cargar todos los todos desde IndexedDB
   - Obtener todos los registros del store `todos`
   - Retornar una promesa que resuelva con el array de todos

4. **`savePendingTodo(todo)`** - Guardar un todo pendiente en IndexedDB
   - Agregar el todo al store `pending_todos`
   - Esto se usa cuando falla el guardado en la API remota

5. **`loadPendingTodos()`** - Cargar todos los pendientes desde IndexedDB
   - Obtener todos los registros del store `pending_todos`
   - Retornar una promesa que resuelva con el array de pendientes

6. **`clearPendingTodos()`** - Limpiar todos los pendientes de IndexedDB
   - Eliminar todos los registros del store `pending_todos`
   - Se usa después de sincronizar exitosamente con la API

### `src/components/Container.jsx` — Funciones de Caché

1. **`loadCachedImage()`** (dentro del `useEffect`) - Cargar la imagen de fondo desde el caché
   - Abrir el caché `background-cache`
   - Buscar la respuesta almacenada con la clave `cacheKey`
   - Si existe, convertir el blob a una URL de objeto y actualizar `bgUrl`

2. **`handleImageUpload(e)`** - Manejar la subida de una imagen de fondo
   - Extraer el archivo del evento del input
   - Guardar el archivo en el caché del navegador usando `caches.open('background-cache')` y `cache.put()`
   - Crear una URL de objeto con `URL.createObjectURL(file)`
   - Actualizar el estado `bgUrl` con la nueva URL

3. **`handleDeleteImage()`** - Eliminar la imagen de fondo del caché
   - Abrir el caché `background-cache`
   - Eliminar la entrada con la clave `cacheKey`
   - Limpiar el estado `bgUrl` estableciéndolo como string vacío

## 🔌 Cómo simular el Modo Offline (DevTools)

Para probar las funcionalidades de pendientes offline:

1. Abre Chrome DevTools (`F12`)
2. Ve a la pestaña **Network**
3. En el selector de throttling, elige **Offline**
4. Intenta crear una tarea — debe guardarse en `pending_todos`
5. Vuelve a **Online** y presiona **"Sync Pending"** para sincronizar

## ✅ Criterios de Evaluación

Se evaluará que:

- Al **refrescar la página**, las tareas (to-do's) sigan creadas.
- Al cerrar el navegador y volver a abrirlo, se carguen correctamente las tareas preexistentes.
- Se pueda **cargar una imagen de fondo**, que debe estar almacenada en la **caché**.
- Se pueda **eliminar la imagen de fondo**, eliminandose del **caché**.
- Al **refrescar la página**, la imagen subida siga mostrandose.
- Al cerrar el navegador y volver a abrirlo, se cargue la imagen que subió anteriormente.
- Al **cortar el internet** en el navegador e intentar crear una tarea, esta debe guardarse en `pending_todos` mediante IndexedDB y reflejar el botón de sincronización.
- Al **restablecer la red** y presionar "Sync Pending", se deben despachar las tareas acumuladas y limpiar el almacén local de pendientes.
- Responder correctamente al menos 4 preguntas del Readme (es decir, la que quieras queda como bonus)

Las funcionalidades deben ser realizadas con Indexed DB (Todo's) y con caché (imágenes). En caso contrario, no se asignará puntaje.

Recomendamos utilizar chrome como navegador para comprobar las funcionalidades.

## 🧠 Preguntas y respuestas

**1. ¿Cómo funciona IndexedDB?**  

IndexedDB es una base de datos no SQL que viene integrado en los navegadores web y almacena los datos en "objects stores" en lugar de tablas. Por otra parte, organiza los datos mediante pares key-value. 

**2. ¿Qué ventajas tiene el uso de IndexedDB?**  

En primer lugar, permite almacenar datos de manera persistente. Esta es una ventaja muy grande ya que permite trabajar de manera Offline y actualizar la DB cuando vuelve la conexión a internet.

En segundo lugar opera de manera asincrónica, lo cual evita que el bloque principal de ejeución se bloquee. Para ello se gestiona usando promises y events.

En tercer lugar, posee mucho más almacenamiento que en comparación al localStorage, lo cual permite almacenar objetos más complejos como archivos o blobs.
---

**3. Explica 2 ventajas y 2 desventajas de bases de datos SQL**  

Ventajas:
1. SQL se basa en la premisa de ACID, lo que permite garantizar atomicidad, consistencia, aislamiento y durabilidad de las transacciones que permiten consultar datos en la DB.
2. Las queries de búsqueda de datos suelen ser robustas, ya que se basan en la operación JOIN, la cual permite cruzar múltiples tablas para generar información relacionada mucho más compleja.

---

Desventajas:
1. Los esquemas son rígidos, es decir, que una vez uno define la estructura de una tabla y sus tipos de datos, modificarlas toma tiempo, lo cual dificulta a cambios drásticos.
2. Cuando crece el volumen de datos, requieren mejoras en el sistema (No es solo agregar memoria sino también CPU y RAM para acelerar el manejo de datos y para tener mayor capacidad en el buffer).


**4. Explica 2 ventajas y 2 desventajas de bases de datos NoSQL**  
Ventajas:
1. Permite almacenar información que no es estructura, como archivos JSON, careciendo así de un esquema tradicional. (schemaless)
2. Facilidad para distribuir las cargas de trabajo en clusteres, lo cual permite un mejor manejo de grandes volúmenes de datos.

---

Desventajas:
1. No es un arquetipo estandarizado. A diferencia de SQL, existen muchos tipos de bases de datos NO SQL, por lo que migrar de un modelo a otro puede ser muy complejo.
2. Al no ser ACID, no es una opción buena para sistemas que requieren integridad absoluta en tiempo real de los datos.

**5. ¿Para qué sirve cachear archivos en el navegador?**

Sirve para almacenar Assets localmente en el dispositivo del usuario, mediante el uso de Cache API. La mayor utilidad de esto, es que permite reducir el aumento de tiempo de carga por peticiones repetidas, delegando así el almacenamiento de algunos objetos al navegador y no al servidor que hostea un sistema.


## 💡 Declaración uso de IA y referencias

Si usaste inteligencia artificial o usaste referencias, profundiza aquí su uso y los links o referencias que utilizaste

- Uso de GEMINI AI para que me explicara el contenido de la actividad, la lógica, métodos a utilizar de IndexedDB. (Lo tengo configurado para que no me de código salvo que yo se lo pida explícitamente).