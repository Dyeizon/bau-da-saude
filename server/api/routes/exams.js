const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Exams = require('./../../models/exams');

router.get('/', async (req, res) => {
    try {
        const exams = await Exams.find();
        res.status(200).json(exams);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { examName, examDate, examType, results } = req.body;
  
        console.log("Dados recebidos:", req.body);
        
        const exams = new Exams({ examName, examDate, examType, results });
        await exams.save();
        res.status(200).send("Exame cadastrado!");
    } catch (error) {
        console.error("Erro ao cadastrar exame:", error);
        res.status(500).send(error);
    }
});
  
module.exports = router;