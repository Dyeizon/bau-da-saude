const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { sendEmail } = require("../api/mailer");
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../api/swagger.json");


const app = express();
const port = process.env.PORT || 3001; // Use a porta definida no arquivo .env ou a porta 3001 como padrão

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

app.get('/', (req, res) => {
  res.send('API | Baú da Saúde');
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha antes de salvar no banco de dados

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
      // Código de erro 11000 é para duplicidade de chave
      res.status(400).send("Usuário já existe.");
    } else {
      res.status(400).send(error.message);
    }
  }
});

app.get("/confirm/:token", async (req, res) => {
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

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/users/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    
    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});


app.post("/forgot-password", async (req, res) => {
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
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
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

app.post("/reset-password/:token", async (req, res) => {
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

app.delete("/delete-user", async (req, res) => {
  const { email, id } = req.body;

  if (!email && !id) {
    return res.status(400).json({ msg: "Email ou ID é necessário" });
  }

  try {
    let user;
    if (email) {
      user = await User.findOneAndDelete({ email });
    } else if (id) {
      user = await User.findByIdAndDelete(id);
    }

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    res.status(200).json({ msg: "Usuário deletado com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro ao deletar usuário", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API em ExpressJS, porta ${port}`);
});

// Exporta o aplicativo para que funcione com Vercel
module.exports = app;
