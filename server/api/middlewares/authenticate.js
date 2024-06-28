const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    var token;

    if(authHeader && authHeader.split(' ')[0] === 'Bearer') {
        token = authHeader.split(' ')[1];
    } else {
        token = authHeader;
    }
  
    if (token == null) return res.status(401).send({ error: 'Token não fornecido' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;