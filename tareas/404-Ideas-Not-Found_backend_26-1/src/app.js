const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const { sequelize } = require('./models');
const routes = require('./routes/routes.js');
const { startOrderStatusJob } = require('./jobs/orderStatusAdvancer');


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// usar router aquí
app.use(routes);

const PORT = process.env.PORT || 3000;

sequelize.authenticate().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
    startOrderStatusJob();
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});