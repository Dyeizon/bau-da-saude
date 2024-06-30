const express = require('express')
const router = express.Router()

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authenticateToken = require('./../middlewares/authenticate')
const User = require('./../../models/user')

const { sendEmail } = require("./../mailer");

router.get('/', authenticateToken, async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send(error);
    }
});

router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Erro ao verificar o usuário:', error);
    res.status(500).json({ error: 'Erro ao verificar o usuário' });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password, birthDate } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      birthDate
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    await sendEmail(
      email,
      "Bem-vindo(a) ao nosso aplicativo Baú da Saúde",
      `Olá ${name}, seja bem-vindo(a) ao Baú da Saúde! Estamos muito felizes em ter você conosco. Juntos, vamos construir um caminho para uma vida mais saudável e plena.`,
      `<p>Olá <strong>${name}</strong>, 
      seja bem-vindo(a) ao <strong>Baú da Saúde</strong>! Estamos muito felizes em ter você conosco. Juntos, vamos construir um caminho para uma vida mais saudável e plena.</p>`
    );

    res.status(201).send({
      token: `Bearer ${token}`,
      message: "Usuário registrado com sucesso!",
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("Usuário já existe.");
    } else {
      res.status(400).send(error.message);
    }
  }
});


  module.exports = router;