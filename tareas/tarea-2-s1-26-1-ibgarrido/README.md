# Tarea 2 :construction:

* :pencil2: **Nombre:** Ignacio Garrido Bobadilla
* :pencil2: **Correo:** ibgarrido@uc.cl

## Código :symbols:

### :warning: Funcionalidades implementadas y no implementadas
✅ Logrado | ⚠️ Semilogrado | ❌ No logrado



## 1. Autenticación
- Registro de usuario (`POST /register`)✅
- Login (`POST /login`)✅
---

## 2. Usuarios (`/users`)

- Obtener usuario por ID (`GET /:id`)✅ 
- Actualizar usuario (`PUT /:id`)✅ 
- Eliminar usuario (`DELETE /:id`)✅ 

---

## 3. Artistas (`/artists`)

### Consultas
- Obtener todos los artistas (`GET /`) ✅ 
- Obtener artistas del usuario (`GET /my`) ✅ 
- Obtener detalle de artista (`GET /:artistId`) ✅ 
- Crear artista (`POST /`)✅ 
- Editar artista (`PUT /:artistId`)✅ 
- Eliminar artista (`DELETE /:artistId`)✅ 
- Comprar artista (`POST /:artistId/buy`)✅ 
- Vender artista (`POST /:artistId/sell`)✅ 
- Agregar favorito (`POST /:artistId/favorite`)❌
- Eliminar favorito (`DELETE /:artistId/favorite`)❌

---

## 4. Reseñas (`/reviews`)

- Crear reseña (`POST /reviews`) ❌
- Obtener reseñas del usuario (`GET /my`) ✅ 
- Obtener reseña por ID (`GET /:reviewId`) ❌
- Obtener reseñas de un artista (`GET /artist/:artistId`) ❌
- Editar reseña (`PUT /:reviewId`) ❌
- Eliminar reseña (`DELETE /:reviewId`) ❌



## Postgres
```
# Indica los comandos de terminal necesarios para inicializar la base de datos acá

**disclaimer: La tarea fue hecha en un macbook**

1. Como inicializar psql

I. Para entrar a postgres hacemos: sudo -u postgres /Library/PostgreSQL/17/bin/psql

2. Como crear el usuario de postgres

I. Creamos un usuario: CREATE USER dcc_user WITH ENCRYPTED PASSWORD 'comidachina123';
II. le damos privilegios al usuario: GRANT ALL PRIVILEGES ON DATABASE dccpalooza_db TO dcc_user;

3. Como crear la base de datos

II.  Creamos la base de datos: CREATE DATABASE dccpalooza_db;

4. Como crear la clave del usuario

I. Definimos o cambiamos la contraseña del usuario:
ALTER USER dcc_user WITH ENCRYPTED PASSWORD 'comidachina123';

5. Como conectarse a la base de datos

dentro de postgres: \c dccpalooza_db;

```


## Entorno
Una vez creada la base de datos e inicializado psql, se debe crear un archivo `.env`

```
1. Indica el usuario de la base de datos

DB_USER=dcc_user

2. Indica la contraseña del usuario de la base de datos

DB_PASSWORD=comidachina123

3. Indica el nombre de la base de datos

DB_NAME=dccpalooza_db

4. Indica el host de la base de datos

DB_HOST=localhost

5. Indica el puerto en el que correrá la aplicación

DB_PORT=5432

```

## Sequelize

### Configuración inicial de Sequelize:
Crear un archivo llamado `.sequelizerc` en la raíz del proyecto para indicarle al CLI de Sequelize que nuestra estructura de carpetas vive dentro de `src/`:
```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('src', 'config', 'config.json'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeders'),
  'migrations-path': path.resolve('src', 'migrations')
};
```

Inicializar la estructura de carpetas de Sequelize ejecutando:
```bash
yarn sequelize-cli init
```

Finalmente, actualizar el archivo generado en `src/config/config.json` para que el entorno de desarrollo coincida con la base de datos local:
```json
{
  "development": {
    "username": "dcc_user",
    "password": "comidachina123",
    "database": "dccpalooza_db",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

### User
```
yarn sequelize-cli model:generate --name User --attributes username:string,password:string,balance:integer,image:string
```

### Artist
```
yarn sequelize-cli model:generate --name Artist --attributes name:string,hypeLevel:integer,genres:string,price:integer,imageUrl:string,ownerId:integer
```

### Review
```
yarn sequelize-cli model:generate --name Review --attributes rating:integer,comment:text,userId:integer,artistId:integer
```

### FavoriteArtist
```
yarn sequelize-cli model:generate --name FavoriteArtist --attributes userId:integer,artistId:integer
```

## Seeds

### Generar seeds

Se crea el archivo que almacenará los datos iniciales en la base de datos. En Up metemos los datos y en Down ponemos como borrar la base de datos para revertirla.
```
yarn sequelize-cli seed:generate --name initial-data
```

### Cargar seeds


Luego reiniciamos e iniciamos la base de datos:

```
yarn sequelize-cli db:seed:undo:all
yarn sequelize-cli db:seed:all
```
## Bibliografia
```
# Coloca aquí la bibliografía
# Esto incluye el uso de IA, sitios web, etc.
- GEMINI AI (Citado en los routes cuando fue usado, para solucionar problemas que me estancaban)
- https://sequelize.org/docs/v6/core-concepts/model-querying-finders/ findByPk
- https://medium.com/@svk19998/building-a-secure-login-system-with-node-js-bcrypt-and-jwt-authentication-b3e5b25de218
- https://stackoverflow.com/questions/40076638/compare-passwords-bcryptjs (bcrypt compare)
- https://stackoverflow.com/questions/56855440/in-jwt-the-sign-method (Sign method)
- https://youtu.be/ZC8tlSOAXLg

```
