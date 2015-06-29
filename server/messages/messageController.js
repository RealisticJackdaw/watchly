var knex = require('../config/knex-config.js')
var Message = require('../db/models/message');
var Messages = require('../db/collections/messages');

module.exports = {
  getMessagesForIncident: function (req, res) {
    var incidentsId = req.body.incidentsId;

    knex('messages').where({'incidentsId': incidentsId })
      .then(function (rows) {
        console.log(rows);
        res.send(rows);
      });
  },
  newMessage: function (req, res) {
    var userId = req.session.userId;
    req.body.userId = userId;

    new Message(req.body).save().then(function (newIncident) {
      Messages.add(newIncident);
      console.log('added new incident!');
      res.send(newIncident);
    });
  }
};
