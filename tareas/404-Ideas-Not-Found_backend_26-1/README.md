# 404 Ideas Not Found — Backend

Backend REST API para el proyecto de e-commerce del curso IIC2513. Construido con Node.js, Express, Sequelize v6 y PostgreSQL.

---

## Stack

- **Runtime:** Node.js ≥ 18
- **Framework:** Express
- **ORM:** Sequelize v6
- **Base de datos:** PostgreSQL
- **Gestor de paquetes:** pnpm

---

## Requisitos previos

- Node.js ≥ 18
- PostgreSQL instalado y corriendo
- pnpm (`npm install -g pnpm`)

---

## Variables de entorno

Copia `.env_example` a `.env` y completa los valores:

```bash
cp .env_example .env
```

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `mi_db` |
| `DB_USER` | Usuario de PostgreSQL | `mi_usuario` |
| `DB_PASSWORD` | Contraseña del usuario | `mi_contrasena` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | cadena aleatoria larga |
| `JWT_EXPIRES_IN` | Duración del token | `4h` |
| `PORT` | Puerto en que corre el servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |

---

## Configuración local

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Crear la base de datos (Linux)



```bash
sudo service postgresql start   # instalar con: sudo apt install postgresql

sudo -i -u postgres
createuser mi_usuario
createdb mi_db
psql
ALTER USER mi_usuario WITH ENCRYPTED PASSWORD 'mi_contrasena';
GRANT ALL PRIVILEGES ON DATABASE mi_db TO mi_usuario;
ALTER USER mi_usuario CREATEDB;
\c mi_db
GRANT ALL ON SCHEMA public TO mi_usuario;
\q
exit
```

> Reemplaza `mi_usuario`, `mi_db` y `mi_contrasena` con los valores que pusiste en `.env`.

### 3. Ejecutar migraciones y seed

```bash
pnpm sequelize-cli db:migrate
pnpm sequelize-cli db:seed:all
```

### 4. Iniciar el servidor
Recordar iniciar la base de datos!!!
```bash
pnpm dev      # desarrollo (con hot-reload)
pnpm start    # producción
```

El servidor queda disponible en `http://localhost:3000`.

---

## Resetear la base de datos (desarrollo)

Útil para probar el seed desde cero:

```bash
pnpm sequelize-cli db:migrate:undo:all && pnpm sequelize-cli db:migrate && pnpm sequelize-cli db:seed:all
```

> En Render esto ocurre automáticamente en cada deploy (por diseño).

---

## Producción (Render)

La API está desplegada en:

```
https://four04-ideas-not-found-backend-26-1.onrender.com
```

La documentación de endpoints para el frontend está en [`/docs/API.md`](/docs/API.md).

---

## Diagrama ER

![Diagrama ER](/docs/ER-model.jpeg)
