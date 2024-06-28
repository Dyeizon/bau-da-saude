const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const multer = require('multer');

const Exams = require('./../../models/exams');

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.get('/', async (req, res) => {
    try {
        const exams = await Exams.find();
        res.status(200).json(exams);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/', upload.single('examFile'), async (req, res) => {
    try {
        const { owner, examName, examDate, examType, results } = Object.assign({}, req.body);

        console.log("Dados recebidos:", Object.assign({}, req.body));
        
        const exams = new Exams({ 
            owner, 
            name: examName, 
            date: new Date(examDate),
            type: examType, 
            results: JSON.parse(results), 
            file: req.file.buffer, 
            contentType: req.file.mimetype
        });

        await exams.save();
        res.status(200).send("Exame cadastrado!");
    } catch (error) {
        console.error("Erro ao cadastrar exame:", error);
        res.status(500).send(error);
    }
});
  
module.exports = router;