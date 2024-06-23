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
  
module.exports = router;