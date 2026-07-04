[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/RzTfUmS0)
# 🛡️ Actividad: Autenticación con JWT y Cookies

En esta actividad, desarrollarás una aplicación React que implementa autenticación JWT usando la API de DummyJSON. Incluye manejo de cookies, renovación de tokens y una interfaz moderna y responsiva.

---

## 🧪 Usuarios de Prueba

Puedes usar cualquiera de estos usuarios de [DummyJSON](https://dummyjson.com/users):

| Username   | Password       | Nombre           |
| ---------- | -------------- | ---------------- |
| `emilys`   | `emilyspass`   | Emily Johnson    |
| `michaelw` | `michaelwpass` | Michael Williams |
| `sophiab`  | `sophiabpass`  | Sophia Brown     |
| `jamesd`   | `jamesdpass`   | James Davis      |
| `emmaj`    | `emmajapass`   | Emma Miller      |

---

# ✅ Requisitos de la actividad

✅ Logrado | ⚠️ Semilogrado | ❌ No logrado
Aquí puedes indicar qué funcionalidades implementaste. Recuerda que para obtener el puntaje máximo debes cumplir todos los requisitos.

* [✅] Al iniciar sesión con credenciales válidas, realizando `POST` a `https://dummyjson.com/auth/login`, se redirige a la vista `/user`.
* [✅] En caso de error al iniciar sesión, se muestra un mensaje de error al ingresar credenciales inválidas.
* [✅] Al ingresar correctamente, se guardan el `accessToken` y `refreshToken` en cookies separadas.
* [✅] El `accessToken` debe almacenarse utilizando la expiración entregada por la API.
* [✅] En la vista `/user` se muestran los datos del usuario: ID, nombre, email, username, género y rol.
* [✅] Se muestra un temporizador que indica la expiración del `accessToken` y se actualiza en caso de refrescar el token.
* [✅] Se refrescan ambos tokens utilizando el `refreshToken`.
* [✅] Si se inicia sesión con "Remember Me" activado, entonces el `refreshToken` debe almacenarse como cookie persistente.
* [✅] Si se inicia sesión con "Remember Me" desactivado, entonces el `refreshToken` debe almacenarse como cookie de sesión.
* [✅] Si el navegador se cierra y existe un `refreshToken` persistente válido, la aplicación podrá mantener la sesión obteniendo un nuevo `accessToken`.
* [✅] Si el `accessToken` expira, se debe mostrar el mensaje `"Expirado"` en el temporizador.
* [✅ ] Si no existe un `refreshToken` válido, no se debe poder refrescar el `accessToken`.
* [✅] La funcionalidad "Cerrar sesión" elimina las cookies y redirige a `'/'`.

---

## 💡 Recomendaciones

* Usa `console.log()` y DevTools para revisar las cookies y validar que el flujo esté correcto.
* Puedes usar https://jwt.io/ para entender el contenido de los tokens.
* Recuerda cerrar completamente el navegador para que se eliminen las cookies de sesión. 

---

## 👀 Observaciones adicionales

Las librerías `jwt-decode` y `js-cookie` fueron utilizadas a modo de ejemplo. El uso realizado en esta actividad es principalmente ilustrativo y educativo para que tengan un primer approach al uso de autenticación manual. Para proyectos serios, deben tener mucho ojo con la privacidad y seguridad de los datos, almacenando `JWT` o sesiones de manera segura (no propenso a ataques `XSS`).

### `jwt-decode`

Se utilizará para leer el payload del JWT en el cliente y mostrar cuánto falta para que expire. Solo decodifica el token; no valida la firma ni garantiza autenticidad. Sirve para UX, no para seguridad. En aplicaciones reales, la validación del JWT se realiza en el backend.

### `js-cookie`

Se utilizará para leer, escribir y eliminar cookies desde el frontend. En aplicaciones reales, el `refreshToken` suele manejarse mediante cookies `HttpOnly`, `Secure` y `SameSite`, emitidas directamente por el backend. El `accessToken` tampoco debe ser accesible mediante `JavaScript`.
