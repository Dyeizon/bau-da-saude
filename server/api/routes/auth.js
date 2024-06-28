const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");


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
  
        res.status(200).send({ token: `Bearer ${token}` });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }
    const token = crypto.randomInt(1000, 9999).toString(); 
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    await sendEmail(
      email,
      "Redefinição de Senha",
      `<p>Olá <strong>${user.name}</strong>,</p>
       <p>Recebemos uma solicitação para um código de recuperação de senha da sua conta.<br>Use o código abaixo para redefinir sua senha e continuar aproveitando os benefícios do <strong>Baú da Saúde</strong>:</p>
       <p style="font-size: 18px; font-weight: bold;">${token}</p>
       <p>Caso não tenha solicitado esse código, pode ignorar a presente mensagem com segurança. Outra pessoa pode ter digitado seu e-mail por engano.</p>
       <p>Se precisar de qualquer ajuda, nossa equipe está à disposição.</p>
       <p>Atenciosamente,<br>Equipe Baú da Saúde</p>`
    );

    res.json({ message: "Código de redefinição de senha enviado." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Token inválido ou expirado.");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send("Senha redefinida com sucesso!");
  } catch (error) {
    res.status(400).send(error.message);
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