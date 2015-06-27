var db = require('../config.js');

var Incident = require('../models/incident.js');

var Incidents = new db.Collection();
Incidents.model = Incident;

module.exports = Incidents;

