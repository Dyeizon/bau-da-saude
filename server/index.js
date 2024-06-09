require('dotenv').config()
require('./MongoConnection');

const express = require('express')
const app = express()
const port = 3001


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Backend em Express, porta ${port}`)
})