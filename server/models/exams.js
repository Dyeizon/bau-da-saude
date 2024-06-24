const mongoose = require('mongoose');

const examsSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
    },
    examDate: {
        type: Date,
        required: true,
    },
    examType: {
        type: String,
        required: true,
    },
    results: [
        {
            selectedName: String,
            resultValue: String,
            selectedMeasure: String
        }
    ]
});

const Exams = mongoose.model('Exams', examsSchema, 'exams');

module.exports = Exams;