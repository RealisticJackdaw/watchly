// dependencies
var express = require('express');
var app = express();

require('./config/middleware.js')(app, express);

// export our app for testing and flexibility, required by index.js
module.exports = app;
