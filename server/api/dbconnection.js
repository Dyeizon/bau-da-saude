const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');

(function () {
    mongoose.connect(process.env.MONGODB_URI, {
    }).then(() => {
      console.log('Conectado ao MongoDB');
    }).catch((err) => {
      console.error('Erro ao conectar ao MongoDB', err);
    });
})();
