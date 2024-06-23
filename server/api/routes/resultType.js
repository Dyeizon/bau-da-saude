const express = require('express')
const router = express.Router()

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const ResultType = require('../../models/resultType')

router.get('/', async (req, res) => {
    try {
        const resultType = await ResultType.find();
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
  
module.exports = router;