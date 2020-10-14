const app = require('express')()

module.exports.app = app;

require('./routes/sucursales')(app);