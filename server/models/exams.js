const mongoose = require('mongoose');

const examsSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    results: [
        {
            selectedName: String,
            resultValue: String,
            selectedMeasure: String
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