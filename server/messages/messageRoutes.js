var messageController = require('./messageController.js');

module.exports = function (app) {
  // app.route('/')
  //   .post(messageController.newMessage);

  app.route('/:incidentId')
    .post(messageController.newMessage);

  app.route('/')
    .get(messageController.getMessagesForIncident);
};
