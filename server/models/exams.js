const mongoose = require('mongoose');

const examsSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'ExamType'
    },
    results: [
        {
            selectedName: String,
            resultValue: String,
            selectedMeasure: String,
            resultId: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'ResultType'
            }
        }
    ],

    file: {
        type: Buffer,
        required: false,
    },

    contentType: {
        type: String,
        required: false,
    }
});

const Exams = mongoose.model('Exams', examsSchema, 'exams');

module.exports = Exams;