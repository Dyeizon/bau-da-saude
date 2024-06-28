const express = require('express');
const router = express.Router();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const multer = require('multer');

const Exams = require('./../../models/exams');

const authenticateToken = require('./../middlewares/authenticate');
const authorizeOwner = require('./../middlewares/authorizeOwner');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:owner', authenticateToken, authorizeOwner, async (req, res) => {
    try {
        const { owner } = req.params; 
        const exams = await Exams.find({owner: owner});
        res.status(200).json(exams);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/', upload.single('examFile'), async (req, res) => {
    try {
        const { owner, examName, examDate, examType, results } = Object.assign({}, req.body);

        console.log("Dados recebidos:", Object.assign({}, req.body));
        
        console.log(req.file);
        
        if(req.file && req.file.size) res.status(400).send("Erro ao cadastrar exame: arquivo muito grande.")


        const exams = new Exams({ 
            owner, 
            name: examName, 
            date: new Date(examDate),
            type: examType, 
            results: JSON.parse(results), 
            file: req.file ? req.file.buffer : undefined, 
            contentType: req.file ? req.file.mimetype : undefined
        });

        await exams.save();
        res.status(200).send("Exame cadastrado!");
    } catch (error) {
        console.error("Erro ao cadastrar exame:", error);
        res.status(500).send(error);
    }
});
  
module.exports = router;