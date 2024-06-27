const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const ExamType = require('./../../models/examType');

router.get('/', async (req, res) => {
    try {
        const examTypes = await ExamType.find();
        res.status(200).json(examTypes);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
    
        const examType = new ExamType({ name });
        await examType.save();
        res.status(200).send("Tipo de exame cadastrado!");
  
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete("/delete-examtype", async (req, res) => {
  const { name, id } = req.body;

  if (!name && !id) {
    return res.status(400).json({ msg: "Nome ou ID é necessário" });
  }
  try {
    let examType;
    if (name) {
      examType = await ExamType.findOneAndDelete({ name });
    } else if (id) {
      examType = await ExamType.findByIdAndDelete(id);
    }

    if (!examType) {
      return res.status(404).json({ msg: "Tipo de exame não encontrado" });
    }

    res.status(200).json({ msg: "Tipo de exame deletado com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro ao deletar tipo de exame", error: error.message });
  }
});

  
module.exports = router;