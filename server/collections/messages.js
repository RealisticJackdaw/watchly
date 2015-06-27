var db = require('../config.js');

var Message = require('../models/incident.js');

var Incidents = new db.Collection();
Messages.model = Message;

module.exports = Messages;
