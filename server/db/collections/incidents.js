var db = require('../../config/dbconfig');

var Incident = require('../models/incident.js');

var Incidents = new db.Collection();
Incidents.model = Incident;

module.exports = Incidents;

