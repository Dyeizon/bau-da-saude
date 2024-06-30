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

router.post('/', upload.single('examFile'), async (req, res) => {
    try {
        const { owner, examName, examDate, examType, results } = Object.assign({}, req.body);
        
        if(req.file && req.file.size > 12000000) return res.status(400).send("Erro ao cadastrar exame: arquivo muito grande.")

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

router.get('/owner/:owner', authenticateToken, authorizeOwner, async (req, res) => {
    try {
        const { owner } = req.params;

        const exams = await Exams.find({owner: owner}).populate('type').sort({date: -1});
        res.status(200).json(exams);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const exam = await Exams.findById(req.params.id).populate('type', 'name -_id').populate('owner', 'name birthDate -_id');

        res.status(200).json(exam);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Exams.deleteOne({ _id: id, owner: req.user.id });

        if(result.deletedCount === 0) {
            return res.status(404).json({ error: 'Exam not found or not authorized.' });
        }
        
        res.status(200).send({message: 'Exam deleted.'});
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/download/:id', async (req, res) => {
    try {
        const exam = await Exams.findById(req.params.id, {file: 1, contentType: 1});

        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }

        if (!exam.file) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.set('Content-Type', exam.contentType);
        res.send(exam.file);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/data/select', authenticateToken, async (req, res) => {
    try {
        const owner = req.query.owner;
        const examType = req.query.examType;
        const resultType = req.query.resultType;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        if(!owner || !examType || !resultType) {
            return res.status(404).json({ error: 'Insuficcient query.' });
        }

        var exams;
        
        if(startDate && endDate) {
            exams = await Exams.find({
                owner: owner,
                type: examType,
                'results.resultId': resultType,
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }, {
                date: 1,
                'results.resultValue': 1,
                'results.selectedMeasure': 1,
                _id: 0
            }).sort({ date: 1 });
        } else {
            exams = await Exams.find({
                owner: owner,
                type: examType,
                'results.resultId': resultType
              }, {
                date: 1, 
                'results.resultValue': 1, 
                'results.selectedMeasure': 1, 
                _id: 0
            }).sort({ date: 1 });
        }

        if(exams.length <= 0) {
            return res.status(403).json({error: 'No exams matching this criteria were found.'})
        }

        const destructuredExams = exams.flatMap(({ date, results }) => 
            results.map(result => ({
            resultValue: parseFloat(result.resultValue),
            date
            }))
        );

        console.log(destructuredExams);

        res.status(200).send({results: destructuredExams, measure: exams[0].results[0].selectedMeasure}); 
    } catch (error) {
        console.error('Error selecting exams:', error);
        res.status(400).json({ error: 'Error selecting exams' });
    }
});
  
module.exports = router;