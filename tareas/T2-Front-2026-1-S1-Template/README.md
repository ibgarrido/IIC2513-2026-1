# Tarea-2-s1-26-1 FRONTEND

**RECUERDA**: este repositorio solo sirve para probar tu código de la API. No debes modificarlo a menos que quieras cambiar el puerto en donde se aloja la aplicación. 

## Instalación 👷 🛠️

0. Haz un fork de este repositorio.
   
1. Clona tu repositorio individual:
  ```bash
  git clone <URL-de-tu-repo>
  cd <URL-de-tu-repo>
  ```

2. Crea un archivo `.env` en la raíz del proyecto con la URL de la API:

```
VITE_API_URL=http://localhost:3000/
```

3. Instala las dependencias

```bash
    pnpm install
```
4. Levanta el entorno de desarrollo:
```bash
   pnpm run dev
```

5. En caso de que en la consola aparezca algún error o advertencia, lee con atención el output:
Puede solicitarte instalar dependencias adicionales o realizar configuraciones específicas, simplemente guíate por lo que sale. En caso de dudas, puedes preguntar en las issues.



# Tarea-2-s1-25-2 FRONTEND
**RECUERDA**: este repositorio solo sirve para probar tu código de la API. No debes modificarlo a menos que quieras cambiar el puerto en donde se aloja la aplicación. 

## Instalación 👷 🛠️

0. Haz un fork de este repositorio.
   
1. Clona tu repositorio individual:
  ```bash
  git clone <URL-de-tu-repo>
  cd <URL-de-tu-repo>
  ```
2. Instala las dependencias
```bash
   yarn install
```
3. Levanta el entorno de desarrollo:
```bash
   yarn dev
```
4. En caso de que en la consola aparezca algún error o advertencia, lee con atención el output:
Puede solicitarte instalar dependencias adicionales o realizar configuraciones específicas, simplemente guíate por lo que sale. En caso de dudas, puedes preguntar en las issues.



## ⚙️ Requisitos previos
Asegurate de cumplir con los requerimientos de la aplicación.
- [Node.js](https://nodejs.org/) versión **>= 20**


También puedes usar otro gestor de paquetes :D



## Notas

Importante mencionar que este es una tarea que se desarrolló con harto uso de IA para dejárselas listas lo más rápido posible. La estructura del proyecto no es necesariamente la mejor, para que no seguíen estrictamente por modularizaciones de front basados en esta para el futuro. De hecho, probablemente para un proyecto real o en un plazo mayor, se pueden hacer hartas optimizaciones y mejoras en la calidad del código.


### Solicitudes a la API
Las solicitudes a la API están centralizadas en la carpeta src/api/. Así es más fácil mantener el código ordenado y reutilizar código. Acá pueden analizar más claramente también cómo se realizan esas requests y se implementan a nivel de código, para que puedan analizar el funcionamiento del front en base a las peticiones a las APIs que creen ustedes. 