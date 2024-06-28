const express = require('express')
const router = express.Router()

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const ResultType = require('../../models/resultType')

router.get('/', async (req, res) => {
    try {
        const resultType = await ResultType.find().sort({ name: 1 });
        res.status(200).json(resultType);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, measure } = req.body;
    
        const resultType = new ResultType({ name, measure });
        await resultType.save();
        res.status(200).send("Tipo de resultado cadastrado!");
  
    } catch (error) {
        res.status(400).send(error.message);
    }
});
router.delete("/delete-resulttype", async (req, res) => {
  const { name, id } = req.body;

  if (!name && !id) {
    return res.status(400).json({ msg: "Nome ou ID é necessário" });
  }

  try {
    let resultType;
    if (name) {
      resultType = await ResultType.findOneAndDelete({ name });
    } else if (id) {
      resultType = await ResultType.findByIdAndDelete(id);
    }

    if (!resultType) {
      return res.status(404).json({ msg: "Tipo de resultado não encontrado" });
    }

    res.status(200).json({ msg: "Tipo de resultado deletado com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro ao deletar tipo de resultado", error: error.message });
  }
});

  
module.exports = router;