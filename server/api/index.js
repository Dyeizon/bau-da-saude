const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express')
const mongoose = require('mongoose')

const User = require('../models/user')

const app = express()
const port = 3001

app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
  console.log('Connected to MongoDB')
}).catch((err) => {
  console.error('Error connecting to MongoDB', err)
})

app.get('/', (req, res) => {
  res.send('API | Baú da Saúde')
})

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if(!user) {
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.listen(port, () => {
  console.log(`API em ExpressJS, porta ${port}`)
})

// In order to Vercel work the routes
module.exports = (req, res) => {
  app(req, res)
}