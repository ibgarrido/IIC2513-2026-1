require('dotenv').config(); // Linea adicional para cargar variables de entorno desde un archivo .env (Fuente: Gemini AI)

const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes.js');
const { sequelize } = require('./models');


const app = express();

app.use(cors());
app.use(express.json());


// usar router aquí
app.use('/', routes); // Esto hace que todas las rutas definidas en routes.js estén disponibles bajo la raíz ("/") del servidor.
// Hice esta versión ya que GEMINI AI me sugirió hacerlo en lugar de la forma de la cápsula que era importar
// las rutas directamente
// https://youtu.be/ZC8tlSOAXLg

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
});

