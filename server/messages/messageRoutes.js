var messageController = require('./messageController.js');

module.exports = function (app) {
  app.route('/')
    .post(messageController.newMessage);

  app.route('/:incidentId')
    .get(messageController.getMessagesForIncident);
};
