var db = require('../../config/dbconfig');

var IncidentType = require('../models/incident.js');

var IncidentTypes = new db.Collection();
IncidentTypes.model = IncidentType;

module.exports = IncidentTypes;
