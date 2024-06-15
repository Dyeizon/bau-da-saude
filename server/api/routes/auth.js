const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user')
const { sendEmail } = require('./../mailer');

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
  
        if (!user) {
            return res.status(404).send({ error: 'Usuário não encontrado' });
        }
  
        const isPasswordValid = await bcrypt.compare(password, user.password);
  
        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Credenciais inválidas' });
        }
  
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).send({ message: 'Login bem-sucedido' });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send("Usuário não encontrado.");
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const resetLink = `http://localhost:3001/users/reset-password/${token}`;
  
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();
  
      await sendEmail(
        email,
        "Redefinição de Senha",
        `Você solicitou a redefinição de sua senha. Por favor, redefina sua senha clicando no link: ${resetLink}`,
        `<p>Você solicitou a redefinição de sua senha. Por favor, redefina sua senha clicando no link: <a href="${resetLink}">Redefinir Senha</a></p>`
      );
  
      res.send("Email de redefinição de senha enviado.");
    } catch (error) {
      res.status(400).send(error.message);
    }
});
  
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Token inválido ou expirado.");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send("Senha redefinida com sucesso!");
  } catch (error) {
    res.status(400).send("Token inválido ou expirado.");
  }
});

router.get("/confirm/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).send("Usuário não encontrado.");
    }

    user.isVerified = true;
    await user.save();

    res.send("Cadastro confirmado com sucesso!");
  } catch (error) {
    res.status(400).send("Token inválido ou expirado.");
  }
});

module.exports = router;