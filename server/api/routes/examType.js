const express = require('express')
const router = express.Router()

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const ExamType = require('./../../models/examType')

router.post('/types', async (req, res) => {
    try {
        const { name } = req.body;
    
        const examType = new ExamType({ name });
        await examType.save();
  
    } catch (error) {
        res.status(400).send(error.message);
    }
});
  
module.exports = router;