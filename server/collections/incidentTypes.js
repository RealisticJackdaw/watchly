var db = require('../config.js');

var IncidentType = require('../models/incident.js');

var IncidentTypes = new db.Collection();
IncidentTypes.model = IncidentType;

module.exports = IncidentTypes;
