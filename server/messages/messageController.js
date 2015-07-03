var knex = require('../config/knex-config.js')
var Message = require('../db/models/message');
var Messages = require('../db/collections/messages');
var url = require('url')

module.exports = {
  getMessagesForIncident: function (req, res) {
    var uri = req.url;
    var incidentsId = (url.parse(uri).pathname).slice(1);
    console.log('incident: ', incidentsId)
    knex('messages').where({'incidentsId': incidentsId })
      .then(function (rows) {
        console.log(rows);
        res.send(rows);
      });
  },
  
  newMessage: function (req, res) {
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
  },

  deleteMessages: function(req,res,next) {
    console.log('deleting messages');
    Message.collection().fetch().then(function(collection) {
      collection.invokeThen('destroy').then(function() {
    // ... all models in the collection have been destroyed
        if (new Message().fetchAll().length > 0) {
          res.status(401).send({error: "unable to delete messages"});
        } else {
          res.status(200).send('messages table deleted');
        }
      });
    });
  }
};
