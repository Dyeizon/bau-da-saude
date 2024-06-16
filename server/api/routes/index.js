const express = require('express');
const router = express.Router();

const authenticateToken = require('./../middlewares/authenticate')

const userRouter = require('./users')
const loginRouter = require('./auth')
const typesRouter = require('./examType')

router.use('/users', userRouter);
router.use('/auth', loginRouter);
router.use('/types', typesRouter);

router.get('/', authenticateToken, (req, res) => {
    res.status(200).send('API | Baú da Saúde');
});

module.exports = router;