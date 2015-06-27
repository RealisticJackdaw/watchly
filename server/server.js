// dependencies
var express = require('express');
var app = express();

///////// testing ///////////
var knex = require('./config/knex-config');
var IncidentTypes = require('./db/collections/incidentTypes');
var IncidentType = require('./db/models/incidentType');

app.get('/getIncidentTypes', function (req, res) {
  knex.select('type', 'iconFilename').from('incidentTypes')
    .then(function (rows) {
      res.send(rows);
    });
});
////////////////////////////////

require('./config/middleware.js')(app, express);

// export our app for testing and flexibility, required by index.js
module.exports = app;
