const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs');

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

router.post("/", authenticateToken, async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const confirmationLink = `http://localhost:3001/users/confirm/${token}`;
  
      await sendEmail(
        email,
        "Confirmação de Cadastro",
        `Por favor, confirme seu cadastro clicando no link: ${confirmationLink}`,
        `<p>Por favor, confirme seu cadastro clicando no link: <a href="${confirmationLink}">Confirmar Cadastro</a></p>`
      );
  
      res
        .status(201)
        .send(
          "Usuário registrado com sucesso. Verifique seu email para confirmar o cadastro."
        );
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).send("Usuário já existe.");
      } else {
        res.status(400).send(error.message);
      }
    }
  });

  module.exports = router;