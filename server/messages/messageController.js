var knex = require('../config/knex-config.js')
var Message = require('../db/models/message');
var Messages = require('../db/collections/messages');

module.exports = {
  getMessagesForIncident: function (req, res) {
    var incidentsId = (url.parse(uri).pathname).slice(1);
    console.log('incident: ', incidentsId)
    knex('messages').where({'incidentsId': incidentsId })
      .then(function (rows) {
        console.log(rows);
        res.send(rows);
      });
  },
  newMessage: function (req, res) {
    console.log('in message controller')
    var messageData = {
      description: req.body.description,
      userId: req.body.userId,
      incidentsId: req.body.incidentsId
    }
    new Message(messageData).save().then(function (newMessage) {
      Messages.add(newMessage);
      console.log('added new message!');
      console.log(newMessage)
      res.send(newMessage);
    });
  }
};
