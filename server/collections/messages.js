var db = require('../config.js');

var Message = require('../models/message.js');

var Messages = new db.Collection();
Messages.model = Message;

module.exports = Messages;
