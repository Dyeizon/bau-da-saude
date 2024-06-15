const express = require('express');
const app = express();
const indexRouter = require('./routes/index');

require('./dbconnection');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cors = require('cors');

const cookieParser = require('cookie-parser');

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../api/swagger.json");

const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/', indexRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`API em ExpressJS, porta ${port}`);
});

module.exports = app; //exporta o app para o Vercel