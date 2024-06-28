const Exams = require('./../../models/exams');

const authorizeOwner = async (req, res, next) => {
    try {
        const { owner } = req.params;
        const user = req.user;
        
        const exams = await Exams.find({ owner: owner });

        if (!exams || exams.length === 0 || exams[0].owner.toString() !== user.id) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        next();
    } catch (error) {
        console.error('Error authorizing owner:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authorizeOwner;
